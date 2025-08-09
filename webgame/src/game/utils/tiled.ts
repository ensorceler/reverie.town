
// Helper method to get properties from Tiled objects
/* custom properties in any tiled object
{
    "id": 2,
    "name": "exit_to_A1",
    "type": "portal",
    "rotation": 0,
    "properties": [
        {
            "name": "direction",
            "type": "string",
            "value": "left"
        },
        {
            "name": "target_scene",
            "type": "string",
            "value": "building_A_interior_A1"
        },
        {
            "name": "target_spawn",
            "type": "string",
            "value": "exit_A2_spawn"
        }
    ],
    "visible": true,
    "x": 107.5,
    "y": 193,
    "width": 20.5,
    "height": 83.5,
    "rectangle": true
}
*/
export function getCustomPropertyFromTiledObject(obj: Phaser.Types.Tilemaps.TiledObject, propertyName: string, defaultValue: any = null) {
    const property = obj.properties?.find((prop: any) => prop.name === propertyName);
    return property ? property.value : defaultValue;
}
