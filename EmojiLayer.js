export default function EmojiLayer(BaseLayerView2D, FeatureLayer) {
  // PART A: custom extension of BaseLayerView2D
  const CustomLayerView2D = BaseLayerView2D.createSubclass({
    // constructor
    // attach
    // render
    // detach

    // implementation of render method in BaseLayerView2D
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-2d-layers-BaseLayerView2D.html#render
    render: function (renderParameters) {
      // state is a ViewState instance
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-2d-ViewState.html
      const state = renderParameters.state;

      // ctx is sometimes the convention for canvas 2d rendering context
      const ctx = renderParameters.context;
      // const canvas = ctx.canvas;

      console.log('RENDER', renderParameters, this.layer);
      // this.layer.graphics.forEach((graphic) => {
      //   const mapCoords = [graphic.geometry.x, graphic.geometry.y];
      //   // console.log("mapCoords", mapCoords);
      //   // screenCoords array is modified in-place by state.toScreen()
      //   const screenCoords = [0, 0];
      //   state.toScreen(screenCoords, mapCoords[0], mapCoords[1]);

      //   ctx.font = "40px serif";
      //   // use these alignment properties for "better" positioning
      //   ctx.textAlign = "center";

      //   if (graphic.attributes.hasOwnProperty(this.layer.attribute)) {
      //     const replaceStr = `:${
      //       this.layer.attributePrefix
      //     }${graphic.attributes[this.layer.attribute].toLowerCase()}:`;

      //     ctx.fillText(
      //       this.layer.emoji.replace_colons(replaceStr),
      //       screenCoords[0],
      //       screenCoords[1]
      //     );
      //   } else {
      //     ctx.fillText("😂", screenCoords[0], screenCoords[1]);
      //   }
      // });
    },
  });

  // PART B: custom extension of FeatureLayer,
  // which relies on the CustomLayerView2D defined in PART A above
  // NOTE: by extending from the FeatureLayer module instead of the Layer module,
  // we get built-in and familiar functionality for adding/removing graphics
  const CustomLayer = FeatureLayer.createSubclass({
    constructor: function (attrs) {
      this.emoji = new EmojiConvertor();
      this.emoji.replace_mode = "unified";
      this.emoji.allow_native = true;

      if (attrs.hasOwnProperty("attribute")) {
        this.attribute = attrs.attribute;
      } else {
        this.attribute = "emoji";
      }

      if (attrs.hasOwnProperty("attributePrefix")) {
        this.attributePrefix = attrs.attributePrefix;
      } else {
        this.attributePrefix = "";
      }
    },

    createLayerView: function (view) {
      console.log('createLayerView', view);
      if (view.type === "2d") {
        return new CustomLayerView2D({
          view: view,
          layer: this,
        });
      }
    },
  });

  return CustomLayer;
}
