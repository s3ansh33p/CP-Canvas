import type { BOOL, UCHAR } from "../native/windows";
import { FF_NONE, type PegBitmap, type PegRect, type TCHAR } from "./pegtypes";
import type { PegThing } from "./pthing";
import { PegWindow } from "./pwindow";


export class PegPresentationManager extends PegWindow {

    protected mpInputThing: PegThing
    protected mpDefaultInputThing: PegThing
    protected mpLastPointerOver: PegThing
    protected mpPointerOwners: Array<PegThing> //[MAX_POINTER_CAPTURE_NESTING]
    protected mpWallpaper: PegBitmap
    protected mpScratchPad: TCHAR
    protected muPointerCaptures: UCHAR
    protected mbMoveFocusFlag: BOOL

    constructor(
        total: PegRect
    ) {
        super(total, FF_NONE)
        this.mpInputThing = null
        this.mpLastPointerOver = null
        this.mpScratchPad = null
        this.RemoveStatus(0xffff)
    }

    Draw() {
        console.log("PegPresentationManager::Draw")
    }
}