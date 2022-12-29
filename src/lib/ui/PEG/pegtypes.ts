import type { int16_t } from "../native/native";
import type { BOOL, DWORD, UCHAR, WORD } from "../native/windows";

// Bare types
export type SIGNED = int16_t
export type TCHAR = UCHAR

// Thing types - uType of all Peg GUI, query by Type()
export const TYPE_THING: UCHAR =               1
export const TYPE_TITLE: UCHAR =               2
export const TYPE_MENU: UCHAR =                3
export const TYPE_BUTTON: UCHAR =              5
export const TYPE_HSCROLL: UCHAR =             6
export const TYPE_VSCROLL: UCHAR =             7
export const TYPE_ICON: UCHAR =                8
export const TYPE_MENU_BAR: UCHAR =            9
export const TYPE_MENU_BUTTON: UCHAR =         10
export const TYPE_TEXTBUTTON: UCHAR =          11
export const TYPE_BMBUTTON: UCHAR =            12
export const TYPE_SPARE: UCHAR =               13
export const TYPE_RADIOBUTTON: UCHAR =         14
export const TYPE_CHECKBOX: UCHAR =            15
export const TYPE_STATUS_BAR: UCHAR =          16
export const TYPE_PROMPT: UCHAR =              17
export const TYPE_VPROMPT: UCHAR =             18
export const TYPE_SPARE3: UCHAR =              19
export const TYPE_SPARE4: UCHAR =              20
export const TYPE_SPARE5: UCHAR =              21
export const TYPE_STRING: UCHAR =              22
export const TYPE_SLIDER: UCHAR =              23
export const TYPE_SPINBUTTON: UCHAR =          24
export const TYPE_GROUP: UCHAR =               25
export const TYPE_MLTEXTBUTTON: UCHAR =        26
export const TYPE_TOOL_BAR_PANEL: UCHAR =      27
export const TYPE_TOOL_BAR: UCHAR =            28
export const TYPE_DECORATEDBUTTON: UCHAR =     29

export const TYPE_LINE_CHART: UCHAR =          40
export const TYPE_STRIP_CHART: UCHAR =         41
export const TYPE_MULTI_LINE_CHART: UCHAR =    42

export const TYPE_FDIAL: UCHAR =               50
export const TYPE_FBM_DIAL: UCHAR =            51
export const TYPE_CLR_LIGHT: UCHAR =           52
export const TYPE_BM_LIGHT: UCHAR =            53
export const TYPE_LIN_SCALE: UCHAR =           54
export const TYPE_LIN_BM_SCALE: UCHAR =        55

export const TYPE_CDIAL: UCHAR =               56
export const TYPE_CBM_DIAL: UCHAR =            57

export const TYPE_WINDOW: UCHAR =              150
export const TYPE_DIALOG: UCHAR =              151
export const TYPE_TABLE: UCHAR =               152
export const TYPE_SPREADSHEET: UCHAR =         153
export const TYPE_TEXTBOX: UCHAR =             154
export const TYPE_MESSAGE: UCHAR =             155
export const TYPE_DECORATED_WIN: UCHAR =       156
export const TYPE_ANIMATION: UCHAR =           157
export const TYPE_NOTEBOOK: UCHAR =            158
export const TYPE_TREEVIEW: UCHAR =            159
export const TYPE_TERMINAL_WIN: UCHAR =        160
export const TYPE_LIST: UCHAR =                161
export const TYPE_VLIST: UCHAR =               162
export const TYPE_HLIST: UCHAR =               163
export const TYPE_COMBO: UCHAR =               164
export const TYPE_EDITBOX: UCHAR =             165

// Frame Styles
export const FF_NONE: WORD      = 0x0001
export const FF_THIN: WORD      = 0x0002	// thin
export const FF_THICK: WORD     = 0x0010	// thick
export const FF_MASK: WORD      = 0x001f	// mask
export const FF_RAISED: WORD    = FF_THIN	// raised
export const FF_RECESSED: WORD  = FF_THIN	// recessed

// System Status flags common to all object types
export const PSF_VISIBLE: WORD =           0x0001
export const PSF_CURRENT: WORD =           0x0002
export const PSF_SELECTABLE: WORD =        0x0004
export const PSF_SIZEABLE: WORD =          0x0008
export const PSF_MOVEABLE: WORD =          0x0010
export const PSF_NONCLIENT: WORD =         0x0020
export const PSF_ACCEPTS_FOCUS: WORD =     0x0040
export const PSF_KEEPS_CHILD_FOCUS: WORD = 0x0080
export const PSF_CONTINUOUS_SCROLL: WORD = 0x0100
export const PSF_TAB_STOP: WORD =          0x0200
export const PSF_OWNS_POINTER: WORD =      0x0400    
export const PSF_ALWAYS_ON_TOP: WORD =     0x4000
export const PSF_VIEWPORT: WORD =          0x8000

