import { Debug_Printf, Debug_PrintString, Debug_SetCursorPosition, fillScreen, LCD_Refresh, line, setPixel, triangle, color } from "../drawing";
import { CPMainFrame } from "./cp/cpmainframe";
import { CPModuleWindow } from "./cp/cpmodulewindow";
import { MAINFRAME_LEFT, MAINFRAME_TOP, MAINFRAME_RIGHT, MAINFRAME_BOTTOM } from "./cp/windowsize";
import { BLACK, PegColor, PegPoint, PegRect } from "./PEG/pegtypes";


class ScribbleFrame extends CPMainFrame {
    constructor (
        rect: PegRect
    ) {
        super(rect)
    }

}

class ScribbleWindow extends CPModuleWindow {

    constructor(
        rect: PegRect,
        frame: CPMainFrame
    ) {
        super(rect, null, 0, frame)
    }

    Draw(): void {
        this.BeginDraw()
        // this.DrawFrame()
        let pp: PegPoint = new PegPoint(10,10)
        let col = BLACK
        // DrawTextR(pp, "Hello World",col, PegTextThing.GetBasicFont())
        this.EndDraw()
    }
}

export function drawGUI() {
	fillScreen(color(64,64,64));

    // TODO: find where it comes from ?
    // pPresentation PegPresentationManager = ???
	
    const rect: PegRect = PegRect.Set(MAINFRAME_LEFT, MAINFRAME_TOP, MAINFRAME_RIGHT, MAINFRAME_BOTTOM);

    
    const mw: CPMainFrame = new ScribbleFrame(rect)

    let childRect: PegRect = mw.FullAppRectangle();
    let swin: ScribbleWindow = new ScribbleWindow(childRect,mw);
    mw.SetTopWindow(swin);

    /*
    
	
	

	// Need to set a main window for this module.  In our case, it is the scribble window
	mw.SetMainWindow(swin);

	pPresentation.Add(mw);
    */

	Debug_Printf(10, 1, false, "Test" + rect.wTop+":"+rect.wLeft+":"+rect.wBottom+":"+rect.wRight);

	LCD_Refresh();
}