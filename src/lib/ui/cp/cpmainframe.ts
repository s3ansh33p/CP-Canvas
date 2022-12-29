import { PegDecoratedWindow } from "../PEG/pdecwin";
import { PegRect } from "../PEG/pegtypes";
import type { CPModuleWindow, PCPModuleWindow } from "./cpmodulewindow";
import { PEG_VIRTUAL_XSIZE, PEG_VIRTUAL_YSIZE } from "./cpscreen";

export const DEFAULT_FRAME_UI_WIDTH = 0

export class CPMainFrame extends PegDecoratedWindow {
    protected m_main_window: PCPModuleWindow;

    constructor (
        rect: PegRect,
        frame_ui_width: number = DEFAULT_FRAME_UI_WIDTH
    ) {
        super(rect, 0) // TODO: check the flag
        // TODO: reverse this part 
    }

    static TopAppRectangle(): PegRect {
        //   *a1 = off_698D41CC;
        // return ClassPadDLLgcc_1644(a1);
        return PegRect.Set(0,0,0,0)
    }

	static BottomAppRectangle(): PegRect {
        return PegRect.Set(0,0,0,0)
    }

	static FullAppRectangle(): PegRect {
        return PegRect.Set(0,0,PEG_VIRTUAL_XSIZE,PEG_VIRTUAL_YSIZE) // TODO: unsure 
    }


    SetMainWindow(w: CPModuleWindow) {
        this.m_main_window = w
    }

}