import { WIDTH, HEIGHT} from '../../../specs'
import { setPixel } from '../../drawing'
import type { PegBitmap, PegColor, PegRect, PegPoint } from '../PEG/pegtypes'
import type { PegFont } from '../PEG/pfonts'
import { PegScreen } from '../PEG/pscreen'
import type { PegThing } from '../PEG/pthing'

export const PEG_VIRTUAL_XSIZE = WIDTH
export const PEG_VIRTUAL_YSIZE = HEIGHT
export const ROTSCRATCH_SIZE = 10240

export class CPCanvasScreen extends PegScreen {
    GetPixel(caller: PegThing, x: number, y: number): number {
        throw new Error('Method not implemented.')
    }
    CreateBitmap(wWidth: number, wHeight: number): PegBitmap {
        throw new Error('Method not implemented.')
    }
    DestroyBitmap(pMap: PegBitmap) {
        throw new Error('Method not implemented.')
    }
    Line(caller: PegThing, wXStart: number, wYStart: number, wXEnd: number, wYEnd: number, color: PegColor, wWidth: number) {
        throw new Error('Method not implemented.')
    }
    Rectangle(caller: PegThing, rect: PegRect, color: PegColor, wWidth: number) {
        throw new Error('Method not implemented.')
    }
    Bitmap(caller: PegThing, where: PegPoint, bitmap: PegBitmap, bOnTop: boolean) {
        throw new Error('Method not implemented.')
    }
    BitmapFill(caller: PegThing, rect: PegRect, bitmap: PegBitmap) {
        throw new Error('Method not implemented.')
    }
    RectMove(caller: PegThing, rect: PegRect, point: PegPoint) {
        throw new Error('Method not implemented.')
    }
    ViewportMove(caller: PegThing, rect: PegRect, point: PegPoint) {
        throw new Error('Method not implemented.')
    }
    DrawText(caller: PegThing, where: PegPoint, text: number[], color: PegColor, font: PegFont, count: number) {
        throw new Error('Method not implemented.')
    }
    TextHeight(text: number[], font: PegFont): number {
        throw new Error('Method not implemented.')
    }
    TextWidth(text: number[], font: PegFont, iLen: number): number {
        throw new Error('Method not implemented.')
    }
    Circle(xCenter: number, yCenter: number, radius: number, color: PegColor, iWidth: number) {
        throw new Error('Method not implemented.')
    }

    constructor(
        rect: PegRect
    ) {
        super()
    }

    PlotPointView(x: number, y: number, color: number) {
        setPixel(x, y, [color&0xff0000, color&0xff00, color&0xff])
    }
}