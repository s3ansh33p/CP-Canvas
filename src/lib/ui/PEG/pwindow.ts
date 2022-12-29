import type { BOOL, UCHAR, WORD } from "../native/windows";
import { PegThing } from "./pthing";
import { FF_THICK, PCI_NORMAL, PCLR_CLIENT, PegPoint, PegRect, PSF_MOVEABLE, PSF_SIZEABLE, PSF_TAB_STOP, PSF_VIEWPORT, TYPE_WINDOW, type PegBitmap, type SIGNED } from "./pegtypes";
import { PPT_NORMAL } from "./pscreen";

// Move Types. A re-size is treated by Peg as simply a different type of move.
const PMM_MOVEALL =         0x80
const PMM_MOVETOP =         0x01
const PMM_MOVEBOTTOM =      0x02
const PMM_MOVELEFT =        0x04 
const PMM_MOVERIGHT =       0x08
const PMM_MOVEUR =          0x09
const PMM_MOVELR =          0x0a
const PMM_MOVEUL =          0x05
const PMM_MOVELL =          0x06

const PEG_FRAME_WIDTH = 5
const PEG_SCROLL_WIDTH = 16

export interface PegScrollInfo {
    wMin: SIGNED
    wMax: SIGNED
    wCurrent: SIGNED
    wStep: SIGNED
    wVisible: SIGNED
}

export class PegWindow extends PegThing {

    mpIconMap: PegBitmap
    mbModal: BOOL
    mbMaximized: BOOL
    mbMoveFrame: BOOL
    muScrollMode: UCHAR
    muMoveMode: UCHAR
    mbShowPointer: UCHAR
    mStartMove: PegPoint
    mMovePoint: PegPoint
    mRestore: PegRect

    constructor (
        p1: PegRect | WORD,
        wStyle?: WORD
    ) {
        if (p1 instanceof PegRect) {
            super(p1, 0, wStyle || 0)
        } else {
            super(0, p1)

            this.mReal = PegRect.Set(0,0,20,20)
            this.mClient = this.mReal
        }

        this.mpIconMap = null
        this.mbModal = false
        this.mbMaximized = false
        this.mbMoveFrame = false
        this.muScrollMode = 0
        this.muMoveMode = 0
        this.mbShowPointer = PPT_NORMAL

        this.Type(TYPE_WINDOW)
        this.muColors[PCI_NORMAL] = PCLR_CLIENT
        this.AddStatus(PSF_VIEWPORT|PSF_TAB_STOP)

        if (wStyle & FF_THICK) {
            this.AddStatus(PSF_SIZEABLE|PSF_MOVEABLE)
        }
        this.InitClient()
    }
    
    Excecute(): SIGNED {
        return 0
    }
}