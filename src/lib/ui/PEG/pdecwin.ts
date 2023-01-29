import type { WORD } from "../native/windows";
import type { PegThing } from "./pthing";
import { FF_NONE, PegRect } from "./pegtypes";
import { PegWindow } from "./pwindow";


export class PegDecoratedWindow extends PegWindow {
    constructor (
        p1?: PegRect | WORD,
        wFlags?: WORD
    ) {
        if (p1 instanceof PegRect) {
            super(p1, wFlags)
        } else {
            super(p1)
        }
        // TODO: reverse this part 
    }

    Add(what: PegThing, bDraw?: boolean): void {
        super.Add(what, bDraw || true)
    }

    /*
    Message(mesg: PegMessage) {
        
    }
    */
}