import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";
import GetEmojiLayerConstructor from "./EmojiLayer.js";

const createMap = async (element) => {
  var childElement = document.createElement("div");
  element.appendChild(childElement);
  // More info on esri-loader's loadModules function:
  // https://github.com/Esri/esri-loader#loading-modules-from-the-arcgis-api-for-javascript
  const [
    WebMap,
    MapView,
    BaseLayerView2D,
    GraphicsLayer,
    Graphic,
    webMercatorUtils,
  ] = await loadModules(
    [
      "esri/WebMap",
      "esri/views/MapView",
      "esri/views/2d/layers/BaseLayerView2D",
      "esri/layers/GraphicsLayer",
      "esri/Graphic",
      "esri/geometry/support/webMercatorUtils",
    ],
    {
      css: true,
    }
  );

  const initialGraphics = [
    new Graphic({
      geometry: webMercatorUtils.geographicToWebMercator({
        type: "point",
        longitude: -90.29452,
        latitude: 38.639375,
      }),
      attributes: {
        name: "Art Museum",
      },
    }),
    new Graphic({
      geometry: webMercatorUtils.geographicToWebMercator({
        type: "point",
        longitude: -90.1849,
        latitude: 38.62463,
      }),
      attributes: {
        name: "Gateway Arch",
      },
    }),
  ];

  const EmojiLayerConstructor = GetEmojiLayerConstructor(
    BaseLayerView2D,
    GraphicsLayer
  );
  const emojiLayer = new EmojiLayerConstructor({
    graphics: initialGraphics,
  });

  const LAYER_IDS = ["172aef2c8db-layer-0"];
  const map = new WebMap({
    portalItem: {
      // autocasts as new PortalItem()
      id: "72f2f3b923cd446ab31d398950adc4e9",
    },
  });

  const view = new MapView({
    container: childElement,
    map: map,
  });

  view.when(() => {
    // const layers = map.layers.toArray().filter((layer) => {
    //   return layer && LAYER_IDS.indexOf(layer.id) > -1;
    // });

    map.layers.toArray().forEach((layer) => {
      if (layer && LAYER_IDS.indexOf(layer.id) > -1) {
        console.log("layer to work on:", layer);
      }
      // I don't think I can just swap the LayerView on this layer, so I
      // need to grab the Features (Graphics) and remove the layer and re-add it.
    });
  });
};

window.addEventListener(
  "load",
  () => {
    const rootElement = document.body;
    console.log("re", rootElement);
    createMap(rootElement);
  },
  false
);
