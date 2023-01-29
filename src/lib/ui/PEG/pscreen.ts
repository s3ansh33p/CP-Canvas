import { charmap } from "../../../common/font";
import type { BOOL, DWORD, UCHAR, WORD } from "../native/windows";
import { PegRect, PSF_VIEWPORT, PSF_VISIBLE, type COLORVAL, type PegBitmap, type PegColor, type PegPoint, type SIGNED, type TCHAR } from "./pegtypes";
import type { PegFont } from "./pfonts";
import { PegThing } from "./pthing";

const VIEWPORT_LIST_INCREMENT = 32 // This is how many viewports to add when we run out. There is a global pool of viewports, allocated to each PSF_VIEWPORT OBJECT as needed.

// Pointer Types:
export const PPT_NORMAL =       0
export const PPT_VSIZE =        1
export const PPT_HSIZE =        2
export const PPT_NWSE_SIZE =    3
export const PPT_NESW_SIZE =    4
export const PPT_IBEAM =        5
export const PPT_HAND =         6

export const NUM_POINTER_TYPES = 7

export interface VID_MEM_BLOCK {
    lMagic: DWORD
    pNext: VID_MEM_BLOCK
    pPrev: VID_MEM_BLOCK
    pNextFree: VID_MEM_BLOCK
    lSize: DWORD
}

export interface PegPointer {
    Bitmap: PegBitmap;
    xOffset: SIGNED;
    yOffset: SIGNED;
};

export interface Viewport {
    mView: PegRect
    pNext: Viewport
};

export abstract class PegScreen {

    protected mInvalid: PegRect
    protected mVirtualRect: PegRect
    protected mwHRes: SIGNED
    protected mwVRes: SIGNED
    protected mdNumColors: DWORD
    protected mwTotalViewports: WORD
    protected mwDrawNesting: WORD
    protected miInvalidCount: SIGNED     // has any area of screen been invalidated?
    protected mbVirtualDraw: BOOL     // drawing to off-screen bitmap?
    protected mpPointers: PegPointer[] // NUM_POINTER_TYPES
    protected mpCurPointer: PegBitmap
    protected mpScanPointers: COLORVAL[][]
    protected mpSaveScanPointers: COLORVAL[][]
    protected miCurXOffset: SIGNED
    protected miCurYOffset: SIGNED

    private mpFreeVidMem: VID_MEM_BLOCK[];
    private mpCoord: SIGNED;

    mpFreeListStart: Viewport
    mpFreeListEnd: Viewport

    constructor() {}

    BeginDraw(caller: PegThing, bitmap?: PegBitmap) {}

    EndDraw(bitmap?: PegBitmap) {}

    LineView(wXStart: SIGNED, wYStart: SIGNED, wXEnd: SIGNED, wYEnd: SIGNED, Rect: PegRect, color: PegColor, wWidth: SIGNED) {}
    HorizontalLine(wXStart: SIGNED, wXEnd: SIGNED, wYPos: SIGNED, color: PegColor, wWidth: SIGNED) {}
    VerticalLine(wYStart: SIGNED, wYEnd: SIGNED, wYPos: SIGNED, color: PegColor, wWidth: SIGNED) {}
    HorizontalLineXOR(wXStart: SIGNED, wXEnd: SIGNED, wYPos: SIGNED) {}
    VerticalLineXOR(wYStart: SIGNED, wYEnd: SIGNED, wYPos: SIGNED) {}

    // Capture(info: PegCatpure, captureRect: PegRect) {}
    BitmapView(where: PegPoint, bitmap: PegBitmap, view: PegRect) {}
    DrawFastBitmap(where: PegPoint, bitmap: PegBitmap, view: PegRect) {}
    DrawUnalignedBitmap(where: PegPoint, bitmap: PegBitmap, view: PegRect) {}
    DrawRleBitmap(where: PegPoint, bitmap: PegBitmap, view: PegRect) {}

    RectMoveView(caller: PegThing, view: PegRect, xMove: SIGNED, yMove: SIGNED) {}
    DrawTextView(where: PegPoint, text: TCHAR[], color: PegColor, font: PegFont, iCount: SIGNED, rect: PegRect) {}

    HidePointer() {}
    SetPointer(where: PegPoint) {}
    SetPointerType(bType: UCHAR) {}
    ResetPalette() {}
    GetPalette(pPutSize: DWORD): UCHAR[] {
        return [] // TODO
    }

    SetPalette(iFirst: SIGNED, iNum: SIGNED, pGet: UCHAR[]) {}
    ConfigureController() {}
    MemoryToScreen() {}

