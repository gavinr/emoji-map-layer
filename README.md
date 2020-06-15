# Emoji Map Layer

Show emoji on your ArcGIS map.

## How to Use

1. Create a hosted feature service on ArcGIS Online
2. Create an attribute column to store the emoji names.
3. Fill in the attribute column with emoji labels from [here](https://unicodey.com/emoji-data/table.htm). Use the "colon" version - you don't have to include the colons though. For example:
   1. [TODO - example image]
4. Load this url, replacing the ID of your Feature Layer and the attribute column name:
   ```
   https://gavinr.github.io/emoji-map-layer/?layer=YYYYYYYYYYYYYYYYYYYYYYYYYYYY&attribute=ZZZZZ
   ```

## URL Parameters

- `layer` - ID of a Feature Layer from ArcGIS Online
- `attribute` - attribute column of where to look for the emoji name
- `attribute_prefix` - string that will be prepended to each attribute, main usage is `flag-`

## Examples

- https://gavinr.github.io/emoji-map-layer/?layer=782028ffbbfc47799f80e738f81c568d&attribute=ISO&attribute_prefix=flag-
- https://gavinr.github.io/emoji-map-layer/?layer=710323311863451b9aece9722f8c0ac0&attribute=emoji

## Resources

- Emoji name catalog: https://unicodey.com/emoji-data/table.htm
- Flags (note about Windows 10): https://emojipedia.org/flags/

## Credit

- https://github.com/iamcal/js-emoji
- https://github.com/iamcal/emoji-data
- https://js.arcgis.com
