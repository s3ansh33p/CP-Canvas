import type { WORD } from "../native/windows";
import { AF_ENABLED, BLACK, CF_FILL, CF_NONE, EF_EDIT, FF_RECESSED, PCI_NORMAL, PCI_NTEXT, PCI_SELECTED, PCI_STEXT, PCLR_CURSOR, PegColor, PegPoint, PegRect, PegTextSignals, tstrcpy, tstrlen, TT_COPY, TYPE_STRING, type SIGNED, type TCHAR } from "./pegtypes";
import { PegTextThing, type PegFont } from "./pfonts";
import { PegSystemMessage, type PegMessage } from "./pmessage";
import { PegThing } from "./pthing";



export interface PegString_State {
    mbEditMode:SIGNED,
    mbMarked:SIGNED,
    mbFullSelect:SIGNED,
    mbMarkMode:SIGNED,
    mbChanged:SIGNED,
};

export class PegString extends PegThing {
    private _pText: PegTextThing

    miCursor: SIGNED
    miMarkAnchor: SIGNED
    miMarkStart: SIGNED
    miMarkEnd: SIGNED
    miFirstVisibleChar: SIGNED
    miMaxLen: SIGNED

    mCursorPos: PegPoint

    // Keyboard support
    mpBackup: TCHAR[]

    // Union
    state: PegString_State = {
        mbEditMode: 1,
        mbMarked: 1,
        mbFullSelect: 1,
        mbMarkMode: 1,
        mbChanged: 1,
    }
    mwFullState: SIGNED

    // TODO: PegString(SIGNED iLeft, SIGNED iTop, const TCHAR *Text = NULL, WORD wId = 0, WORD wStyle = FF_RECESSED|AF_ENABLED|EF_EDIT, SIGNED iLen = -1);
    // TODO: PegString(SIGNED iLeft, SIGNED iTop, SIGNED iWidth, const TCHAR *Text = NULL, WORD wId = 0, WORD wStyle = FF_RECESSED|AF_ENABLED|EF_EDIT, SIGNED iLen = -1);

    constructor (
        rect: PegRect,
        text: TCHAR[] = null,
        wId: WORD = 0,
        wStyle: WORD = FF_RECESSED|AF_ENABLED|EF_EDIT,
        iLen: SIGNED = -1
    ) {
        super(rect, wId, wStyle)

        // TODO : change this ??
        let PEG_STRING_FONT = 1 // "SysFont"

        this._pText = new PegTextThing(text, wStyle & (TT_COPY|EF_EDIT), PEG_STRING_FONT)

        Object.assign(this, this._pText) // "Multiple" extends

        this.Type(TYPE_STRING)

    }

    Message(mesg: PegMessage): SIGNED {
        switch (mesg.wType) {
            case PegSystemMessage.PM_HIDE:
                super.Message(mesg)
                this.mwFullState = 0
                break
            
            case PegSystemMessage.PM_NONCURRENT:
                super.Message(mesg)
                if (this.state.mbChanged) {
                    this.CheckSendSignal(PegTextSignals.PSF_TEXT_EDITDONE)
                }
                this.mwFullState = 0

                this.Invalidate(this.mReal)
                this.Draw()

                // ifdef PEG_KEYBOARD_SUPPORT
                if (this.mpBackup) {
                    delete this.mpBackup
                    this.mpBackup = null
                }
                break
            
            case PegSystemMessage.PM_CURRENT:
                super.Message(mesg)
                if (this._pText.DataGet()) {
                    this.miMarkStart = 0
                    this.miMarkEnd = tstrlen(this._pText.DataGet())

                    if (this.mpBackup) {
                        delete this.mpBackup
                    }

                    this.mpBackup = Array(this.miMarkEnd+1);
                    tstrcpy(this.mpBackup, this._pText.DataGet())

                    this.state.mbMarked = 1
                    this.state.mbFullSelect = 1
                    this.miCursor = 0
                    this.state.mbEditMode = 0
                    this.state.mbChanged = 0    
                } else {
                    this.miCursor = 0
                    this.state.mbMarked = 0
                    this.state.mbFullSelect = 0
                    this.state.mbEditMode = 1
                    this.state.mbChanged = 0
                    this.mCursorPos.x = this.mClient.wLeft + 1
                    this.mCursorPos.y = this.mClient.wTop
                }

                this.Invalidate(this.mClient)
                this.Draw()
                break

            // TODO
            // case PegSystemMessage.PM_LBUTTONDOWN:
            //     super.Message(mesg)


            default:
                super.Message(mesg)
                break

        }

        return 0
        
    }

