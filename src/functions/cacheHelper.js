import path from 'path';
import fs from 'fs';

const cache = {};

export async function getJson(filePath) {
    if (cache[filePath]) return cache[filePath];
    const cacheExists = fs.existsSync(filePath);
    if (!cacheExists) {
        fs.mkdirSync(filePath.split(path.sep).slice(0, -1).join(path.sep), { recursive: true });
        fs.writeFileSync(filePath, '{}');
    }

    const fileContent = !cacheExists ? '{}' : fs.readFileSync(filePath).toString();
    const parsedJson = await new Promise(r => r(JSON.parse(fileContent)))
        .catch(() => fs.writeFileSync(filePath, '{}')) || {};

    return parsedJson;
}

export async function saveJson(filePath, json) {
    cache[filePath] = json;
    const fileContent = JSON.stringify(json, null, 4);
    fs.writeFileSync(filePath, fileContent);
}

export async function getCache() {
    return cache;
}