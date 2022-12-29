import type { WORD } from "../native/windows";
import { FF_NONE, FF_THIN, PegRect } from "../PEG/pegtypes";
import { PegWindow } from "../PEG/pwindow";
import type { CPMainFrame } from "./cpmainframe";


export class CPWindow extends PegWindow {

    constructor (
        p1?: PegRect | WORD,
        wStyle?: WORD
    ) {
        if (p1 instanceof PegRect) {
            super(p1, wStyle || FF_THIN)
        } else {
            super(p1 || FF_THIN)
        }
        // TODO
    }

    static GetMainFrame(): CPMainFrame {
        return null // TODO
    }

    Draw() {
        console.log("CPWindow::Draw")
    }
}