export const PCI_NORMAL: UCHAR =          0
export const PCI_SELECTED: UCHAR =        1
export const PCI_NTEXT: UCHAR =           2
export const PCI_STEXT: UCHAR =           3

// Extended SpreadSheet color indexes:
export const PCI_SS_COLHEADBACK: UCHAR = 4
export const PCI_SS_COLHEADTEXT: UCHAR = 5
export const PCI_SS_ROWHEADBACK: UCHAR = 6
export const PCI_SS_ROWHEADTEXT: UCHAR = 7
export const PCI_SS_DIVIDER: UCHAR     = 8
export const PCI_SS_BACKGROUND: UCHAR  = 9

// ColorVal
export type COLORVAL = UCHAR

// Macro
export const SIGMASK = (a: number) => { return (1 << (a)) }

// Class
export class PegPoint {
    x: SIGNED
    y: SIGNED

    constructor(
        x: SIGNED,
        y: SIGNED
    ) {
        this.x = x;
        this.y = y;
    }

    /// Compare two PegPoint objects
    differs(point: PegPoint): boolean {
        return (this.x != point.x || this.y != point.y)
    }

    /// Compare two PegPoint objects
    equals(point: PegPoint): boolean {
        return (this.x == point.x && this.y == point.y)
    }

    // Add two PegPoint objects
    add(point: PegPoint) {
        return new PegPoint(this.x + point.x, this.y + point.y);
    }
}

/**
 * Structure representing a rectangle on screen
 */
export class PegRect {
    wLeft: SIGNED;
    wTop: SIGNED;
    wRight: SIGNED;
    wBottom: SIGNED;

    /**
    new PegRect(
        wLeft,
        wTop,
        wRight,
        wBottom
    )
    */
    constructor(
        x1: SIGNED, y1: SIGNED, x2: SIGNED, y2: SIGNED
    ) {
        this.wLeft = x1;
        this.wTop = y1;
        this.wRight = x2;
        this.wBottom = y2;
    }
    
    
    /// Set using two PegPoint objects
    static Set(ul: PegPoint , br: PegPoint );
    /// Set all four (x,y) components
    static Set(x1: SIGNED, y1: SIGNED, x2: SIGNED, y2: SIGNED);
    
    /// Real set method, no not use directly 
    static Set(p1: SIGNED | PegPoint, p2: SIGNED | PegPoint, x2?: SIGNED, y2?: SIGNED): PegRect {
        if (p1 instanceof PegPoint && p2 instanceof PegPoint) {
            return new PegRect(
                p1.x,
                p1.y,
                p2.x,
                p2.y
            );
        } else if (typeof p1 === 'number' && typeof p2 === 'number' && x2 && y2 ) {
            return new PegRect(
                p1,
                p2,
                x2,
                y2
            );
        }
    }

    // operator &
    and(rect: PegRect): PegRect {
        let r: PegRect = this

        if (r.wRight > rect.wRight) {
            r.wRight = rect.wRight
        }
        
        if (r.wTop < rect.wTop) {
            r.wTop = rect.wTop
        }
        
        if (r.wBottom > rect.wBottom) {
            r.wBottom = rect.wBottom
        }
        
        if (r.wLeft > rect.wLeft) {
            r.wLeft = rect.wLeft
        }

        return r
    }

    // operator |
    or(rect: PegRect): PegRect {
        let r: PegRect = this

        if (r.wLeft > rect.wLeft) {
            r.wLeft = rect.wLeft
        }
        
        if (r.wRight < rect.wRight) {
            r.wRight = rect.wRight
        }
        
        if (r.wTop > rect.wTop) {
            r.wTop = rect.wTop
        }
        
        if (r.wBottom > rect.wBottom) {
            r.wBottom = rect.wBottom
        }

        return r
    }

    // operator +
    AddPoint(point: PegPoint): PegRect {
        return PegRect.Set(
            this.wLeft + point.x,
            this.wRight + point.x,
            this.wTop + point.y,
            this.wBottom + point.y
        )
    }
    
    // operator ==
    equals(rect: PegRect) : BOOL {
        return (rect.wTop == this.wTop &&
            rect.wBottom == this.wBottom && 
            rect.wLeft == this.wLeft &&
            rect.wRight == this.wRight)
    }

    // operator !=
    differs(rect: PegRect) : BOOL {
        return (rect.wTop != this.wTop ||
            rect.wBottom != this.wBottom || 
            rect.wLeft != this.wLeft ||
            rect.wRight != this.wRight)
    }

    // operator +=
    increment(val: number): PegRect {
        this.wLeft -= val
        this.wRight += val
        this.wTop -= val
        this.wBottom += val
        return this
    }

    // operator -=
    decrement(val: number): PegRect {
        this.wLeft += val
        this.wRight -= val
        this.wTop += val
        this.wBottom -= val
        
        if (this.wLeft > this.wRight) {
            this.wRight = this.wLeft
        }

        if(this.wBottom < this.wTop) {
            this.wBottom = this.wTop
        }

        return this
    }
    
