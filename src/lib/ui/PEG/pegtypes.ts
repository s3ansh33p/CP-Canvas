import type { int16_t } from "../native/native";
import type { DWORD, UCHAR, WORD } from "../native/windows";

// Bare types
export type SIGNED = int16_t
export type TCHAR = UCHAR

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
    
    // abstract Contains(test: PegPoint): boolean;
    
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

// Color Flags
const CF_NONE: UCHAR =    0x00;
const CF_FILL: UCHAR =    0x01;
const CF_DASHED: UCHAR =  0x02;
const CF_XOR: UCHAR =     0x04;
const CF_ALPHA: UCHAR =   0x08;

const PCLR_DIALOG = LIGHTGRAY // WHITE

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