    abstract GetPixel(caller: PegThing, x: SIGNED, y: SIGNED) : COLORVAL;
    
    abstract PlotPointView(x: SIGNED, y: SIGNED, color: COLORVAL);

    PutPixel(caller: PegThing, x: SIGNED, y: SIGNED, color: COLORVAL) {
        if(!caller.StatusIs(PSF_VISIBLE)) return
        if (!caller.mClip.Contains(x, y)) return

        // #ifdef PEG_FULL_CLIPPING
        if (this.mbVirtualDraw) {
            this.PlotPointView(x, y, color);
            return
        }
        
        // #else
        this.PlotPointView(x, y, color);

    }
    
    NumColors(): DWORD {
        return this.mdNumColors
    }

    abstract CreateBitmap(wWidth: SIGNED, wHeight: SIGNED): PegBitmap;
    abstract DestroyBitmap(pMap: PegBitmap);

    abstract Line(caller: PegThing, wXStart: SIGNED, wYStart: SIGNED, wXEnd: SIGNED, wYEnd: SIGNED, color: PegColor, wWidth: SIGNED);
    abstract Rectangle(caller: PegThing, rect: PegRect, color: PegColor, wWidth: SIGNED);
    abstract Bitmap(caller: PegThing, where: PegPoint, bitmap: PegBitmap, bOnTop: BOOL);
    abstract BitmapFill(caller: PegThing, rect: PegRect, bitmap: PegBitmap);
    
    abstract RectMove(caller: PegThing, rect: PegRect, point: PegPoint);
    abstract ViewportMove(caller: PegThing, rect: PegRect, point: PegPoint);

    abstract DrawText(caller: PegThing, where: PegPoint, text: TCHAR[], color: PegColor, font: PegFont, count: SIGNED);

    abstract TextHeight(text: TCHAR[], font: PegFont): SIGNED;
    abstract TextWidth(text: TCHAR[], font: PegFont): SIGNED;
    abstract TextWidth(text: TCHAR[], font: PegFont, iLen: SIGNED): SIGNED;

    Invalidate(rect?: PegRect) {
        if (this.miInvalidCount) {
            this.mInvalid = this.mInvalid.or(rect)
        } else {
            this.mInvalid = rect
        }
        this.miInvalidCount++

    }

    abstract Circle(xCenter: SIGNED, yCenter: SIGNED, radius: SIGNED, color: PegColor, iWidth: SIGNED);

    InvalidOverlap(rect: PegRect): BOOL {
        if (this.miInvalidCount) {
            if (rect.Overlap(this.mInvalid)) {
                return true
            }
        }
        return false
    }

    ClipRectNoInvalid(rect: PegRect, mClip: PegRect): BOOL {
            if (this.mbVirtualDraw)
            {
                Object.assign(rect, rect.and(this.mVirtualRect)) // &=

                if (rect.wLeft > rect.wRight || rect.wBottom < rect.wTop) {
                    return false;
                }
                return true;
            }

            Object.assign(rect, rect.and(mClip)) // &=

            if (rect.wLeft > rect.wRight || rect.wBottom < rect.wTop) {
                return false;
            }
            return true;
        }

    abstract RectangleXOR(caller: PegThing, inRect: PegRect): void;
    InvertRect(caller: PegThing,  inRect: PegRect): void {
        let rect: PegRect = inRect
        if (!caller) return
        if (!caller.StatusIs(PSF_VISIBLE)) return
        if (!this.ClipRectNoInvalid(rect, caller.mClip)) return

        for (let i = rect.wTop; i <= rect.wBottom; ++i) {
            this.HorizontalLineXOR(rect.wLeft, rect.wRight, i)
        }
        
    }

    abstract GetPointerType(): UCHAR;
    GetXPointerOffset(): SIGNED { return this.miCurXOffset}
    GetYPointerOffset(): SIGNED { return this.miCurYOffset}
    GetPointer(): PegBitmap { return this.mpCurPointer}
    GetXRes(): SIGNED { return this.mwHRes}
    GetYRes(): SIGNED { return this.mwVRes}

    FreeViewports(caller: PegThing) {
        let pStart: Viewport = caller.mpViewportList

        if (pStart) {
            if (!this.mpFreeListStart) {
                this.mpFreeListStart = pStart
            } else {
                this.mpFreeListEnd.pNext = pStart
            }
            this.mpFreeListEnd = pStart

            while(this.mpFreeListEnd.pNext) {
                this.mpFreeListEnd = this.mpFreeListEnd.pNext
            }
        }

        caller.mpViewportList = null

        let child: PegThing = caller.First()

        while(child) {
            if (child.StatusIs(PSF_VIEWPORT)) {
                this.FreeViewports(child)
            }
            child = child.Next()
        }
    }

