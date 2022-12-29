import type { BOOL } from "../native/windows";
import { PegDecoratedWindow } from "../PEG/pdecwin";
import { PegRect } from "../PEG/pegtypes";
import { PCPModuleWindow, type CPModuleWindow } from "./cpmodulewindow";
import { PEG_VIRTUAL_XSIZE, PEG_VIRTUAL_YSIZE } from "./cpscreen";

export const DEFAULT_FRAME_UI_WIDTH = 0

export class CPMainFrame extends PegDecoratedWindow {
    protected m_main_window: PCPModuleWindow;
    protected m_top_window: PCPModuleWindow
    protected m_bottom_window: PCPModuleWindow
    //  static m_keypad: CPKeyboardManager
    protected m_active_window: PCPModuleWindow
    // protected m_state: FrameState
    // protected m_menu: PegMenuBar
    // protected mMemoryErrorWin: PegDialog
    // protected m_clipboard: CPClipboard
    // protected m_undo_thing: CPUndoThing
    protected m_undo_window: CPModuleWindow
    protected m_toolbar_added: BOOL = true
    protected m_sending_to_window: BOOL = true
    protected m_in_query_close: BOOL = true
    protected m_app_ui_left: number

    constructor (
        rect: PegRect,
        frame_ui_width: number = DEFAULT_FRAME_UI_WIDTH
    ) {
        super(rect, 0) // TODO: check the flag
        // TODO: reverse this part 
    }

    TopAppRectangle(): PegRect {
        //   *a1 = off_698D41CC;
        // return ClassPadDLLgcc_1644(a1);
        return PegRect.Set(0,0,0,0) // TODO
    }

	BottomAppRectangle(): PegRect {
        return PegRect.Set(0,0,0,0) // TODO
    }

	FullAppRectangle(): PegRect {
        return PegRect.Set(0,0,PEG_VIRTUAL_XSIZE,PEG_VIRTUAL_YSIZE) // TODO: unsure 
    }


    SetMainWindow(w: CPModuleWindow) {
        this.m_main_window = w

        // let pcp = new PCPModuleWindow(this as PCPModuleWindow, w)
        // pcp.operator=(this+108, char[20])

    }

    SetTopWindow(w: CPModuleWindow, draw: BOOL = true) {
        console.log("CPMainFrame::SetTopWindow(CPModuleWindow*, bool)")
        // TODO: reverse me !
    }

    SetBottomWindow(w: CPModuleWindow, draw: BOOL = true) {
        
    }

    Draw() {
        // classpaddllgcc_1820(a1)
        // => classpaddllgcc_1333(a1, v3)
        //    => v1 = classpaddllgcc_1317(v3, v4)
        //          => return classpaddllgcc_1330
        //    => v1+16(v1, a1) (sub_69600EC0)
        //          => 
        // => a1 + 128(a1: ptr, 1) (classpaddllgcc_1637 <== big and complex)
        // => a1 + 36(a1)
        // => classpaddllgcc_1789(a1)
        // => return classpaddllgcc_1321(a1)
        console.log("CPMainFrame::Draw")
    }

}