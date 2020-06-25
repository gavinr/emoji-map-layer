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
  const [WebMap, MapView, BaseLayerView2D] = await loadModules(
    [
      "esri/WebMap",
      "esri/views/MapView",
      "esri/views/2d/layers/BaseLayerView2D",
    ],
    {
      css: true,
    }
  );

  const urlParams = new URLSearchParams(window.location.search);
  let webmapId = urlParams.get("webmap");
  let layerId = urlParams.get("layer");
  let attribute = urlParams.get("attribute");
  let attributePrefix = urlParams.get("attribute_prefix");

  if (!webmapId) {
    webmapId = "745ce18cfc0549b6a01be05cb9634a83"; // default
  }

  if (!attribute) {
    attribute = "emoji"; // default
  }
  if (!attributePrefix) {
    attributePrefix = ""; // default
  }

  const webmap = new WebMap({
    portalItem: {
      id: webmapId,
    },
  });

  await webmap.loadAll();

  if (!layerId) {
    // arbitrarily choose the first featureLayer as default
    layerId = webmap.allLayers.find((layer) => {
      return layer.type === "feature";
    }).id;
  }

  const layer = webmap.allLayers.find((layer) => {
    return layer.id === layerId;
  });

  if (!layer) {
    console.error(
      "Could not find that layer. Try one of these? -> " +
        webmap.allLayers
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
    map: webmap,
  };

  new MapView(viewOptions);
};

window.addEventListener(
  "load",
  () => {
    const rootElement = document.body;
    createMap(rootElement);
  },
  false
);
