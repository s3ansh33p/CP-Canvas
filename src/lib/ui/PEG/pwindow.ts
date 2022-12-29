import type { BOOL, DWORD, UCHAR, WORD } from "../native/windows";
import { PegThing } from "./pthing";
import { CF_FILL, FF_MASK, FF_NONE, FF_RAISED, FF_RECESSED, FF_THICK, FF_THIN, PCI_NORMAL, PCLR_BORDER, PCLR_CLIENT, PCLR_DIALOG, PCLR_HIGHLIGHT, PCLR_LOWLIGHT, PCLR_SHADOW, PegColor, PegPoint, PegRect, PSF_MOVEABLE, PSF_SIZEABLE, PSF_TAB_STOP, PSF_VIEWPORT, TYPE_WINDOW, type PegBitmap, type SIGNED } from "./pegtypes";
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

    DrawFrame(bFill: BOOL = true) {
        let color: PegColor = new PegColor(PCLR_BORDER, this.muColors[PCI_NORMAL], CF_FILL)

        let dColors: DWORD = this.Screen().NumColors()

        if (dColors < 4) {
            color.uForeground = PCLR_SHADOW
        }

        if (bFill) {
            switch(this.mwStyle & FF_MASK) {
                case FF_THICK:
                    this.Rectangle(this.mReal, color, PEG_FRAME_WIDTH)
                    break
                case FF_RAISED:
                case FF_RECESSED:
                    if (dColors >= 4) {
                        this.Rectangle(this.mReal, color, 0)
                        break
                    }
                case FF_THIN:
                    color.uForeground = PCLR_SHADOW
                    this.Rectangle(this.mReal, color, 1)
                    break
                
                case FF_NONE:
                default:
                    this.Rectangle(this.mReal, color, 0)
            }
        }

        if (
            (dColors >= 4 && (this.mwStyle&(FF_THICK|FF_RAISED))) ||
            (dColors < 4 && (this.mwStyle && FF_THICK))
        ) {
            color.uForeground = PCLR_HIGHLIGHT

            // add highlights
            this.Line(this.mReal.wLeft + 1, this.mReal.wTop + 1, this.mReal.wLeft +1, this.mReal.wBottom, color)
            this.Line(this.mReal.wLeft + 2, this.mReal.wTop + 1, this.mReal.wRight -1, this.mReal.wTop +1, color)

            color.uForeground = PCLR_LOWLIGHT

            // add edge
            this.Line(this.mReal.wRight - 1, this.mReal.wTop + 1, this.mReal.wRight - 1, this.mReal.wBottom - 1, color)
            this.Line(this.mReal.wLeft + 1, this.mReal.wBottom - 1, this.mReal.wRight - 1, this.mReal.wBottom - 1, color);

            // add shadow
            color.uForeground = PCLR_SHADOW

            this.Line(this.mReal.wRight, this.mReal.wTop, this.mReal.wRight, this.mReal.wBottom, color);
            this.Line(this.mReal.wLeft, this.mReal.wBottom, this.mReal.wRight, this.mReal.wBottom, color);
        }

        if (this.Screen().NumColors() >= 4) {
            if (this.mwStyle & FF_RECESSED) {
                color.uForeground = PCLR_HIGHLIGHT

                // add highlights
                this.Line(this.mReal.wLeft, this.mReal.wBottom, this.mReal.wRight, this.mReal.wBottom, color)
                this.Line(this.mReal.wRight, this.mReal.wTop, this.mReal.wRight, this.mReal.wBottom, color)

                color.uForeground = PCLR_LOWLIGHT

                // add edge
                this.Line(this.mReal.wLeft, this.mReal.wTop, this.mReal.wRight, this.mReal.wTop, color)
                this.Line(this.mReal.wLeft, this.mReal.wTop + 1, this.mReal.wLeft, this.mReal.wBottom, color)

                color.uForeground = PCLR_SHADOW

                // add edge
                this.Line(this.mReal.wLeft + 1, this.mReal.wTop + 1, this.mReal.wRight - 2, this.mReal.wTop + 1, color);
                this.Line(this.mReal.wLeft + 1, this.mReal.wTop + 1, this.mReal.wLeft + 1, this.mReal.wBottom - 1, color);

                // add shadows
                color.uForeground = PCLR_DIALOG

                this.Line(this.mReal.wLeft + 1, this.mReal.wBottom - 1, this.mReal.wRight - 1, this.mReal.wBottom - 1, color)
                this.Line(this.mReal.wRight - 1, this.mReal.wTop + 1, this.mReal.wRight - 1, this.mReal.wBottom - 1, color)
            }
        }

        if (this.mwStyle & FF_THICK) {
            color.uForeground = PCLR_HIGHLIGHT

            this.Line(this.mReal.wRight - PEG_FRAME_WIDTH + 2,
                this.mReal.wTop + PEG_FRAME_WIDTH - 1,
                this.mReal.wRight - PEG_FRAME_WIDTH + 2,
                this.mReal.wBottom - PEG_FRAME_WIDTH + 2, color);
           
            this.Line(this.mReal.wLeft + PEG_FRAME_WIDTH - 1,
                this.mReal.wBottom - PEG_FRAME_WIDTH + 2,
                this.mReal.wRight - PEG_FRAME_WIDTH + 2,
                this.mReal.wBottom - PEG_FRAME_WIDTH + 2, color);
   
            color.uForeground = PCLR_LOWLIGHT;

            this.Line(this.mReal.wLeft + PEG_FRAME_WIDTH - 1, this.mClient.wTop - 1, this.mReal.wRight - PEG_FRAME_WIDTH, this.mClient.wTop - 1, color);
   
            this.Line(this.mClient.wLeft - 1, this.mClient.wTop, this.mClient.wLeft - 1, this.mReal.wBottom - PEG_FRAME_WIDTH + 1, color);
        }
    }
}