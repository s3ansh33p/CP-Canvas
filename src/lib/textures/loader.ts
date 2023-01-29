import { fontCache, textureCache } from "../../specs";
import { get } from 'svelte/store';

// decode base64 string to Uint8Array
export function decodeBase64(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// make a get request to /<path> and return the response as a Uint8Array
export async function getBinary(path: string): Promise<Uint8Array | null> {
    // before fetching, check if the file is already in the cache
    const cachedData = getBinaryFromCache(path);
    if (cachedData) {
        return cachedData;
    }
    const response = await fetch(path);
    if (response.ok) {
        // readAsDataURL() returns a base64 string, so we need to decode it
        const reader = new FileReader();
        const data = await new Promise<string>( async (resolve, reject) => {
            reader.addEventListener("load", () => {
                // check the content type
                if (reader.result?.toString().startsWith("data:application/octet-stream;base64,")) {
                    resolve(reader.result as string);
                } else {
                    reject(new Error(path + " is not a binary file or does not exist"));
                }
            });
            reader.addEventListener("error", () => {
                reject(reader.error);
            });
            reader.readAsDataURL(await response.blob());
        });
        // slice off the "data:application/octet-stream;base64," part
        const dataToCache = decodeBase64(data.slice(data.indexOf(",") + 1));
        addBinaryToCache(path, dataToCache);
        return dataToCache;
    } else {
        return null;
    }
}

export async function getFontBinary(path: string): Promise<Uint8Array | null> {
    return getBinary("/fnt/" + path);
}

export async function getTextureBinary(path: string): Promise<Uint8Array | null> {
    return getBinary("/" + path);
}

function addBinaryToCache(path: string, data: Uint8Array) {
    if (path.startsWith("/fnt/")) {
        fontCache.update(cache => {
            cache.push({ name: path, data });
            return cache;
        });
    } else {
        textureCache.update(cache => {
            cache.push({ name: path, data });
            return cache;
        });
    }
}

function getBinaryFromCache(path: string): Uint8Array | null {
    if (path.startsWith("/fnt/")) {
        const cache = get(fontCache);
        for (const entry of cache) {
            if (entry.name === path) {
                console.log("Cache hit for " + path);
                return entry.data;
            }
        }
    } else {
        const cache = get(textureCache);
        for (const entry of cache) {
            if (entry.name === path) {
                console.log("Cache hit for " + path);
                return entry.data;
            }
        }
    }
    return null;
}
