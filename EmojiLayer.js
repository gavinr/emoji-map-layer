export default function EmojiLayer(
  BaseLayerView2D,
  attribute,
  attributePrefix
) {
  const CustomLayerView2D = BaseLayerView2D.createSubclass({
    // constructor
    // attach
    // render
    // detach

    attach: function () {
      var query = this.layer.createQuery();
      query.outSpatialReference = this.layer.spatialReference;

      // should I be doing this???? ->
      this.layer.queryFeatures(query).then((res) => {
        this.graphics = res.features;
      });
    },

    // implementation of render method in BaseLayerView2D
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-2d-layers-BaseLayerView2D.html#render
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

          if (graphic.attributes.hasOwnProperty(this.view.attribute)) {
            const replaceStr = `:${
              this.view.attributePrefix
            }${graphic.attributes[this.view.attribute].toLowerCase()}:`;

            ctx.fillText(
              this.view.emoji.replace_colons(replaceStr),
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

  return function (view) {
    view.emoji = new EmojiConvertor();
    view.emoji.replace_mode = "unified";
    view.emoji.allow_native = true;

    if (attribute) {
      view.attribute = attribute;
    } else {
      view.attribute = "emoji";
    }

    if (attributePrefix) {
      view.attributePrefix = attributePrefix;
    } else {
      view.attributePrefix = "";
    }

    if (view.type === "2d") {
      return new CustomLayerView2D({
        view: view,
        layer: this,
      });
    } else {
      console.error("Problem: Not supported");
    }
  };
}
