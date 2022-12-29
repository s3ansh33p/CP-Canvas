import type { WORD } from "../native/windows";
import { PegThing } from "./pthing";
import type { PegRect } from "./pegtypes";


export class PegWindow extends PegThing {

    constructor (
        rect: PegRect,
        wStyle: WORD
    ) {
        super(rect, 0, wStyle)
        // InitClient();
    }
    
}