import type { WORD } from "../native/windows";
import type { PegThing } from "./pthing";
import type { PegRect } from "./pegtypes";
import { PegWindow } from "./pwindow";


export class PegDecoratedWindow extends PegWindow {
    constructor (
        rect: PegRect,
        wFlags: WORD
    ) {
        super(rect)
        // TODO: reverse this part 
    }

    /*
    Message(mesg: PegMessage) {
        
    }
    */
}