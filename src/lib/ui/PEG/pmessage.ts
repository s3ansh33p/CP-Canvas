import type { DWORD, LONG, UCHAR, WORD } from "../native/windows";
import { NUM_PEG_FREE_MSGS } from "./peg";
import type { PegPoint, PegRect, SIGNED } from "./pegtypes";
import { PegThing } from "./pthing";

// Standard PEG generated message types
export enum PegSystemMessage {
    PM_ADD = 1,
    PM_REMOVETHING,
    PM_DESTROY,
    PM_SIZE,
    PM_MOVE,
    PM_CLOSE,
    PM_HIDE,
    PM_SHOW,
    PM_POINTER_MOVE,
    PM_LBUTTONDOWN,
    PM_LBUTTONUP,
    PM_RBUTTONDOWN,
    PM_RBUTTONUP,
    PM_DRAW,
    PM_CURRENT,
    PM_NONCURRENT,
    PM_POINTER_ENTER,
    PM_POINTER_EXIT,
    PM_EXIT,
    PM_ADDICON,
    PM_BEGIN_MOVE,
    PM_PARENTSIZED,
    PM_VSCROLL,
    PM_HSCROLL,
    PM_MAXIMIZE,
    PM_MINIMIZE,
    PM_RESTORE,
    PM_CLOSE_SIBLINGS,
    PM_TIMER,
    PM_KEY,
    PM_KEY_HOLD,
    PM_KEY_RELEASE,
    PM_CUT,
    PM_COPY,
    PM_PASTE,
    PM_SLIDER_DRAG,
    PM_MWCOMPLETE,
    PM_DIALOG_NOTIFY,
    PM_DIALOG_APPLY,
    PM_MOVE_FOCUS
}

export const FIRST_SIGNAL: WORD = 128;
export const FIRST_USER_MESSAGE: WORD = 0x4000;

export class PegMessage {
    wType: WORD
    iData: SIGNED
    pTarget: PegThing
    pSource: PegThing
    next: PegMessage

    // union
    pData: any // void* 
    lData: LONG
    rect: PegRect
    point: PegPoint
    lUserData: [LONG,LONG]
    dUserData: [DWORD,DWORD]
    iUserData: [SIGNED,SIGNED,SIGNED,SIGNED]
    wUserData: [WORD,WORD,WORD,WORD]
    uUserData: [UCHAR,UCHAR,UCHAR,UCHAR,UCHAR,UCHAR,UCHAR,UCHAR]

    
    constructor (
        p1?: WORD | PegThing,
        wVal?: WORD
    ) {
        if (p1 instanceof PegThing) {
            this.pTarget = p1
            this.wType = wVal || 0
        } else if (p1) {
            this.pTarget = null
            this.wType = (p1 as number) || 0
        } else {
            this.pTarget = null
        }

        this.next = null
        this.pSource = null
    }
}

export class PegTimer {
    pNext?: PegTimer
    pTarget?: PegThing
    lCount?: LONG
    lReset?: LONG
    wTimerId?: WORD

    constructor (
        pNext?: PegTimer,
        pTarget?: PegThing,
        wTimerId?: WORD,
        lCount?: LONG,
        lReset?: LONG
    ) {
        this.pNext = pNext || null
        this.pTarget = pTarget || null
        this.lCount = lCount
        this.lReset = lReset
        this.wTimerId = wTimerId
    }
}

export class PegMessageQueue {
    private mpFirst: PegMessage
    private mpLast: PegMessage
    private mpFree: PegMessage
    private mpFreeEnd: PegMessage
    private mpTimerList: PegTimer

    lTargMesg: number = 0

    constructor() {
        this.mpFirst = null
        this.mpLast = null
        this.mpFree = new PegMessage()
        let current: PegMessage = this.mpFree

        for (let wLoop = 0; wLoop < NUM_PEG_FREE_MSGS; wLoop++) {
            current.next = new PegMessage()
            current = current.next
        }

        this.mpFree = current
        this.mpTimerList = null
    }

    Push(inMsg: PegMessage) {
        console.log(`PegMessageQueue::Push : ${PegSystemMessage[inMsg.wType] || inMsg.wType}`, inMsg)

        if (inMsg.pTarget) {
            this.lTargMesg++
        }

        if (this.mpFree) {
            let current: PegMessage = this.mpFree
            this.mpFree = this.mpFree.next

            if (!this.mpFree) {
                this.mpFreeEnd = null
            }
            current = inMsg
            current.next = null

            if (this.mpLast) {
                this.mpLast.next = current
            } else {
                this.mpFirst = current
            }
            this.mpLast = current
        } else {
            console.warn("\n\n ****** PegMessageQueue::Push dropped a message (", inMsg, ")******\n\n\n")
        }

        // inMsg
    }

    Pop(put: PegMessage): PegMessage {
        while(true) {
            if (this.mpFirst) {
                Object.assign(put, this.mpFirst)
                // put = this.mpFirst
                put.next = null

                if (this.mpFreeEnd) {
                    this.mpFreeEnd.next = this.mpFirst
                } else {
                    this.mpFree = this.mpFirst
                }

                this.mpFreeEnd = this.mpFirst
                this.mpFirst = this.mpFirst.next
                this.mpFreeEnd.next = null

                if (!this.mpFirst) {
                    this.mpLast = null
                }
                return put
            } else {
                console.log("TODO: IDLE")
                debugger
                this.PegIdleFunction()
            }
        }
    }

    PegIdleFunction(): void {
        let bQuit = false
        let pt: PegThing = null
        // let newMessage: PegMessage
        // newMessage.lData = 0
        
        PegThing.mpMessageQueue.TimerTick()
    }

    Fold(inMsg: PegMessage) {
        let pTest: PegMessage = this.mpFirst

        while(pTest) {
            if (pTest.wType == inMsg.wType && pTest.pTarget == inMsg.pTarget && pTest.iData == inMsg.iData) {
                // these messages match, fold the old one into the new one:
                pTest.rect = inMsg.rect
                
                return
            }
            pTest = pTest.next
        }
        this.Push(inMsg)
    }
    
    Purge(inMsg: PegThing) {}
    SetTimer(who: PegThing, wId: WORD, lCount: LONG, lReset: LONG) {}
    KillTimer(who: PegThing, wId: WORD) {}
    
    TimerTick() {
        let pTimer: PegTimer = this.mpTimerList
        let pPrevious: PegTimer = pTimer
        let newMessage: PegMessage

        while(pTimer) {
            pTimer.lCount--

            if (pTimer.lCount == 0) {
                // send a message to this guy:

                newMessage.wType = PegSystemMessage.PM_TIMER
                newMessage.pTarget = pTimer.pTarget
                newMessage.iData = pTimer.wTimerId
                this.Fold(newMessage)

                if (pTimer.lReset > 0) {
                    pTimer.lCount = pTimer.lReset
                    pTimer = pTimer.pNext
                } else {
                    if (pTimer == this.mpTimerList) {
                        this.mpTimerList =pTimer.pNext
                        pTimer = this.mpTimerList
                    } else {
                        pPrevious.pNext = pTimer.pNext
                        pTimer = pPrevious.pNext
                    }
                }
            } else {
                pPrevious = pTimer
                pTimer = pTimer.pNext
            }
        }
    }

}