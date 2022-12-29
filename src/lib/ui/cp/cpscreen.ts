import { WIDTH, HEIGHT} from '../../../specs'
import { PegScreen } from '../PEG/pscreen'

export const PEG_VIRTUAL_XSIZE = WIDTH
export const PEG_VIRTUAL_YSIZE = HEIGHT
export const ROTSCRATCH_SIZE = 10240

export class CPCanvasScreen extends PegScreen {
    constructor(
        rect: PegScreen
    ) {
        super(rect)
    }
}