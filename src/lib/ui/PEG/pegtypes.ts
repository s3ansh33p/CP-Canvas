import type { int16_t } from "../native/native";
import type { BOOL, DWORD, LONG, UCHAR, WORD } from "../native/windows";

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


// Text Justification Style:

export const TJ_RIGHT: WORD =           0x0020
export const TJ_LEFT: WORD =            0x0040
export const TJ_CENTER: WORD =          0x0080
export const TJ_MASK: WORD =            0x00E0

// Title Style:

export const TF_NONE: WORD      =       0x0000
export const TF_SYSBUTTON: WORD =       0x0200
export const TF_MINMAXBUTTON: WORD =    0x0400
export const TF_CLOSEBUTTON: WORD =     0x0800

// Text Thing Copy Flag

export const TT_COPY: WORD =            0x2000

// List Style

export const LS_WRAP_SELECT: WORD =     0x2000

// Button Style:

export const BF_REPEAT: WORD =          0x0002
export const BF_SELECTED: WORD =        0x0004
export const BF_DOWNACTION: WORD =      0x0008
export const BF_FULLBORDER: WORD =      0x0010

// menu button style

export const BF_SEPARATOR: WORD =       0x0100
export const BF_CHECKABLE: WORD =       0x0200
export const BF_CHECKED: WORD =         0x0400
export const BF_DOTABLE: WORD =         0x0800
export const BF_DOTTED: WORD =          0x1000

// Decorated Button styles. 

export const BF_ORIENT_TR: WORD =       0x0100
export const BF_ORIENT_BR: WORD =       0x0200

// Edit Style:

export const EF_EDIT: WORD =            0x0100
export const EF_PARTIALROW: WORD =      0x0200
export const EF_WRAP: WORD =            0x0400
export const EF_FULL_SELECT: WORD =     0x0800

// Message Window Style:

export const MW_OK: WORD =              0x0020
export const MW_YES: WORD =             0x0040
export const MW_NO: WORD =              0x0080
export const MW_ABORT: WORD =           0x0100
export const MW_RETRY: WORD =           0x0200
export const MW_CANCEL: WORD =          0x0400

// Miscellaneous Appearance Style:

export const AF_TRANSPARENT: WORD =        0x4000
export const AF_ENABLED: WORD =            0x8000


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
    

    Width(): SIGNED {
        return (this.wRight - this.wLeft + 1)
    }
    
    Height(): SIGNED {
        return (this.wBottom - this.wTop + 1)
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
        } else if (typeof p1 === 'number' && typeof p2 === 'number' && typeof x2 === 'number' && typeof y2 === 'number' ) {
            return new PegRect(
                p1,
                p2,
                x2,
                y2
            );
        }
    }

    /// Set all four (x,y) components
    Set(x1: SIGNED, y1: SIGNED, x2: SIGNED, y2: SIGNED) {
        this.wLeft = x1;
        this.wTop = y1;
        this.wRight = x2;
        this.wBottom = y2;
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

export const BLACK: COLORVAL           = 0x000000
export const RED: COLORVAL             = 0xbf0000
export const GREEN: COLORVAL           = 0x00bf00
export const BROWN: COLORVAL           = 0xbfbf00
export const BLUE: COLORVAL            = 0x0000bf
export const MAGENTA: COLORVAL         = 0xbf00bf
export const CYAN: COLORVAL            = 0x00bfbf
export const LIGHTGRAY: COLORVAL       = 0xc0c0c0
export const DARKGRAY: COLORVAL        = 0x808080
export const LIGHTRED: COLORVAL        = 0xff0000
export const LIGHTGREEN: COLORVAL      = 0x00ff00
export const YELLOW: COLORVAL          = 0xffff00
export const LIGHTBLUE: COLORVAL       = 0x0000ff
export const LIGHTMAGENTA: COLORVAL    = 0xff00ff
export const LIGHTCYAN: COLORVAL       = 0x00ffff
export const WHITE: COLORVAL           = 0xffffff

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
export const CF_NONE: UCHAR =    0x00
export const CF_FILL: UCHAR =    0x01
export const CF_DASHED: UCHAR =  0x02
export const CF_XOR: UCHAR =     0x04
export const CF_ALPHA: UCHAR =   0x08

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

// PegBitmap structure and flags definition.
export const BMF_RAW =          0x00
export const BMF_RLE =          0x01
export const BMF_NATIVE =       0x02
export const BMF_ROTATED =      0x04
export const BMF_HAS_TRANS =    0x10     //
export const BMF_SPRITE =       0x20     // bitmap resides in video memory

export interface PegBitmap {
    uFlags: UCHAR           // combination of flags above
    uBitsPix: UCHAR         // 1, 2, 4, or 8
    wWidth: WORD            // in pixels
    wHeight: WORD           // in pixels
    dTransColor: DWORD      // transparent color for > 8bpp bitmaps
    pStart: UCHAR           // bitmap data pointer
}


export const IS_RLE = (a: PegBitmap) => (a.uFlags & BMF_RLE)
export const HAS_TRANS = (a: PegBitmap) => (a.uFlags & BMF_HAS_TRANS)
export const IS_NATIVE = (a: PegBitmap) => (a.uFlags & BMF_NATIVE)
export const IS_ROTATED = (a: PegBitmap) => (a.uFlags & BMF_ROTATED)
export const IS_SPRITE = (a: PegBitmap) => (a.uFlags & BMF_SPRITE)

// Helpers

export const tstrlen = (s?: TCHAR[]) => { return (Array.isArray(s) && s.length) || 0 }
export const tstrcpy = (buff: TCHAR[], base: TCHAR[]) => { return (Array.isArray(base) && [...base, ...buff.slice(tstrlen(base))]) || base }

export const _s = (s: string) => s.split('').map(e => e.charCodeAt(0))


// PEG signal definitions. PegBaseSignals are supported by all objects. The
// remaining signals are only supported by the object type indicated in the
// enumeration name.

export enum PegBaseSignals {
    PSF_SIZED = 0,          // sent when the object is moved or sized
    PSF_FOCUS_RECEIVED,     // sent when the object receives input focus
    PSF_FOCUS_LOST,         // sent when the object loses input focus
    PSF_KEY_RECEIVED,       // sent when an input key that is not supported is received
    PSF_RIGHTCLICK          // sent when a right-click message is received by the object
}

export enum PegTextSignals {
    PSF_TEXT_SELECT    = 8, // sent when the user selects all or a portion of a text object
    PSF_TEXT_EDIT,          // sent each time text object string is modified
    PSF_TEXT_EDITDONE       // sent when a text object modification is complete
}

export enum PegButtonSignals {
    PSF_CLICKED = 8,        // default button select notification
    PSF_CHECK_ON,           // sent by check box and  menu button when checked
    PSF_CHECK_OFF,          // sent by check box and menu button when unchecked
    PSF_DOT_ON,             // sent by radio button and menu button when selected
    PSF_DOT_OFF,            // sent by radio button and menu button when unselected
    PSF_LIST_SELECT         // sent by PegList derived objects, including PegComboBox
}

export enum PegScrollSignals {
    PSF_SCROLL_CHANGE = 8,  // sent by non-client PegScroll derived objects
    PSF_SLIDER_CHANGE       // sent by PegSlider derived objects
}

export class PegCapture {

    private mRect: PegRect
    private mBitmap: PegBitmap
    private mlDataSize: LONG
    private mbValid: BOOL


    constructor() {
        this.mRect.Set(0, 0, 0, 0);
        this.mBitmap.pStart = 0;
        this.mbValid = false;
        this.mlDataSize = 0;
    }


    Pos(): PegRect { return this.mRect}
    
    Point(): PegPoint {
        return new PegPoint(this.mRect.wLeft, this.mRect.wTop)
    }


    DataSize(): LONG {
        return this.mlDataSize
    }


    SetPos(rect: PegRect): void {
        this.mRect = rect;
        this.mBitmap.wWidth = rect.Width();
        this.mBitmap.wHeight = rect.Height();
    }

    IsValid(): BOOL {
        return this.mbValid
    }

    SetValid(bValid: BOOL): void { this.mbValid = bValid }
    Realloc(lSize: LONG): void {}
    Reset(): void {}

    MoveTo(iLeft: SIGNED, iTop: SIGNED): void {}

    Shift(xShift: SIGNED, yShift: SIGNED): void {
        this.mRect.Shift(xShift, yShift)
    }
    
    Bitmap(): PegBitmap {
        return this.mBitmap
    }

}