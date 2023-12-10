export function replaceStringAt(str: string, index: number, replacement: string): string {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

/**
 * Implementation of the even-odd rule in JS, also known as the Point-in-Polygon problem. \
 * https://www.algorithms-and-technologies.com/point_in_polygon/javascript/
 * @param polygon the polygon as a sequence of point coordinates
 * @param point the point we're trying to analyze
 * @returns true if the given point is inside the polygon
 */
export function findPointInPolygon(polygon: number[][], point: number[]) {
    let odd = false
    for (let i = 0, j = polygon.length-1; i < polygon.length; i++) {
        if (
            ((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) 
            && (point[0] < ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
            odd = !odd
        }
        j = i
    }
    return odd
}