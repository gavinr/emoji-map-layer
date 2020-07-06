import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";
import EmojiCreateLayerView from "/EmojiLayer.js";
import { Picker } from "https://cdn.jsdelivr.net/npm/emoji-picker-element@1.0.3/index.min.js";

let currentEmoji = false;

const picker = new Picker({
  locale: "en",
});
document
  .querySelector("#sidebar")
  .appendChild(picker)
  .addEventListener("emoji-click", (event) => {
    console.log(event.detail);
    currentEmoji = event.detail;
  });

// const emojiConverter = new EmojiConvertor();
// emojiConverter.replace_mode = "unified";
// emojiConverter.allow_native = true;

const createMap = async (element) => {
  var split = Split(["#sidebar", "#viewDiv"], {
    sizes: [25, 75],
  });

  // More info on esri-loader's loadModules function:
  // https://github.com/Esri/esri-loader#loading-modules-from-the-arcgis-api-for-javascript
  const [WebMap, MapView, BaseLayerView2D, Graphic] = await loadModules(
    [
      "esri/WebMap",
      "esri/views/MapView",
      "esri/views/2d/layers/BaseLayerView2D",
      "esri/Graphic",
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
    container: element,
    map: webmap,
  };

  const mapView = new MapView(viewOptions);

  mapView.on("click", (evt) => {
    let attributes = {};
    attributes[attribute] = currentEmoji.emoji.shortcodes[0];

    let graphic = new Graphic({
      geometry: {
        type: "point", // autocasts as new Point()
        longitude: evt.mapPoint.longitude,
        latitude: evt.mapPoint.latitude,
      },
      attributes: attributes,
    });

    layer
      .applyEdits({
        addFeatures: [graphic],
      })
      .then((evt) => {
        console.log("evt", evt);
        layer.refresh();
      });
  });
};

window.addEventListener(
  "load",
  () => {
    const rootElement = document.querySelector("#viewDiv");
    createMap(rootElement);
  },
  false
);
