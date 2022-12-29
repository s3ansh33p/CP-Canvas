import type { DWORD } from "../native/windows";
import type { PegRect } from "./pegtypes";


export interface VID_MEM_BLOCK {
    lMagic: DWORD
    pNext: VID_MEM_BLOCK
    pPrev: VID_MEM_BLOCK
    pNextFree: VID_MEM_BLOCK
    lSize: DWORD
}

export abstract class PegScreen {
    constructor(
        rect: PegRect
    ) {

    }
}