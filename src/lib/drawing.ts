import { get } from "svelte/store";
import {
	width,
	height,
	canvas as canvasStore,
	context as contextStore,
} from "../specs";

export function LCD_Refresh() {}

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

export function clearScreen() {
	let canvas = get(canvasStore);
	let ctx = get(contextStore);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function handleTouch(x, y) {
	let canvas = get(canvasStore);
	let ctx = get(contextStore);

	let r = 28;
	let g = 142;
	let b = 226;
	ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
	ctx.fillRect(x, y, 2, 2);
}
