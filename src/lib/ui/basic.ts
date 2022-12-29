import { Debug_Printf, Debug_PrintString, Debug_SetCursorPosition, fillScreen, LCD_Refresh, line, setPixel, triangle, color } from "../drawing";
import { CPMainFrame } from "./cp/cpmainframe";
import { CPModuleWindow } from "./cp/cpmodulewindow";
import { CPCanvasScreen } from "./cp/cpscreen";
import { MAINFRAME_LEFT, MAINFRAME_TOP, MAINFRAME_RIGHT, MAINFRAME_BOTTOM } from "./cp/windowsize";
import { BLACK, PegColor, PegPoint, PegRect } from "./PEG/pegtypes";
import { PegMessage, PegMessageQueue, PegSystemMessage } from "./PEG/pmessage";
import { PegPresentationManager } from "./PEG/ppresent";
import type { PegScreen } from "./PEG/pscreen";
import { PegThing } from "./PEG/pthing";


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
        debugger
        this.BeginDraw()
        this.DrawFrame()
        let pp: PegPoint = new PegPoint(10,10)
        let col = BLACK
        // DrawTextR(pp, "Hello World",col, PegTextThing.GetBasicFont())
        this.EndDraw()
    }
}

function PegAppInitialize(pPresentation: PegPresentationManager) {
	fillScreen(color(64,64,64));

    // TODO: find where it comes from ?
    // pPresentation PegPresentationManager = ???
	
    const rect: PegRect = PegRect.Set(MAINFRAME_LEFT, MAINFRAME_TOP, MAINFRAME_RIGHT, MAINFRAME_BOTTOM);

    
    const mw: CPMainFrame = new ScribbleFrame(rect)

    let childRect: PegRect = mw.FullAppRectangle();
    let swin: ScribbleWindow = new ScribbleWindow(childRect,mw);
    mw.SetTopWindow(swin);
    pPresentation.Add(mw);

	// Debug_Printf(10, 1, false, "Test" + rect.wTop+":"+rect.wLeft+":"+rect.wBottom+":"+rect.wRight);

	LCD_Refresh();
}



// test some fake main ?
export function WinMain() {
    console.log("Initializing PEG")
    let szAppName = "Peg Application"

    // create the screen interface object
    let rect: PegRect = PegRect.Set(MAINFRAME_LEFT, MAINFRAME_TOP, MAINFRAME_RIGHT, MAINFRAME_BOTTOM)

    let pScreen: PegScreen = new CPCanvasScreen(rect)
    PegThing.SetScreenPtr(pScreen)

    // create the PEG message Queue
    let pMsgQueue: PegMessageQueue = new PegMessageQueue()
    PegThing.SetMessageQueuePtr(pMsgQueue)

    // create the screen manager
    let pPresentation: PegPresentationManager = new PegPresentationManager(rect)
    PegThing.SetPresentationManagerPtr(pPresentation)

    // #ifdef PEG_FULL_CLIPPING
    // pScreen.GenerateViewportList(pPresentation)


    PegAppInitialize(pPresentation)

    pScreen.Invalidate(pPresentation.mReal)
    let newMessage: PegMessage = new PegMessage(PegSystemMessage.PM_DRAW)
    newMessage.pTarget = pPresentation
    pMsgQueue.Push(newMessage)

    /*
        console.log("Initializing Keyboard")
        let pK: CKeyboard = CKeyboard.GetInstance()
        pK.LockKeyboard()
        pK.SetKeymap(key_map)
    */
}
