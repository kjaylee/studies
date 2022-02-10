export interface Coordinates {
    longitude: number,
    latitude: number
}
export interface GeoArc   {
    type: string,
    coordinates: Coordinates
}
export interface Point {
    x: number,
    y: number
}
export interface EarthProps {
    index: number,
    callback: ()=>void
}