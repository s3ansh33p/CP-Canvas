import type { BOOL, LONG, UCHAR, WORD } from "../native/windows";
import { FF_MASK, FF_NONE, PegColor, PegPoint, PegRect, PSF_VISIBLE, SIGMASK, type COLORVAL, type PegBitmap, type SIGNED, type TCHAR } from "./pegtypes";
import type { PegFont } from "./pfonts";
import type { PegMessage, PegMessageQueue } from "./pmessage";
import type { PegPresentationManager } from "./ppresent";


/**
 * Base class for all PEG objects
 */
export class PegThing {
    // friend class PegScreen;

    muColors: [COLORVAL,COLORVAL,COLORVAL,COLORVAL];
    mReal: PegRect
    mClient: PegRect
    mClip: PegRect

    protected muType: UCHAR
    protected mwStyle: WORD 
    protected mwId: WORD 
    protected mwStatus: WORD 
    protected mwSignalMask: WORD 
    protected mpParent: PegThing
    protected mpFirst: PegThing
    protected mpNext: PegThing
    protected mpPrev: PegThing

    // static mpScreen: PegScreen
    static mpPresentation: PegPresentationManager
    static mpMessageQueue: PegMessageQueue


    constructor(
        private Rect: PegRect,
        private wId: WORD = 0,
        private wStyle: WORD = FF_NONE) {
            // TODO
    }

    Message(mesg: PegMessage): SIGNED {
        return 0; // TODO
    }

    Draw() {}

    Add(what: PegThing, bDraw: boolean = true) {
        let msg: PegMessage;
        // super.Add(what, bDraw)
    }
    
    AddToEnd(what: PegThing, bDraw: boolean = true) {}
    Remove(what: PegThing, bDraw: boolean) {}
    SetColor(uIndex: UCHAR, uColor: COLORVAL) {}
    GetColor(uIndex: UCHAR): COLORVAL {
        return 0; // TODO
    }
    Center(who: PegThing) {}
    DrawChildren() {}
    Resize(rect: PegRect) {}
    Dectroy(who: PegThing) {}
    Version(): TCHAR {
        return 1; // TODO
    }

    Parent(): PegThing {
        return this.mpParent
    }

    First(): PegThing {
        return this.mpFirst
    }

    Next(): PegThing {
        return this.mpNext
    }

    Previous(): PegThing {
        return this.mpPrev
    }

    Presentation(): PegPresentationManager {
        return PegThing.mpPresentation
    }

    MessageQueue(): PegMessageQueue {
        return PegThing.mpMessageQueue
    }

    // Screen(): PegScreen {
    //     return PegThing.mpScreen
    // }

    
    // Since it's using getter+setter as a single call, it's a cool hack to have it in JS
    Type(uSet?: UCHAR): UCHAR | null {
        if (uSet === undefined) {
            return this.muType
        } else {
            this.muType = uSet
        }
    }

    Id(wId?: WORD): WORD | null {
        if (wId === undefined) {
            return this.mwId
        } else {
            this.mwId = wId
        }
    }

    Find(wId: WORD, bRecursive: BOOL = true): PegThing {
        return this; // TODO
    }

    // Hack bc (wId,wMask) and (wMask) signatures
    SetSignals(w1: WORD, w2?: WORD) {
        if (w2 === undefined) {
            this.mwSignalMask = w1;
        } else {
            this.mwId = w2;
            this.mwSignalMask = w2;
        }
    }

    GetSignals(): WORD {
        return this.mwSignalMask
    }

    CheckSendSignal(uSignal: UCHAR): BOOL {
        if (this.mpParent && this.mwId && (this.mwSignalMask & SIGMASK(uSignal))) {
            if (this.mpParent.StatusIs(PSF_VISIBLE)) {
                this.SendSignal(uSignal)
                return true
            }
        }
        return false
    }

    StatusIs(wMask: WORD): BOOL {
        return (this.mwStatus & wMask) !== 0
    }

    AddStatus(wOrdVal: WORD) {
        this.mwStatus |= wOrdVal
    }

    RemoveStatus(wAndVal: WORD) {
        this.mwStatus &= ~wAndVal
    }

    GetStatus(): WORD {
        return this.mwStatus
    }

