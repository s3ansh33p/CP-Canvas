import type { BOOL, WORD } from "../native/windows";
import { FF_NONE, PegPoint, PegRect } from "../PEG/pegtypes";
import type { PegMessage } from "../PEG/pmessage";
import { PegThing } from "../PEG/pthing";


export class CPFrameWindow extends PegThing {
    constructor (
        p1?: PegRect | WORD,
        wStyle?: WORD
    ) {
        if (p1 instanceof PegRect) {
            super(p1, 0, wStyle || FF_NONE)
        } else {
            super(0, p1 || FF_NONE)
        }
    }

    Draw() {
        console.log("todo: CPFrameWindow::Draw")
    }

    DrawFrame(bFill: BOOL = true) {
        console.log("todo: CPFrameWindow::DrawFrame")
    }

    MoveFocusToFirstClientChild() {}

    /** OnLButtonDown called when pen is pressed down
     * @param p Reference to point of pen location.
     *      The point is relative to the window location, which means
     *      position (0,0) is the top left corner of the window, not the screen */
    OnLButtonDown(p: PegPoint) {}

    /** OnLButtonUp called when pen is released
     * @param p Reference to point of pen location.
	 *      The point is relative to the window location, which means
	 *      position (0,0) is the top left corner of the window, not the screen */
	OnLButtonUp(p: PegPoint){}

    /** OnLButtonMove called when pen is moved on screen
     * @param p Reference to point of pen location.
     *      The point is relative to the window location, which means
     *      position (0,0) is the top left corner of the window, not the screen */
    OnPointerMove(p: PegPoint){}

    OnChar(mesg: PegMessage) {
        super.Message(mesg)
    }

}