    Draw(): void  {
        console.debug("PegString::Draw")
        if (!this.Parent()) return

        let color: PegColor = new PegColor(this.muColors[PCI_NTEXT], this.muColors[PCI_NORMAL], CF_NONE)

        this.BeginDraw()

        this.StandardBorder(color.uBackground)

        let point: PegPoint = new PegPoint(this.mClient.wTop, this.mClient.wLeft + 1)
        
        // Draw the Text
        let oldClip: PegRect = this.mClip
        this.mClip = this.mClip.and(this.mClient); // &= 

        if (this._pText.mpText) {
            if (this.state.mbMarked) {
                this.DrawMarked()
            } else{
                this.DrawText(point, this._pText.mpText.slice(this.miFirstVisibleChar), color, this._pText.mpFont)
            }
        }

        if (this.state.mbEditMode) {
            if (this.Screen().NumColors() < 4) {
                color.uForeground = BLACK;
            } else {
                color.uForeground = PCLR_CURSOR;
            }
            this.Line(this.mCursorPos.x, this.mClient.wTop, this.mCursorPos.x, this.mClient.wBottom, color)
        }

        this.mClip = oldClip

        if (this.First()) {
            this.DrawChildren()
        }
        this.EndDraw()
    }

    DrawMarked(): void {
        // TODO
        this.Invalidate()
        this.BeginDraw()
        let color: PegColor = new PegColor(this.muColors[PCI_NTEXT], this.muColors[PCI_NORMAL], CF_FILL)

        let point: PegPoint = new PegPoint(this.mClient.wTop, this.mClient.wLeft + 1)

        // Draw the Text
        let oldClip: PegRect = this.mClip
        this.mClip = this.mClip.and(this.mClient); // &= 

        let wLength: WORD = tstrlen(this._pText.mpText)
        let pTemp: TCHAR[] = Array(wLength + 1)

        // draw the unmarked characters, if any:

        if (this.miMarkStart > this.miFirstVisibleChar) {
            tstrcpy(pTemp, this._pText.mpText)
            pTemp[this.miMarkStart] = '\0'.charCodeAt(0);  // Sorry but JS is JS
            this.DrawText(point, pTemp.slice(this.miFirstVisibleChar), color, this._pText.mpFont)
        }

        // draw the visble marked characters:

        if (this.miMarkEnd > this.miFirstVisibleChar) {

            color.uForeground = this.muColors[PCI_STEXT]
            color.uBackground = this.muColors[PCI_SELECTED]

            if (this.miMarkStart >= this.miFirstVisibleChar) {
                tstrcpy(pTemp, this._pText.mpText.slice(this.miMarkStart))
                pTemp[this.miMarkEnd - this.miMarkStart] = 0 // '\0'
            } else {
                tstrcpy(pTemp, this._pText.mpText.slice(this.miFirstVisibleChar))
                pTemp[this.miMarkEnd - this.miFirstVisibleChar] = 0 // '\0'
            }
            this.DrawText(point, pTemp, color, this._pText.mpFont)
            point.x += this.TextWidth(pTemp, this._pText.mpFont)
        }

        // draw any characters after the mark:

        if (this.miMarkEnd < wLength) {
            tstrcpy(pTemp, this._pText.mpText.slice(this.miMarkEnd))
            color.uForeground = this.muColors[PCI_NTEXT]
            color.uBackground = this.muColors[PCI_NORMAL]
            this.DrawText(point, pTemp, color, this._pText.mpFont)
        }

        this.mClip = oldClip
        this.EndDraw()
    }

    DataSet(text: TCHAR): void {}

    SetFont(font: PegFont): void {}
    
    Style(wStyle?: WORD): WORD {
        if (wStyle) {
            throw new Error("Not Implemented");
        } else {
            return super.Style()
        }
    }

    



}