    AddViewport(target: PegThing, newView: PegRect) {
        // scan the list, if I get through clean then add this this view to the viewport list. If this view is completly covered, then just return. If this view is partially covered, then split it into pieces and try to add the pieces:

        let child: PegThing

        // This loop checks to see if any sibling objects that also have VIEWPORT status are on top of this viewport:
        if (target.Parent()) {
            child = target.Parent().First()

            while(child && child != target) {
                if (child.StatusIs(PSF_VIEWPORT)) {
                    if (child.mReal.Contains(newView)) {
                        // In this case, a sibling window is completely covering the target window, just return;
                        return;
                    }
                    if (child.mReal.Overlap(newView)) {
                        this.SplitView(target, child.mReal, newView)
                        return
                    }
                }
                child = child.Next()
            }
        }

        // This loop checks to see if any children of the current object have viewport status. If they do, and they overlap the current viewport, the viewport has to be split up:
        child = target.First()
        while(child) {
            if (child.StatusIs(PSF_VIEWPORT)) {
                if (child.mClip.Overlap(newView)) {
                    this.SplitView(target, child.mReal, newView)
                    return
                }
            }
            child = child.Next()
        }

        // we made it through the list, add this guy in:
        let pNew: Viewport = this.GetFreeViewport()
        pNew.mView = newView

        if (target.mpViewportList) {
            pNew.pNext = target.mpViewportList
        } else {
            pNew.pNext = null
        }
        target.mpViewportList = pNew
    }

    SplitView(target: PegThing, child: PegThing, under: PegRect);
    SplitView(target: PegThing, onTop: PegRect, under: PegRect);
    SplitView(target: PegThing, p2: PegThing | PegRect, under: PegRect) {
        if (p2 instanceof PegThing) {
            this.SplitView(target, p2.mClip, under)
            let childView: PegRect = under.and(p2.mClip)
            this.AddViewport(p2, childView)
        } else if (p2 instanceof PegRect) {
            const onTop: PegRect = p2

            if (under.wTop < onTop.wTop) {
                this.AddViewport(target, new PegRect(
                    under.wLeft,
                    under.wTop,
                    under.wRight,
                    under.wTop -1
                ))
            }

            if (under.wBottom > onTop.wBottom) {
                this.AddViewport(target, new PegRect(
                    under.wLeft,
                    onTop.wBottom +1,
                    under.wRight,
                    under.wBottom
                ))
            }

            if (under.wRight > onTop.wRight) {
                new PegRect(
                    onTop.wRight + 1,
                    (under.wTop > onTop.wTop ? under.wTop : onTop.wTop ),
                    under.wRight,
                    (under.wBottom < onTop.wBottom ? under.wBottom : onTop.wBottom ),
                )
            }

            if (under.wLeft < onTop.wLeft) {
                new PegRect(
                    under.wLeft,
                    (under.wTop > onTop.wTop ? under.wTop : onTop.wTop ),
                    onTop.wLeft -1,
                    (under.wBottom < onTop.wBottom ? under.wBottom : onTop.wBottom ),
                )
            }
        }
    }



    GenerateViewportList(pStart: PegThing) {
        while(!pStart.StatusIs(PSF_VIEWPORT)) {
            pStart = pStart.Parent()
        }
        this.FreeViewports(pStart)

        this.AddViewport(pStart, pStart.mReal)
    }

    GetFreeViewport(): Viewport {
        let pNew: Viewport

        if (!this.mpFreeListStart) {
            this.AllocateViewportBlock()
        }
        pNew = this.mpFreeListStart
        this.mpFreeListStart = pNew.pNext

        return pNew
    }

    AllocateViewportBlock() {
        this.mpFreeListStart = {
            mView: new PegRect(0,0,0,0),
            pNext: null
        }
        this.mpFreeListEnd = this.mpFreeListStart

        for (let wLoop = 0; wLoop < VIEWPORT_LIST_INCREMENT; wLoop++) {

            this.mpFreeListEnd = {
                mView: new PegRect(0,0,0,0),
                pNext: null
            }
            
            this.mpFreeListEnd = this.mpFreeListEnd.pNext
            
        }
    }



}

/*--------------------------------------------------------------------------*/
// Prototype for CreatePegScreen()-
//
// The actual implementation is in each individual derived PegScreen class.
/*--------------------------------------------------------------------------*/
export let CreatePegScreen = (): PegScreen => { throw new Error('Need to be implemented by derived PegScreen class'); };
