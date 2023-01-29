import { Debug_Printf, Debug_PrintString, Debug_SetCursorPosition, fillScreen, LCD_Refresh, line, setPixel, triangle, color } from "../drawing";
import { CPMainFrame } from "./cp/cpmainframe";
import { CPModuleWindow } from "./cp/cpmodulewindow";
import { CPCanvasScreen, CreatePegScreen } from "./cp/cpscreen";
import { MAINFRAME_LEFT, MAINFRAME_TOP, MAINFRAME_RIGHT, MAINFRAME_BOTTOM } from "./cp/windowsize";
import { VerdanaFont16_data_table, VerdanaFont16_offset_table } from "./native/fonts";
import { PegDecoratedWindow } from "./PEG/pdecwin";
import { BLACK, FF_NONE, PegColor, PegPoint, PegRect, PSF_ACCEPTS_FOCUS, PSF_MOVEABLE, PSF_SIZEABLE, PSF_VISIBLE, TT_COPY, _s } from "./PEG/pegtypes";
import { PegTextThing, type PegFont } from "./PEG/pfonts";
import { PegMessage, PegMessageQueue, PegSystemMessage } from "./PEG/pmessage";
import { PegPresentationManager } from "./PEG/ppresent";
import type { PegScreen } from "./PEG/pscreen";
import { PegString } from "./PEG/pstring";
import { PegThing } from "./PEG/pthing";
import { PegWindow } from "./PEG/pwindow";


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
        console.log("ScribbleWindow::Draw")
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
	
    const rect: PegRect = PegRect.Set(MAINFRAME_LEFT, MAINFRAME_TOP, MAINFRAME_RIGHT, MAINFRAME_BOTTOM);

    const mw: CPMainFrame = new ScribbleFrame(rect)

    let childRect: PegRect = mw.FullAppRectangle(); // classpaddllgcc_1791 => 0x 00E3 009E 0021 0001 => [227, 158, 33, 1]
    let swin: ScribbleWindow = new ScribbleWindow(childRect,mw);
    mw.SetTopWindow(swin); // classpaddllgcc_1762
    mw.SetMainWindow(swin);
    pPresentation.Add(mw);

	// Debug_Printf(10, 1, false, "Test" + rect.wTop+":"+rect.wLeft+":"+rect.wBottom+":"+rect.wRight);

	LCD_Refresh();
}



// test some fake main ?
export function WinMain() {
    console.log("Initializing PEG")
    let szAppName = "Peg Application"

    peg_test(null)

    return;


    /*
        SetPegAppInitializeCALLBACK(PegAppInitialize);
        SetExtensionGetLangCALLBACK(ExtensionGetLang);
        return CPMain(hInstance, hPrevInstance, nShowCmd);
    */

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

/* tests */

export class TestViewMaster extends PegWindow {
    InitClient() {
        super.InitClient()
        this.AddStatus(PSF_VISIBLE)
    }

}

export class TestViewScreen extends PegDecoratedWindow {

    m_pMaster: TestViewMaster

    constructor(pMaster: TestViewMaster) {
        super(FF_NONE)
        this.m_pMaster = pMaster

        this.BuildScreen()

        this.AddStatus(PSF_VISIBLE)
    }

    BuildScreen() {
        let childRect: PegRect = PegRect.Set(0,0,239,159);
        this.InitClient()
        this.RemoveStatus(PSF_MOVEABLE|PSF_SIZEABLE)

        // draw the bitmap
        childRect.Set(80,62,200,125)
        // let p_icon_full_screen = new ProcessingInstruction(childRect, gbZipDiskBitmap)
        // p_icon_full_screen.RemoveStatus(PSF_ACCEPTS_FOCUS)
        // this.Add(p_icon_full_screen)

        // Title
        childRect.Set(0,5,239,29)
        let p_icon_text = new PegString(childRect, _s("Insert Disk"), 0, FF_NONE | TT_COPY);
        p_icon_text.SetFont(VerdanaFont16)
        p_icon_text.RemoveStatus(PSF_ACCEPTS_FOCUS)
        this.Add(p_icon_text)

        // headers
        childRect.Set(42, 127, 200, 150)
        let p_icon_text_2 = new PegString(childRect, _s("Insert Zip Disk"), 0, FF_NONE | TT_COPY);
        p_icon_text_2.SetFont(VerdanaFont16)
        p_icon_text.RemoveStatus(PSF_ACCEPTS_FOCUS)
        this.Add(p_icon_text_2)
    }

    Message(mesg: PegMessage): number {
        return super.Message(mesg)
    }

    Draw(): void {
        this.BeginDraw()
        super.Draw()

        let rtTitle: PegRect = PegRect.Set(0,0,239,29)
        this.Screen().InvertRect(this, rtTitle)
        this.EndDraw()
    }

}

const VerdanaFont16: PegFont = {
    uType: 1,
    uAscent: 25,
    uDescent: 0,
    uHeight: 25,
    wBytesPerLine: 484,
    wFirstChar: 0,
    wLastChar: 255,
    pOffsets: VerdanaFont16_offset_table,
    pNext: null,
    pData: VerdanaFont16_data_table,
}

export function peg_test(data) {
    // Fix global defaults

    PegTextThing.SetDefaultFont(1, VerdanaFont16)
    // Code begins here

    let pMsgQueue: PegMessageQueue = new PegMessageQueue()
    PegThing.SetMessageQueuePtr(pMsgQueue)

    let pScreen: PegScreen = CreatePegScreen()
    PegThing.SetScreenPtr(pScreen)

    let rect: PegRect = PegRect.Set(0, 0, pScreen.GetXRes() -1, pScreen.GetYRes() -1)
    let pPresentation: PegPresentationManager = new PegPresentationManager(rect) 
    PegThing.SetPresentationManagerPtr(pPresentation)
    pScreen.GenerateViewportList(pPresentation)

    let rtScreen: PegRect = PegRect.Set(0,0, MAINFRAME_RIGHT, MAINFRAME_BOTTOM)

    let g_pTestViewMaster: TestViewMaster = new TestViewMaster(rtScreen)
    pPresentation.Add(g_pTestViewMaster)

    let g_pMainWindow: TestViewScreen = new TestViewScreen(g_pTestViewMaster)
    g_pTestViewMaster.Add(g_pMainWindow)

    let newMessage: PegMessage = new PegMessage(PegSystemMessage.PM_DRAW)
    newMessage.pTarget = pPresentation
    pMsgQueue.Push(newMessage)

    pScreen.Invalidate(pPresentation.mReal)
    pPresentation.Invalidate(pPresentation.mReal)

    pPresentation.Execute()
}