import { get } from "svelte/store";
import { small_map, charmap } from "../common/font";
import {
	width,
	height,
	canvas as canvasStore,
	context as contextStore,
} from "../specs";

/**
 * TODO !!
 */
export function LCD_Refresh() {}

export function Debug_Printf(
	x: number,
	y: number,
	invert: boolean,
	text: string
) {
	let canvas = get(canvasStore);
	let ctx = get(contextStore);

	let bg = invert ? "#fff" : "#000";
	let fg = invert ? "#000" : "#fff";
	// Font width and height
	let fw = 6;
	let fh = 12;

	let letters = text.split("");

	// Letter pointers
	let _x = 0;
	let _y = 0;

	for (let l of letters) {
		let char = small_map[l];
		_x = -1;
		_y = 0;

		ctx.fillStyle = bg;
		ctx.fillRect(fw * x, fh * y, fw, fh);

		if (char) {
			console.log(char);
			let [mx, my] = char["size"];

			for (let p of char["data"]) {
				if (_x >= mx) {
					_y += 1;
					_x = 0;
				} else {
					_x++;
				}
				if (p == 1) {
					ctx.fillStyle = fg;
					ctx.fillRect(1 + fw * x + _x, 1 + fh * y + _y, 1, 1);
				}
			}

			x++;
		}
	}
}

export function drawAllDebug() {
	// print all characters
	Debug_Printf(0, 1, true, charmap.slice(0, 54));
	Debug_Printf(0, 2, true, charmap.slice(54));
	Debug_Printf(0, 3, false, charmap.slice(0, 54));
	Debug_Printf(0, 4, false, charmap.slice(54));
}

/**
 * Just a simple draw function
 */
export function doDrawPixels() {
	let canvas = get(canvasStore);
	let ctx = get(contextStore);

	ctx.fillStyle = "green";
	ctx.fillRect(10, 10, 150, 100);

	// let canvasWidth = get(width);
	// let canvasHeight = get(height);

	// ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	// var id = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	// var pixels = id.data;
	// var x = Math.floor(Math.random() * canvasWidth);
	// var y = Math.floor(Math.random() * canvasHeight);
	// var r = Math.floor(Math.random() * 256);
	// var g = Math.floor(Math.random() * 256);
	// var b = Math.floor(Math.random() * 256);
	// var off = (y * id.width + x) * 4;
	// pixels[off] = r;
	// pixels[off + 1] = g;
	// pixels[off + 2] = b;
	// pixels[off + 3] = 255;
	// ctx.putImageData(id, 8, 8);
}

/**
 * Clear the calculator screen
 */
export function clearScreen() {
	let canvas = get(canvasStore);
	let ctx = get(contextStore);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Called on canvas touch event
 * @param x touch X
 * @param y touch Y
 */
export function handleTouch(x, y) {
	let canvas = get(canvasStore);
	let ctx = get(contextStore);

	let r = 28;
	let g = 142;
	let b = 226;
	ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
	ctx.fillRect(x, y, 2, 2);
}
