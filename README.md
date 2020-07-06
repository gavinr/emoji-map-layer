# Emoji Map Layer

Show emoji on your ArcGIS map.

## How to Use

1. Create a Hosted Feature Service on ArcGIS Online
2. Create an attribute column to store the emoji names.
3. Fill in the attribute column with emoji labels from [here](https://github.com/milesj/emojibase/blob/master/packages/generator/src/resources/shortcodes.ts). 
4. Create a web map that contains the Hosted Feature Service.
5. Load this url, replacing the ID of your web map and the attribute column name:
   ```
   https://gavinr.github.io/emoji-map-layer/?webmap=YYYYYYYYYYYYYYYYYYYYYYYYYYYY&attribute=ZZZZZ
   ```

## URL Parameters

- `webmap` - ID of the web map to use.
- `layer` - (optional) ID of a Feature Layer within the web map. *Default*: will arbitrarily choose the first FeatureLayer it finds.
- `attribute` - (optional) attribute column of where to look for the emoji name. *Default*: `emoji`
- `attribute_prefix` - (optional) string that will be prepended to each attribute, main usage is `flag-`. *Default*: `[nothing]`

## Examples

- https://gavinr.github.io/emoji-map-layer/?webmap=4c310d1dcb1340bca7230e077c630ac2&attribute=ISO&attribute_prefix=flag_
- https://gavinr.github.io/emoji-map-layer/?webmap=745ce18cfc0549b6a01be05cb9634a83&layer=172e920e3cd-layer-0

## Resources

- [Emoji name catalog](https://github.com/milesj/emojibase/blob/master/packages/generator/src/resources/shortcodes.ts)
- Flags (note about Windows 10): https://emojipedia.org/flags/

## Credit

- https://github.com/milesj/emojibase
- https://github.com/nolanlawson/emoji-picker-element
- https://js.arcgis.com
