import type { DWORD, LONG, UCHAR, WORD } from "../native/windows";
import type { PegPoint, PegRect, SIGNED } from "./pegtypes";
import type { PegThing } from "./pthing";

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

const FIRST_SIGNAL: WORD = 128;
const FIRST_USER_MESSAGE: WORD = 0x4000;

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
        pTo?: PegThing,
        wVal?: WORD
    ) {
        this.next = null
        this.pTarget = pTo
        this.pSource = null
        this.wType = wVal
    }
}

export class PegTimer {
    next?: PegTimer
    who?: PegThing
    wId?: WORD
    lCnt?: LONG
    lRes?: LONG

    constructor (
        next?: PegTimer,
        who?: PegThing,
        wId?: WORD,
        lCnt?: LONG,
        lRes?: LONG
    ) {
        this.next = next || null
        this.who = who || null
        this.wId = wId
        this.lCnt = lCnt
        this.lRes = lRes
    }
}

export class PegMessageQueue {
    private mpFirst: PegMessage
    private mpLast: PegMessage
    private mpFree: PegMessage
    private mpFreeEnd: PegMessage
    private mpTimerList: PegTimer

    constructor() {

    }

    Push(inMsg: PegMessage) {
        // inMsg
    }

    Pop(inMsg: PegMessage) {}
    Fold(inMsg: PegMessage) {}
    Purge(inMsg: PegThing) {}
    SetTimer(who: PegThing, wId: WORD, lCount: LONG, lReset: LONG) {}
    KillTimer(who: PegThing, wId: WORD) {}
    TimerTick() {}

}