    CapturePointer() {}
    ReleasePointer() {}

    FrameStyle(wStyle?: WORD): WORD | null {
        if (wStyle === undefined) {
            return this.mwStyle & FF_MASK
        } else {
            this.wStyle &= FF_MASK
            this.mwStyle &= ~FF_MASK
            this.mwStyle |= wStyle
        }
    }

    Style(wStyle?: WORD): WORD | null {
        if (wStyle === undefined) {
            return this.mwStyle
        } else {
            this.mwStyle = wStyle
        }
    }

    InitClient() {}

    SendSignal(uSignal: UCHAR) {}
    StandardBorder(bFillColor: COLORVAL) {}
    MessageChildren(mesg: PegMessage) {}
    
    UpdateChildClipping() {}
    ClipLowerSiblingObjects() {}
    ParentShift(x: SIGNED, y: SIGNED) {}

    // SetScreenPtr(ps: PegScreen) {
    //     this.mpScreen = ps
    // }

    SetMessageQueuePtr(pq: PegMessageQueue) {
        PegThing.mpMessageQueue = pq
    }

    SetPresentationManagerPtr(pm: PegPresentationManager) {
        PegThing.mpPresentation = pm
    }

    // ViewportList(): Viewport  {return this.mpViewportList;}

    DefaultKeyHandler(imMesg: PegMessage) {}
    CheckDirectionalMove(iKey: SIGNED, bLoose: BOOL = false): BOOL {
        return false // TODO
    }
    Distance(p1: PegPoint, p2: PegPoint): LONG {
        return 0 // TODO
    }

    CenterOf(who: PegThing): PegPoint{
        return new PegPoint(0, 0) // TODO
    }

    SetTimer(wId: WORD, lCount: LONG, lReset: LONG) {
        this.MessageQueue().SetTimer(this, wId, lCount, lReset)
    }

    KillTimer(wId: WORD) {
        this.MessageQueue().KillTimer(this, wId)
    }

    // PegScreen wrappers
    BeginDraw(pbm?: PegBitmap) {
        // Screen().BeginDraw(this, pbm);
    }
    EndDraw(pbm?: PegBitmap) {
        // Screen().EndDraw(this, pbm);
    }
    Line(wXStart: SIGNED , wYStart: SIGNED,
        wXEnd: SIGNED, wYEnd: SIGNED, color: PegColor,
        wWidth: SIGNED = 1) {
            // Screen()->Line(this, wXStart, wYStart, wXEnd, wYEnd, color, wWidth);
    }
    Rectangle(rect: PegRect, color: PegColor, wWidth: SIGNED = 1) {
        // Screen()->Rectangle(this, Rect, Color, wWidth);
    }
    Bitmap(where: PegPoint, bitmap: PegBitmap, bOnTop: BOOL = false) {
        // Screen()->Bitmap(this, Where, bitmap, bOnTop);
    }
    BitmapFill(rect: PegRect, bitmap: PegBitmap) {
        // Screen()->BitmapFill(this, Rect, Getmap);
    }
    RectMove(rect: PegRect, point: PegPoint) {
        // Screen()->RectMove(this, rect, point);
    }
    DrawText(where: PegPoint, text: TCHAR[], color: PegColor, font: PegFont, count: SIGNED = 1) {
        // Screen()->DrawText(this, where, text, color, font, count);
    }
    TextHeight(text: TCHAR[], font: PegFont): SIGNED {
        // return Screen()->TextHeight(Text, Font);
        return 12; // TODO
    }
    TextWidth(text: TCHAR[], font: PegFont): SIGNED {
        // return Screen()->TextWidth(Text, Font);
        return 256; // TODO
    }
    Invalidate(rect?: PegRect) {
        if (rect) {
            // Screen()->Invalidate(Rect);
        } else {
            // Screen()->Invalidate(this.mClient);
        }
    }
    SetPointerType(bType: UCHAR) {
        // Screen()->SetPointerType(bType);
    }
    Circle(xCenter: SIGNED, yCenter: SIGNED, radius: SIGNED, color: PegColor, iWidth: SIGNED) {
        // Screen()->Circle(this, xCenter, yCenter, radius, color, iWidth);
    }



    public static staticFunc() {}
    protected KillFocus(thing: PegThing) {}
}