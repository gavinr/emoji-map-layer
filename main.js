import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";

const createMap = async (element) => {
  var childElement = document.createElement("div");
  element.appendChild(childElement);
  // More info on esri-loader's loadModules function:
  // https://github.com/Esri/esri-loader#loading-modules-from-the-arcgis-api-for-javascript
  const [Map, MapView] = await loadModules(["esri/Map", "esri/views/MapView"], {
    css: true,
  });

  const map = new Map({
    basemap: "streets-vector",
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
