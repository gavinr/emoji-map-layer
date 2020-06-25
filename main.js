import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";
// import { customLayerView } from "./EmojiLayer.js";

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
  if (!layerId) {
    layerId = "710323311863451b9aece9722f8c0ac0"; // default
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

  const layer = webmap.allLayers.find((layer) => {
    return layer.id === layerId;
  });

  const CustomLayerView2D = BaseLayerView2D.createSubclass({
    attach: function () {
      // this.layer.load();
      var query = this.layer.createQuery();
      query.outSpatialReference = "102100";

      // should I be doing this???? ->
      this.layer.queryFeatures(query).then((res) => {
        this.graphics = res.features;
      });
    },
    render: function (renderParameters) {
      // state is a ViewState instance
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-2d-ViewState.html
      const state = renderParameters.state;

      // ctx is sometimes the convention for canvas 2d rendering context
      const ctx = renderParameters.context;
      // const canvas = ctx.canvas;

      if (this.graphics) {
        this.graphics.forEach((graphic) => {
          const mapCoords = [graphic.geometry.x, graphic.geometry.y];
          // screenCoords array is modified in-place by state.toScreen()
          const screenCoords = [0, 0];
          state.toScreen(screenCoords, mapCoords[0], mapCoords[1]);

          ctx.font = "40px serif";
          // use these alignment properties for "better" positioning
          ctx.textAlign = "center";

          if (graphic.attributes.hasOwnProperty(attribute)) {
            const replaceStr = `:${attributePrefix}${graphic.attributes[
              attribute
            ].toLowerCase()}:`;

            ctx.fillText(
              emojiConverter.replace_colons(replaceStr),
              screenCoords[0],
              screenCoords[1]
            );
          } else {
            ctx.fillText("😂", screenCoords[0], screenCoords[1]);
          }
        });
      }
    },
  });

  layer.createLayerView = function (view) {
    return new CustomLayerView2D({
      view: view,
      layer: this,
    });
  };

  const viewOptions = {
    container: childElement,
    map: webmap,
  };

  const view = new MapView(viewOptions);
};

window.addEventListener(
  "load",
  () => {
    const rootElement = document.body;
    createMap(rootElement);
  },
  false
);
