// see draw_functions.hpp by InterChan
import { setPixel, INT_RGB565TO888, type RGBColor } from '../drawing'
import { getFontBinary, getTextureBinary } from './loader';
import { SIN } from './trig'

export const LOAD_TEXTURE_PTR = (path: string) => load_texture(path)
export const LOAD_FONT_PTR = (path: string) => load_font(path)
export const DRAW_TEXTURE = (texturepointer: Uint16Array, x: number, y: number) => draw_texture_shader(texturepointer, x, y, 1, 0)
export const DRAW_TEXTURE_FRAME = (texturepointer: Uint16Array, x: number, y: number, frame: number) => draw_texture_shader(texturepointer, x, y, 2, frame)
export const DRAW_FONT = (fontpointer: Uint8Array, text: string, x: number, y: number, color: RGBColor, wrapLength: number) => draw_font_shader(fontpointer, text, x, y, color, wrapLength, 1, 0, 0)

function uint8to16(highByte: number, lowByte: number): number {
    return (highByte << 8) | lowByte;
}

async function load_font(fontpath: string): Promise<Uint8Array> {
    return await getFontBinary(fontpath);
}

async function load_texture(texturepath: string): Promise<Uint16Array> {
    const texture = await getTextureBinary(texturepath);
    // convert to 16-bit
    const texture16 = new Uint16Array(texture.length / 2);
    for (let i = 0; i < texture.length; i += 2) {
        texture16[i / 2] = uint8to16(texture[i], texture[i + 1]);
    }
    return texture16;
}
// http://127.0.0.1:5173/

function draw_texture_shader(texturepointer: Uint16Array, x: number, y: number, shaderID: number, shaderArg: number) {
    let w = texturepointer[0];
    let h = texturepointer[1];
    let k = 2;
    console.log(texturepointer[2], INT_RGB565TO888(texturepointer[2]));
    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            shader(x, y, w, h, i, j, INT_RGB565TO888(texturepointer[k]), shaderID, shaderArg);
            k++;
        }
    }
}

const CHAR_SPACING = 1;
function draw_font_shader(fontpointer: Uint8Array, text: string, x: number, y: number, color: RGBColor, wrapLength: number, lineSpacing: number, shaderID: number, shaderArg: number) {
    let w = uint8to16(fontpointer[0], fontpointer[1]);
    let h = uint8to16(fontpointer[2], fontpointer[3]);
    let newlines = 0;
    let chars_since_newline = 0;
    for (let textchar = 0; textchar < text.length; textchar++) { // repeat for each character in text
        // get charcode of current character
        let charcode = text[textchar].charCodeAt(0);
        if (charcode == 10) {
            newlines++;
            chars_since_newline = 0;
        } else if (charcode >= 32 && charcode <= 126) {
            if (wrapLength > 0 && (w+CHAR_SPACING)*(chars_since_newline+1) > wrapLength) {
                newlines++;
                chars_since_newline = 0;
            }
            let current_byte = Math.floor((charcode-32)*w*h/8) + 4;
            let current_bit = 128 >> (((charcode-32)*w*h)%8);
            for (let charbit = 0; charbit < w*h; charbit++) { // read bits of the target font character and draw pixels
                if (fontpointer[current_byte] & current_bit) {
                    shader(x, y, w, h, charbit % w + (w+CHAR_SPACING)*chars_since_newline, Math.floor(charbit / w) + (h+lineSpacing)*newlines, color, shaderID, shaderArg);
                }
                current_bit >>= 1;
                if (current_bit < 1) {
                    current_bit = 128;
                    current_byte++;
                }
            }
            chars_since_newline++;
        }

    }
}

const TRANSPARENCY_COLOR: RGBColor = [248, 0, 248] // or #0xF81F - gets converted to 248 not 255
// function to check if a pixel is transparent
function isTransparent(color: RGBColor) {
    return color[0] == TRANSPARENCY_COLOR[0] && color[1] == TRANSPARENCY_COLOR[1] && color[2] == TRANSPARENCY_COLOR[2];
}

// color is in 16tbit RGB565 format
function shader(x: number, y: number, w: number, h: number, i: number, j: number, color: RGBColor, shaderID: number, shaderArg: number) {
    switch (shaderID) {
        default: case 0:
            // no effects
            setPixel(x + i, y + j, color);
            break;
        case 1:
            // cutout (default shader, used by DRAW_TEXTURE)
            if (!isTransparent(color)) {
                setPixel(x + i, y + j, color);
            }
            break;
        case 2:
            // frame selection + cutout (for textures containing multiple "frames", useful for rotation, animations and texture variants. see texture_rotator.py)
            // (this uses the texture width as the height of one frame, so make sure the frames are square)
            if (j / w == shaderArg) {
                shader(x, y - shaderArg * w, w, h, i, j, color, 1, 0);
            }
            break;
        case 3:
            // scaling of 4 + sine wavy effect, the amplitude is fixed but shaderArg alters the period
            for (let b = 0; b < 4; b++) {
                for (let a = 0; a < 4; a++) {
                    setPixel(x + i * 4 + a + Math.floor(SIN((j*4+b) * shaderArg / 2, 60)), y + j * 4 + b, color);
                }
            }
            break;
        case 4:
            // scaling of 4 + drop shadow
            for (let b = 0; b < 4; b++) {
                for (let a = 0; a < 4; a++) {
                    shader(x, y, w, h, i * 4 + a, j * 4 + b, color, 5, shaderArg);
                }
            }
            break;
        case 5:
            // drop shadow for each pixel with color shaderArg
            if (!isTransparent(color)) {
                setPixel(x + i, y + j, color);
                // setPixel(x + i + 1, y + j + 1, shaderArg);
                // convert shaderArg to 16bit RGB565
                let shaderArg16 = INT_RGB565TO888(shaderArg);
                setPixel(x + i + 1, y + j + 1, shaderArg16);
            }
            break;
    }
}