    Overlap(that: PegRect): BOOL {
        return (that.wLeft <= this.wRight &&
            that.wTop <= this.wBottom && 
            that.wBottom >= this.wTop &&
            that.wRight >= this.wLeft)
    }

    MoveTo(x: SIGNED, y: SIGNED) {
        let xShift: SIGNED = x - this.wLeft
        let yShift: SIGNED = y - this.wTop
        this.Shift(xShift, yShift)
    }

    Shift(x: SIGNED, y: SIGNED) {
        this.wLeft += x
        this.wRight += x
        this.wTop += y
        this.wBottom += y
    }

    Contains(rect: PegRect): BOOL
    Contains(point: PegPoint): BOOL
    Contains(x: SIGNED, y: SIGNED): BOOL
    Contains(p1: PegRect | PegPoint | SIGNED, y?: SIGNED): BOOL {
        if (p1 instanceof PegRect) {
            return (p1.wLeft >= this.wRight &&
                p1.wRight <= this.wRight && 
                p1.wTop >= this.wTop &&
                p1.wBottom <= this.wBottom)
        } else if (p1 instanceof PegPoint) {
            return (p1.x >= this.wLeft &&
                p1.x <= this.wRight && 
                p1.y >= this.wTop &&
                p1.y <= this.wBottom)
        } else if (typeof p1 == "number" && y) {
            return (p1 >= this.wLeft &&
                p1 <= this.wRight && 
                y >= this.wTop &&
                y <= this.wBottom)

        }
    }
    
}

const BLACK: COLORVAL           = 0x000000
const RED: COLORVAL             = 0xbf0000
const GREEN: COLORVAL           = 0x00bf00
const BROWN: COLORVAL           = 0xbfbf00
const BLUE: COLORVAL            = 0x0000bf
const MAGENTA: COLORVAL         = 0xbf00bf
const CYAN: COLORVAL            = 0x00bfbf
const LIGHTGRAY: COLORVAL       = 0xc0c0c0
const DARKGRAY: COLORVAL        = 0x808080
const LIGHTRED: COLORVAL        = 0xff0000
const LIGHTGREEN: COLORVAL      = 0x00ff00
const YELLOW: COLORVAL          = 0xffff00
const LIGHTBLUE: COLORVAL       = 0x0000ff
const LIGHTMAGENTA: COLORVAL    = 0xff00ff
const LIGHTCYAN: COLORVAL       = 0x00ffff
const WHITE: COLORVAL           = 0xffffff

export const PCLR_HIGHLIGHT: COLORVAL =         WHITE
export const PCLR_LOWLIGHT: COLORVAL =          DARKGRAY
export const PCLR_SHADOW: COLORVAL =            BLACK
export const PCLR_ACTIVE_TITLE: COLORVAL =      BLUE
export const PCLR_INACTIVE_TITLE: COLORVAL =    DARKGRAY
export const PCLR_NORMAL_TEXT: COLORVAL =       BLACK
export const PCLR_HIGH_TEXT: COLORVAL =         WHITE
export const PCLR_NORM_TEXT_BACK: COLORVAL =    WHITE
export const PCLR_HIGH_TEXT_BACK: COLORVAL =    BLUE
export const PCLR_CLIENT: COLORVAL =            WHITE
export const PCLR_DIALOG: COLORVAL =            LIGHTGRAY
export const PCLR_BORDER: COLORVAL =            LIGHTGRAY
export const PCLR_BUTTON_FACE: COLORVAL =       LIGHTGRAY
export const PCLR_CURSOR: COLORVAL =            LIGHTBLUE
export const PCLR_DESKTOP: COLORVAL =           BLACK
export const PCLR_FOCUS_INDICATOR: COLORVAL =   DARKGRAY

// Color Flags
const CF_NONE: UCHAR =    0x00;
const CF_FILL: UCHAR =    0x01;
const CF_DASHED: UCHAR =  0x02;
const CF_XOR: UCHAR =     0x04;
const CF_ALPHA: UCHAR =   0x08;

export class PegColor {
    uForeground: COLORVAL
    uBackground: COLORVAL
    uFlags: UCHAR

    constructor(
        fore: COLORVAL,
        back: COLORVAL = PCLR_DIALOG,
        flags: UCHAR = CF_NONE
    ) {
        this.uForeground = fore
        this.uBackground = back
        this.uFlags = flags
    }
}


export interface PegBitmap {
    uFlags: UCHAR           // combination of flags above
    uBitsPix: UCHAR         // 1, 2, 4, or 8
    wWidth: WORD            // in pixels
    wHeight: WORD           // in pixels
    dTransColor: DWORD      // transparent color for > 8bpp bitmaps
    pStart: UCHAR           // bitmap data pointer
}

// Helpers

export const tstrlen = (s?: TCHAR[]) => { return (Array.isArray(s) && s.length) || 0 }
export const tstrcpy = (buff: TCHAR[], base: TCHAR[]) => { return (Array.isArray(base) && [...base, ...buff.slice(tstrlen(base))]) || base }
