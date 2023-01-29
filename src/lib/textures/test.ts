import { charmap } from "../../common/font";
import { WIDTH } from "../../specs";
import { color, fillScreen, LCD_Refresh, line } from "../drawing";
import { DRAW_FONT, LOAD_FONT_PTR, LOAD_TEXTURE_PTR, DRAW_TEXTURE, DRAW_TEXTURE_FRAME } from "./draw_functions";

export async function test_custom_fonts() {
    // LOAD_FONT_PTR("font_7x8", pointer); - c++ version
    let fontp = await LOAD_FONT_PTR("font_7x8");
    let fontp2 = await LOAD_FONT_PTR("font_5x6");
    DRAW_FONT(fontp, charmap.slice(0,36), 0, 70, [255, 255, 255], 0);
    DRAW_FONT(fontp, charmap.slice(36,72), 0, 80, [255, 255, 255], 0);
    DRAW_FONT(fontp, charmap.slice(72), 0, 90, [255, 255, 255], 0); 
    DRAW_FONT(fontp2, charmap.slice(0,36), 0, 100, [255, 255, 255], 0); 
    DRAW_FONT(fontp2, charmap.slice(36,72), 0, 110, [255, 255, 255], 0); 
    DRAW_FONT(fontp2, charmap.slice(72), 0, 120, [255, 255, 255], 0); 

    LCD_Refresh();
}

export async function test_custom_textures() {
    fillScreen([0, 0, 0]);
    console.log("Calling test_custom_textures");
    let fontp = await LOAD_FONT_PTR("5x6");
    DRAW_FONT(fontp, "Hello World", 30, 200, [255, 255, 255], 0);

    LCD_Refresh();

    let texp = await LOAD_TEXTURE_PTR("p_walk0");
    DRAW_TEXTURE(texp, 50, 50);

    LCD_Refresh();

}

export async function test_virtual_keyboard() {
    // set to black
    fillScreen([0, 0, 0]);
    // create a virtual keyboard
    let fontp = await LOAD_FONT_PTR("font_7x8_up2x");
    let fontp2 = await LOAD_FONT_PTR("font_5x6");
    // qwertyuiop
    const line1 = "1234567890";
    const line2 = "azertyuiop";
    const line3 = "qsdfghjklm";
    const line4 = "wxcvbn'";
    let xSpace = 28;
    let ySpace = 28;
    let yMin = 400;
    let leftX = WIDTH/2 - (line1.length * xSpace)/2;
    for (let i = 0; i < line1.length; i++) {
        DRAW_FONT(fontp, line1[i], leftX + i * xSpace, yMin, [255, 255, 255], 0);
        DRAW_FONT(fontp, line2[i], leftX + i * xSpace, yMin + ySpace, [255, 255, 255], 0);
        DRAW_FONT(fontp, line3[i], leftX + i * xSpace, yMin + ySpace * 2, [255, 255, 255], 0);
    }
    let leftX2 = WIDTH/2 - (line4.length * xSpace)/2;
    for (let i = 0; i < line4.length; i++) {
        DRAW_FONT(fontp, line4[i], leftX2 + i * xSpace, yMin + ySpace * 3, [255, 255, 255], 0);
    }
    // shift key
    DRAW_FONT(fontp2, "shift", leftX, yMin + ySpace * 3 + 7, [255, 255, 255], 0);
    // backspace key
    DRAW_FONT(fontp2, "back", WIDTH - xSpace * 2, yMin + ySpace * 3 + 7, [255, 255, 255], 0);

    // highlight the first key - rectangle around it
    let highlightColor = color(255, 255, 0);
    let hx = 1;
    let hy = 2;
    let startX = leftX - xSpace/4;
    let startY = yMin - ySpace/4;
    line(startX + hx * xSpace, startY + hy * ySpace, startX + (hx + 1) * xSpace, startY + hy * ySpace, highlightColor);
    line(startX + hx * xSpace, startY + hy * ySpace, startX + hx * xSpace, startY + (hy + 1) * ySpace, highlightColor);
    line(startX + (hx + 1) * xSpace, startY + hy * ySpace, startX + (hx + 1) * xSpace, startY + (hy + 1) * ySpace, highlightColor);
    line(startX + hx * xSpace, startY + (hy + 1) * ySpace, startX + (hx + 1) * xSpace, startY + (hy + 1) * ySpace, highlightColor);
    // lazy highlight the key "s"
    DRAW_FONT(fontp, "s", leftX + hx * xSpace, yMin + hy * ySpace, highlightColor, 0);

    LCD_Refresh();
}

