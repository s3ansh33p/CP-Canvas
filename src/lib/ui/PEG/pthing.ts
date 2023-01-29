import { charmap } from "../../../common/font";
import type { BOOL, LONG, UCHAR, WORD } from "../native/windows";
import { FF_MASK, FF_NONE, FF_RAISED, FF_RECESSED, FF_THICK, FF_THIN, PegColor, PegPoint, PegRect, PSF_ACCEPTS_FOCUS, PSF_ALWAYS_ON_TOP, PSF_CURRENT, PSF_NONCLIENT, PSF_OWNS_POINTER, PSF_SELECTABLE, PSF_VIEWPORT, PSF_VISIBLE, SIGMASK, TYPE_THING, type COLORVAL, type PegBitmap, type SIGNED, type TCHAR } from "./pegtypes";
import type { PegFont } from "./pfonts";
import { PegMessage, PegMessageQueue, PegSystemMessage } from "./pmessage";
import type { PegPresentationManager } from "./ppresent";
import type { PegScreen, Viewport } from "./pscreen";


/**
 * Base class for all PEG objects
 */
export abstract class PegThing {
    // friend class PegScreen;

    muColors: [COLORVAL,COLORVAL,COLORVAL,COLORVAL] = [0,0,0,0];
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

    public mpViewportList: Viewport

    static mpScreen: PegScreen
    static mpPresentation: PegPresentationManager
    static mpMessageQueue: PegMessageQueue


    constructor (
        p1: PegRect | WORD,
        p2: WORD,
        wStyle?: WORD

    ) {
        this.muType = TYPE_THING
        this.mwSignalMask = 0
        this.mwStatus = PSF_SELECTABLE|PSF_ACCEPTS_FOCUS
        this.mpParent = null
        this.mpFirst = null
        this.mpNext = null
        this.mpPrev = null

        this.mpViewportList = null

        if (p1 instanceof PegRect) {
            const rect: PegRect = p1
            this.mReal = rect
            this.mClient = rect
            this.mClip = rect
            this.mwStyle = wStyle || FF_NONE
            this.mwId = p2
        } else if(typeof p1 == "number") {
            this.mwStyle = p2
            this.mwId = p1
            this.mReal = PegRect.Set(0, 0, 0, 0);
            this.mClient = this.mReal;
            this.mClip = this.mReal;
        }
    }

    destruct(): void {
        while (this.mpFirst) {
            let delPtr: PegThing = this.mpFirst
            this.mpFirst = delPtr.mpNext
            delPtr.destruct() // polyfill for delete + destructor
        }
        if (this.mpViewportList) {
            // this.Screen().FreeViewports(this);
        }
    }

    Message(mesg: PegMessage): SIGNED {
        switch(mesg.wType) {
            case PegSystemMessage.PM_DRAW:
                this.Invalidate(this.mReal)
                this.Draw()
                break
            
            case PegSystemMessage.PM_SHOW:
                this.mwStatus |= PSF_VISIBLE
                this.MessageChildren(mesg)
                break
            
            case PegSystemMessage.PM_HIDE:
                if (this.mwStatus & PSF_CURRENT) {
                    this.Presentation().NullInput(this)
                }
                this.mwStatus |= PSF_VISIBLE
                this.MessageChildren(mesg)
                break
            
                
                
            
        }
        return 0; // TODO
    }

    Draw(): void {
        if (this.mwStatus & PSF_VISIBLE) {
            this.BeginDraw()
            this.DrawChildren()
            this.EndDraw()
        }
    }

