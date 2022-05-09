export function cleanNumber(value) {
    return +value.toString().replace(/\*|,|%/g, '');
}

export function addCommas(number) {
    return cleanNumber(number).toLocaleString();
}

export function stringifyProperties(object) {
    if (!object) return object;
    if (Array.isArray(object)) return object.map(stringifyProperties);

    const newObject = {};
    for (const p of Object.keys(object)) {
        if (typeof object[p] === 'object') newObject[p] = stringifyProperties(object[p]);
        else if (typeof object[p] === 'number') newObject[p] = addCommas(object[p]);
        else newObject[p] = object[p]?.toString();
    }
    return newObject;
}