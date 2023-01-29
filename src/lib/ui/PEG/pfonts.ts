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

export enum PEG_DEFAULT_FONT_INDEX {
    PEG_DEFAULT_FONT = 0,           // default = SysFont
    PEG_TITLE_FONT,                 // default = SysFont
    PEG_MENU_FONT,                  // default = MenuFont
    PEG_TBUTTON_FONT,               // default = MenuFont
    PEG_RBUTTON_FONT,               // default = MenuFont
    PEG_CHECKBOX_FONT,              // default = MenuFont
    PEG_PROMPT_FONT,                // default = SysFont
    PEG_STRING_FONT,                // default = SysFont
    PEG_TEXTBOX_FONT,               //
    PEG_GROUP_FONT,
    PEG_ICON_FONT,
    PEG_CELL_FONT,
    PEG_HEADER_FONT,
    PEG_TAB_FONT,
    PEG_MESGWIN_FONT,
    PEG_TREEVIEW_FONT,
    PEG_NUMBER_OF_DEFAULT_FONTS
}


export class PegTextThing{

    mpFont: PegFont
    mpText: TCHAR[]
    mwStrLen: WORD
    mwBufferLen: WORD
    mbCopy: UCHAR

    static mDefaultFonts: PegFont[] = Array(PEG_DEFAULT_FONT_INDEX.PEG_NUMBER_OF_DEFAULT_FONTS)

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

    DataGet(): TCHAR[] {
        return this.mpText;
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

    static SetDefaultFont(uIndex: UCHAR, pFont: PegFont): void
    {
        PegTextThing.mDefaultFonts[uIndex] = pFont;
    }

    static GetDefaultFont(uIndex: UCHAR): PegFont {
        return PegTextThing.mDefaultFonts[uIndex];
    }
}