    Add(what: PegThing, bDraw: boolean = true): void {
        let msg: PegMessage = new PegMessage()
        let pTemp: PegThing

        // make sure it is not already in the list:
        if (what.mpParent == this) {
            if (this.mpFirst == what) {
                return;
            }
            pTemp = this.mpFirst

            while(pTemp) {
                if (pTemp.mpNext == what) {
                    // already in list, unlink it for move to front
                    pTemp.mpNext = what.mpNext
                    if (pTemp.mpNext) {
                        pTemp.mpNext.mpPrev = pTemp
                    }
                    break
                }
                pTemp = pTemp.mpNext
            }
        }

        // update my links, default to putting What in front:
        what.mpParent = this
        what.mpNext = this.mpFirst
        what.mpPrev = null

        if(this.mpFirst) {
            // Make sure to put What after any ALWAYS_ON_TOP objects:
            if (this.mpFirst.StatusIs(PSF_ALWAYS_ON_TOP) && !what.StatusIs(PSF_ALWAYS_ON_TOP)) {
                pTemp = this.mpFirst

                while(pTemp.mpNext) {
                    if (pTemp.mpNext.StatusIs(PSF_ALWAYS_ON_TOP)) {
                        pTemp = pTemp.mpNext
                    } else {
                        break
                    }
                }

                // What goes after the object pointed to by pTemp:
                what.mpNext = pTemp.mpNext
                what.mpPrev = pTemp
                pTemp.mpNext = what

                if (what.mpNext) {
                    what.mpNext.mpPrev = what
                }
            } else {
                // Make sure we keep the Viewport owners on top of any lesser siblings:
                if (!what.StatusIs(PSF_VIEWPORT) && this.mpFirst.StatusIs(PSF_VIEWPORT)) {
                    pTemp = this.mpFirst
                    while(pTemp.mpNext) {
                        if (pTemp.mpNext.StatusIs(PSF_VIEWPORT)) {
                            pTemp = pTemp.mpNext
                        } else {
                            break
                        }
                    }

                    // What goes after the object pointed to by pTemp:
                    what.mpNext = pTemp.mpNext
                    what.mpPrev = pTemp
                    pTemp.mpNext = what

                    if (what.mpNext) {
                        what.mpNext.mpPrev = what
                    }
                } else {
                    // What becomes my First child:
                    this.mpFirst.mpPrev = what
                    this.mpFirst = what
                }
            }
        } else {
            this.mpFirst = what
        }

        if (this.mwStatus & PSF_VISIBLE) {
            if (!(what.mwStatus & PSF_VISIBLE)) {
                // insure a zero clipping area:
                what.mClip.wRight = what.mClip.wLeft - 1
                
                // tell the object it is now visible
                msg.wType = PegSystemMessage.PM_SHOW
                what.Message(msg)

                // now update the objects clipping area:
                what.mClip = what.mReal.and(this.mClip) // mReal & mClip

                if (!what.StatusIs(PSF_NONCLIENT)) {
                    what.mClip = what.mClip.and(this.mClip) // &= mClip
                }

                if (what.mpFirst) {
                    what.UpdateChildClipping()
                }

            }

            if (what.StatusIs(PSF_VIEWPORT)) {
                this.Screen().GenerateViewportList(this)
            }

            if (bDraw) {
                this.Screen().Invalidate(what.mClip)
                what.Draw()
            }
        }

        // super.Add(what, bDraw)
    }
    
    AddToEnd(what: PegThing, bDraw: boolean = true) {
        debugger
    }
    Remove(what: PegThing, bDraw: boolean) {}
    SetColor(uIndex: UCHAR, uColor: COLORVAL) {}
    GetColor(uIndex: UCHAR): COLORVAL {
        return 0; // TODO
    }
    Center(who: PegThing) {}
    DrawChildren() {
        if (!this.mpFirst) return

        let pCurrent: PegThing = this.mpFirst

        while(pCurrent.mpNext) {
            pCurrent = pCurrent.mpNext
        }

        while(pCurrent) {
            // #ifdef PEG_AWT_SUPPORT
            if (this.mReal.Overlap(pCurrent.mClip)) {
                // pCurrent.Draw()
            }
            //  #else
            if (this.Screen().InvalidOverlap(pCurrent.mClip)) {
                pCurrent.Draw()
            }
            // # endif
            pCurrent = pCurrent.mpPrev
        }
        
    }
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

    Screen(): PegScreen {
        return PegThing.mpScreen
    }

    
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
    ReleasePointer() {
    }

