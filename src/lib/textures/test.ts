import { charmap } from "../../common/font";
import { LCD_Refresh } from "../drawing";
import { DRAW_FONT, LOAD_FONT_PTR } from "./draw_functions";

export function test_custom_fonts() {
    // LOAD_FONT_PTR("font_7x8", pointer); - c++ version
    let fontp = LOAD_FONT_PTR("font_7x8");
    let fontp2 = LOAD_FONT_PTR("font_5x6");
    DRAW_FONT(fontp, charmap.slice(0,36), 0, 70, [255, 255, 255], 0);
    DRAW_FONT(fontp, charmap.slice(36,72), 0, 80, [255, 255, 255], 0);
    DRAW_FONT(fontp, charmap.slice(72), 0, 90, [255, 255, 255], 0); 
    DRAW_FONT(fontp2, charmap.slice(0,36), 0, 100, [255, 255, 255], 0); 
    DRAW_FONT(fontp2, charmap.slice(36,72), 0, 110, [255, 255, 255], 0); 
    DRAW_FONT(fontp2, charmap.slice(72), 0, 120, [255, 255, 255], 0); 

    LCD_Refresh();
}
