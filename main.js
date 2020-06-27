import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";
import EmojiCreateLayerView from "./EmojiLayer.js";

const emojiConverter = new EmojiConvertor();
emojiConverter.replace_mode = "unified";
emojiConverter.allow_native = true;

const createMap = async (element) => {
  var childElement = document.createElement("div");
  element.appendChild(childElement);
  // More info on esri-loader's loadModules function:
  // https://github.com/Esri/esri-loader#loading-modules-from-the-arcgis-api-for-javascript
  const [
    WebMap,
    WebScene,
    MapView,
    SceneView,
    BaseLayerView2D,
  ] = await loadModules(
    [
      "esri/WebMap",
      "esri/WebScene",
      "esri/views/MapView",
      "esri/views/SceneView",
      "esri/views/2d/layers/BaseLayerView2D",
    ],
    {
      css: true,
    }
  );

  const urlParams = new URLSearchParams(window.location.search);
  let webmapId = urlParams.get("webmap");
  let sceneId = urlParams.get("scene");
  let layerId = urlParams.get("layer");
  let attribute = urlParams.get("attribute");
  let attributePrefix = urlParams.get("attribute_prefix");

  if (!webmapId && !sceneId) {
    webmapId = "745ce18cfc0549b6a01be05cb9634a83"; // default
  }

  if (!attribute) {
    attribute = "emoji"; // default
  }
  if (!attributePrefix) {
    attributePrefix = ""; // default
  }

  let map;
  if (webmapId) {
    map = new WebMap({
      portalItem: {
        id: webmapId,
      },
    });
  } else if (sceneId) {
    map = new WebScene({
      portalItem: {
        id: sceneId,
      },
    });
  }

  await map.loadAll();

  if (!layerId) {
    // arbitrarily choose the first featureLayer as default
    layerId = map.allLayers.find((layer) => {
      return layer.type === "feature";
    }).id;
  }

  const layer = map.allLayers.find((layer) => {
    return layer.id === layerId;
  });

  if (!layer) {
    console.error(
      "Could not find that layer. Try one of these? -> " +
        map.allLayers
          .map((layer) => {
            return layer.id;
          })
          .toArray()
          .join(", ")
    );
  }

  // "EmojiCreateLayerView" returns a function that returns an instance
  // of our CustomLayerView2D
  layer.createLayerView = EmojiCreateLayerView(
    BaseLayerView2D,
    attribute,
    attributePrefix
  );

  const viewOptions = {
    container: childElement,
    map: map,
  };

  if (map.portalItem.type === "Web Scene") {
    new SceneView(viewOptions);
  } else {
    new MapView(viewOptions);
  }
};

window.addEventListener(
  "load",
  () => {
    const rootElement = document.body;
    createMap(rootElement);
  },
  false
);
