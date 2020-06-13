import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";
import GetEmojiLayerConstructor from "./EmojiLayer.js";

const createMap = async (element) => {
  var childElement = document.createElement("div");
  element.appendChild(childElement);
  // More info on esri-loader's loadModules function:
  // https://github.com/Esri/esri-loader#loading-modules-from-the-arcgis-api-for-javascript
  const [
    Map,
    MapView,
    BaseLayerView2D,
    GraphicsLayer,
    Graphic,
    webMercatorUtils,
  ] = await loadModules(
    [
      "esri/Map",
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

  const map = new Map({
    basemap: "streets-vector",
    layers: [emojiLayer],
  });

  const viewOptions = {
    container: childElement,
    map: map,
    center: [0, 0],
    zoom: 2,
  };

  new MapView(viewOptions);
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