    FrameStyle(wStyle?: WORD): WORD | null {
        if (wStyle === undefined) {
            return this.mwStyle & FF_MASK
        } else {
            wStyle &= FF_MASK
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

    InitClient() {
        this.mClient = this.mReal

        // switch(this.mwStyle & FF_MASK) {
            // case FF_RECESSED:
            // case FF_RAISED:
            //     if (this.Screen().NumColors() >= 4) {
            //         this.mClient -= 2;
            //     } else {
            //         mClient--;
            //     }
            //     break;
            // case FF_RECESSED:
            // case FF_RAISED:
            //     mClient -= 2;
            //     break;
            // #endif
            // #endif
        
            // case FF_THIN:
            //     mClient--;
            //     break;
        
            // case FF_THICK:
            //     mClient -= PEG_FRAME_WIDTH;
            //     break;
        
            // case FF_NONE:
            // default:
            //     break;
            // }
    }

    SendSignal(uSignal: UCHAR) {}
    StandardBorder(bFillColor: COLORVAL) {}
    MessageChildren(mesg: PegMessage) {}
    
    UpdateChildClipping() {}
    ClipLowerSiblingObjects() {}
    ParentShift(x: SIGNED, y: SIGNED) {}

    static SetScreenPtr(ps: PegScreen) {
        PegThing.mpScreen = ps
    }

    static SetMessageQueuePtr(pq: PegMessageQueue) {
        PegThing.mpMessageQueue = pq
    }

    static SetPresentationManagerPtr(pm: PegPresentationManager) {
        PegThing.mpPresentation = pm
    }

    ViewportList(): Viewport  {return this.mpViewportList;}

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
        if (pbm) {
            this.Screen().BeginDraw(this, pbm);
        } else {
            this.Screen().BeginDraw(this);
        }
    }
    EndDraw(pbm?: PegBitmap) {
        if (pbm) {
            this.Screen().EndDraw(pbm);
        } else {
            this.Screen().EndDraw();
        }
    }
    Line(wXStart: SIGNED , wYStart: SIGNED,
        wXEnd: SIGNED, wYEnd: SIGNED, color: PegColor,
        wWidth: SIGNED = 1) {
            this.Screen().Line(this, wXStart, wYStart, wXEnd, wYEnd, color, wWidth);
    }
    Rectangle(rect: PegRect, color: PegColor, wWidth: SIGNED = 1) {
        this.Screen().Rectangle(this, rect, color, wWidth);
    }
    Bitmap(where: PegPoint, bitmap: PegBitmap, bOnTop: BOOL = false) {
        this.Screen().Bitmap(this, where, bitmap, bOnTop);
    }
    BitmapFill(rect: PegRect, bitmap: PegBitmap) {
        this.Screen().BitmapFill(this, rect, bitmap);
    }
    RectMove(rect: PegRect, point: PegPoint) {
        this.Screen().RectMove(this, rect, point);
    }
    DrawText(where: PegPoint, text: TCHAR[], color: PegColor, font: PegFont, count: SIGNED = 1) {
        this.Screen().DrawText(this, where, text, color, font, count);
    }
    TextHeight(text: TCHAR[], font: PegFont): SIGNED {
        return this.Screen().TextHeight(text, font) || 12;
        // return 12; // TODO
    }
    TextWidth(text: TCHAR[], font: PegFont): SIGNED {
        return this.Screen().TextWidth(text, font) || 256
        // return 256; // TODO
    }
    Invalidate(rect?: PegRect) {
        if (rect) {
            this.Screen().Invalidate(rect);
        } else {
            this.Screen().Invalidate(this.mClient);
        }
    }
    SetPointerType(bType: UCHAR) {
        this.Screen().SetPointerType(bType);
    }
    Circle(xCenter: SIGNED, yCenter: SIGNED, radius: SIGNED, color: PegColor, iWidth?: SIGNED) {
        if (!iWidth) iWidth = 0 
        this.Screen().Circle(xCenter, yCenter, radius, color, iWidth);
    }



    public static staticFunc() {}
    protected KillFocus(thing: PegThing) {}
}