import type { PegRect } from "../PEG/pegtypes";
import type { CPDocument } from "./cpdocument";
import type { CPMainFrame } from "./cpmainframe";
import { CPWindow } from "./cpwindow";


export class PCPModuleWindow {

}

export class CPModuleWindow extends CPWindow {
    constructor(
        rect: PegRect,
        invoking_window: CPModuleWindow,
        doc: CPDocument,
        frame: CPMainFrame
    ) {
        super()
    }

    Draw() {
        console.log("CPModuleWindow::Draw")
    }

}