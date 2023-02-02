import { charmap } from "../../common/font";
import { WIDTH, HEIGHT } from "../../specs";
import { color, fillScreen, LCD_Refresh, line, rectangle, setPixel, type RGBColor } from "../drawing";
import { DRAW_FONT, LOAD_FONT_PTR, LOAD_TEXTURE_PTR, DRAW_TEXTURE, DRAW_TEXTURE_FRAME } from "./draw_functions";

export async function test_custom_fonts() {
    // LOAD_FONT_PTR("font_7x8", pointer); - c++ version
    let fontp = await LOAD_FONT_PTR("7x8");
    let fontp2 = await LOAD_FONT_PTR("5x6");
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

export async function test_sandbox() {
    fillScreen([0, 0, 0]);

    function drawGrid() {
        let color: RGBColor = [30, 30, 30];
        // for (let i = 1; i < 32; i += 2) {
        //     line(0, HEIGHT/32 * i, WIDTH, HEIGHT/32 * i, color);
        // }
        // color = [60, 60, 60];
        // for (let i = 1; i < 16; i += 2) {
        //     line(WIDTH/16 * i, 0, WIDTH/16 * i, HEIGHT, color);
        // }
        // color = [90, 90, 90];
        // for (let i = 1; i < 16; i += 2) {
        //     line(0, HEIGHT/16 * i, WIDTH, HEIGHT/16 * i, color);
        // }
        // color = [0, 0, 120];
        // for (let i = 1; i < 8; i += 2) {
        //     line(WIDTH/8 * i, 0, WIDTH/8 * i, HEIGHT, color);
        // }    
        // color = [150, 150, 150];
        // for (let i = 1; i < 8; i += 2) {
        //     line(0, HEIGHT/8 * i, WIDTH, HEIGHT/8 * i, color);
        // }
        color = [180, 180, 180];
        line(WIDTH/4, 0, WIDTH/4, HEIGHT, color);
        line(WIDTH/4 * 3, 0, WIDTH/4 * 3, HEIGHT, color);
        color = [190, 190, 190];
        line(0, HEIGHT/4, WIDTH, HEIGHT/4, color);
        line(0, HEIGHT/4 * 3, WIDTH, HEIGHT/4 * 3, color);
        color = [220, 220, 220];
        line(WIDTH/2, 0, WIDTH/2, HEIGHT, color);
        color = [255, 255, 255];
        line(0, HEIGHT/2, WIDTH, HEIGHT/2, color);
    }
    
    drawGrid()
    LCD_Refresh();

    // algorithm to divide the screen into halves, then keep dividing each half into halves, etc.
    // each will be stored in a variable, and when pixel is drawn, it will be noted in which half it is
    // then, when the screen is refreshed, only the half that has changed will be refreshed, going down the tree

    // 0 = nothing, 1 = something
    let tree1 = Array.from({length: 2}, () => 0); // top and bottom
    let tree2 = Array.from({length: 4}, () => 0); // top left, top right, bottom left, bottom right
    let tree3 = Array.from({length: 8}, () => 0); 
    let tree4 = Array.from({length: 16}, () => 0);
    let tree5 = Array.from({length: 32}, () => 0);
    let tree6 = Array.from({length: 64}, () => 0);
    let tree7 = Array.from({length: 128}, () => 0);
    let tree8 = Array.from({length: 256}, () => 0);

    // draw a pixel
    function drawPixel(x: number, y: number, color: RGBColor) {
        setPixel(x, y, color);
        // calc trees
        tree1[Math.floor(y / HEIGHT * 2)] = 1;
        tree2[Math.floor(y / HEIGHT * 2) + Math.floor(x / WIDTH * 2) * 2] = 1;
        tree3[Math.floor(y / HEIGHT * 4) + Math.floor(x / WIDTH * 2) * 4] = 1;
        // [(1,1),(1,2),(2,1),(2,2),(3,1),(3,2),(4,1),(4,2),(1,3),(1,4),(2,3),(2,4),(3,3),(3,4),(4,3),(4,4)] tree4
        if (x < WIDTH/2) {
            // left side
            tree4[Math.floor(x / WIDTH * 4) + Math.floor(y / HEIGHT * 4) * 2] = 1;
        } else {
            // right side
            tree4[Math.floor(x / WIDTH * 4) - 2 + Math.floor(y / HEIGHT * 4) * 2 + 8] = 1;
        }
    }

    // drawPixel(9, 9, [255, 0, 0]);
    // drawPixel(129, 11, [255, 0, 0]);
    // drawPixel(129, 219, [255, 0, 0]);
    drawPixel(209, 309, [255, 0, 0]);
    // for (let i = 0; i < 256; i++) {
    //     drawPixel((i % 16) * WIDTH/16 + WIDTH/32, Math.floor(i / 16) * HEIGHT/16 + HEIGHT/32, [255, 0, 0]);
    // }

    LCD_Refresh();
    
    console.log(tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8);

    function getTree(level: number): number[] {
        switch (level) {
            case 1: return tree1;
            case 2: return tree2;
            case 3: return tree3;
            case 4: return tree4;
            case 5: return tree5;
            case 6: return tree6;
            case 7: return tree7;
            case 8: return tree8;
        }
    }
    
    // what did change?
    // go down each tree and until we have tree 6, and log what changed
    // start with tree 1
    function recursiveTreeSearch(min, level) {
        let tree = getTree(level);
        // let's say we are level 1, with 2 elements
        // top and bottom, with 1 if changed, 0 if not
        // min will start at 0, max will evaluate to 1
        // if all 0, do nothing
        console.log([tree[min], tree[min + 1]], min, level);
        for (let i = min; i <= min + 1; i++) {
            if (tree[i] == 1) {
                // if we are at tree 1, we can refresh
                if (level == 4) {
                    // refresh and note x and y of the top left corner
                    let xm = 4;
                    let ym = 4;
                    // console.log("L3: Cell " + (i) + " (" + (Math.floor(i / ym)) + "," + ((i % ym)) + ")");
                    // let x = Math.floor(i / ym) * WIDTH / xm;
                    // let y = Math.floor(i % ym) * HEIGHT / ym;
                    // undo the math
                    let x;
                    let y;
                    console.log("L4: Cell " + (i));
                    if (i < 8) {
                        // left side calc
                        // x is 0 if i is odd
                        x = (i % 2) * WIDTH / xm;
                        y = Math.floor(i / 2) * HEIGHT / ym;
                    } else {
                        // right side calc
                        x = (i % 2 + 2) * WIDTH / xm; // add x offset
                        y = (Math.floor(i / 2) - 4) * HEIGHT / ym; // add y offset
                    }


                    let xMax = x + WIDTH / xm;
                    let yMax = y + HEIGHT / ym;
                    console.log("Copying " + (xMax - x) + "x" + (yMax - y) + " (" + (xMax - x) * (yMax - y) + "px)"); 
                    line(x, y, xMax, yMax, [0, 255, 0]);
                } else {
                    recursiveTreeSearch(i * 2, level + 1);
                }
            }
        }

    }
    recursiveTreeSearch(0, 1);

    LCD_Refresh();

}

export async function test_virtual_keyboard() {
    // set to black
    fillScreen([0, 0, 0]);
    // create a virtual keyboard
    let fontp = await LOAD_FONT_PTR("7x8_up2x");
    let fontp2 = await LOAD_FONT_PTR("5x6");
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

