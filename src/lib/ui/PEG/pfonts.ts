import type { UCHAR, WORD } from "../native/windows";
import { tstrcpy, tstrlen, type TCHAR } from "./pegtypes";


export interface PegFont {
    uType: UCHAR;            // bit-flags defined below
    uAscent: UCHAR;          // Ascent above baseline
    uDescent: UCHAR;         // Descent below baseline
    uHeight: UCHAR;          // total height of character
    wBytesPerLine: WORD;    // total bytes (width) of one scanline
    wFirstChar: WORD;       // first character present in font (page)
    wLastChar: WORD;        // last character present in font (page)
    pOffsets: WORD[];        // bit-offsets for variable-width font
    pNext: PegFont;           // NULL unless multi-page Unicode font
    pData: UCHAR[];           // character bitmap data array
}

export const PFT_VARIABLE = 0x01   // Variable-Width font (standard)
export const PFT_OUTLINE =  0x02   // Outline font
export const PFT_ALIASED =  0x04   // Not supported in current release

export const IS_VARWIDTH = (a: PegFont) => (a.uType & PFT_VARIABLE)
export const IS_OUTLINE = (a: PegFont) =>  (a.uType & PFT_OUTLINE)
export const IS_ALIASED = (a: PegFont) =>  (a.uType & PFT_ALIASED)

// default fonts
// SysFont, MenuFont, TitleFont (defaults to SysFont)
export class PegTextThing{

    protected mpFont: PegFont
    protected mpText: TCHAR[]
    protected mwStrLen: WORD
    protected mwBufferLen: WORD
    protected mbCopy: UCHAR

    static mDefaultFonts: PegFont[]

    // PegTextThing(const TCHAR *Text, WORD wCopy = 0, UCHAR uFontIndex = 0);
    // PegTextThing(WORD wCopy = 0, UCHAR uFontIndex = 0);
    constructor(
        p1: TCHAR[] | WORD,
        p2: WORD | UCHAR = 0,
        uFontIndex: UCHAR = 0
    ) {
        this.mwStrLen = 0

        if (Array.isArray(p1)) {
            const text: TCHAR[] = p1
            this.mpText = text
            this.mbCopy = (p2?1:0)
            
            if(this.mbCopy) {
                if (text) {
                    this.mwStrLen = tstrlen(text) + 1
                    if (this.mwStrLen) {
                        this.mwBufferLen = this.mwStrLen + 16
                        this.mpText = tstrcpy([...Array(this.mwBufferLen)], text)
                    } else {
                        this.mpText = []
                    }
                } else {
                    this.mpText = []
                    this.mwStrLen = 0
                }
            } else {
                if (text) {
                    if (tstrlen(text)) {
                        this.mpText = text
                        this.mwStrLen = tstrlen(text) + 1
                    } else {
                        this.mpText = []
                        this.mwStrLen = 0
                    }
                } else {
                    this.mpText = []
                    this.mwStrLen = 0
                }
            }
        } else {
            this.mwBufferLen = 0
            this.mpText = []
            this.mbCopy = (p1?1:0)
        }

        this.mpFont = PegTextThing.mDefaultFonts[uFontIndex];
    }

    DataSet(text: TCHAR[]) {
        if(this.mbCopy) {
            if (text) {
                this.mwStrLen = tstrlen(text) + 1
                if (this.mwStrLen > this.mwBufferLen) {
                    this.mwBufferLen = this.mwStrLen + 32
                    this.mpText = tstrcpy([...Array(this.mwBufferLen)], text)
                } else {
                    this.mpText = tstrcpy(this.mpText, text)
                }
            } else {
                this.mpText = []
                this.mwStrLen = 0
                this.mwBufferLen = 0
            }
        } else {
            if (text) {
                if (tstrlen(text)) {
                    this.mpText = text
                    this.mwStrLen = tstrlen(text) + 1
                } else {
                    this.mpText = []
                    this.mwStrLen = 0
                }
            } else {
                this.mpText = []
                this.mwStrLen = 0
            }
        }
    }

    // Can be used to turn on copy mode after construction. Copy mode cannot be turned off after it is turned on.
    SetCopyMode() {
        if (this.mbCopy) return
        if (this.mpText) {
            let pTemp: TCHAR[] = this.mpText
            this.mpText = []
            this.mwStrLen = 0
            this.mwBufferLen = 0
            this.mbCopy = 1
            
            this.DataSet(pTemp)
        }
    }
}