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
    FeatureLayer,
    BaseLayerView2D,
    GraphicsLayer,
    Graphic,
    webMercatorUtils,
    Multipoint,
  ] = await loadModules(
    [
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/views/2d/layers/BaseLayerView2D",
      "esri/layers/GraphicsLayer",
      "esri/Graphic",
      "esri/geometry/support/webMercatorUtils",
      "esri/geometry/Multipoint",
    ],
    {
      css: true,
    }
  );

  const featureLayer = new FeatureLayer({
    portalItem: {
      // autocasts as new PortalItem()
      id: "710323311863451b9aece9722f8c0ac0",
    },
    outFields: ["*"],
    visible: false,
  });

  const EmojiLayerConstructor = GetEmojiLayerConstructor(
    BaseLayerView2D,
    GraphicsLayer
  );

  const map = new Map({
    basemap: "streets-vector",
    layers: [featureLayer],
  });

  const viewOptions = {
    container: childElement,
    map: map,
    center: [0, 0],
    zoom: 2,
  };

  const view = new MapView(viewOptions);
  view.when(() => {
    featureLayer.when(() => {
      const query = featureLayer.createQuery();
      featureLayer.queryFeatures(query).then((results) => {
        const emojiLayer = new EmojiLayerConstructor({
          graphics: results.features,
        });
        map.add(emojiLayer);
        const multiPoint = new Multipoint({
          points: results.features.map((feature) => {
            return [feature.geometry.longitude, feature.geometry.latitude];
          }),
        });
        view.extent = multiPoint.extent.expand(1.5);
      });
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
