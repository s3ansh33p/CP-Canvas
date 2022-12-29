import { PegDecoratedWindow } from "../PEG/pdecwin";
import type { PegRect } from "../PEG/pegtypes";

export const DEFAULT_FRAME_UI_WIDTH = 0

export class CPMainFrame extends PegDecoratedWindow {
    constructor (
        rect: PegRect,
        frame_ui_width: number = DEFAULT_FRAME_UI_WIDTH
    ) {
        super(rect, 0) // TODO: check the flag
        // TODO: reverse this part 
    }

}