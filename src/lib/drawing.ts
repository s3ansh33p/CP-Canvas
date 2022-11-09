import { get } from "svelte/store";
import { small_map, charmap } from "../common/font";
import {
	width,
	height,
	canvas as canvasStore,
	context as contextStore,
	classpad,
} from "../specs";

/**
 * TODO !!
 */

export function INT_RGB888TO565(
	r: number,
	g: number,
	b: number
): number {
	// return 16 bit color
	return (
		((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3)
	);
}

export function INT_RGB565TO888(
	color: number
): number[] {
	return [
		((color >> 11) & 0x1f) << 3,
		((color >> 5) & 0x3f) << 2,
		(color & 0x1f) << 3,
	];
}

export function LCD_Refresh() {
	// start a timer
	let timeStart = performance.now();
	// get VRAM
	const VRAM = get(classpad).vram;
	// get canvas
	let ctx = get(contextStore);
	// loop through each 8 bytes in VRAM
	// each 3 bytes are a pixel color
	let firstPixel = 0;
	let r = 0;
	let g = 0;
	let b = 0;
	for (let _x = 0; _x < 320; _x += 1) {
		for (let _y = 0; _y < 528; _y += 1) {
			let x = _x;
			let y = _y;
			[r,g,b] = INT_RGB565TO888(VRAM[(x + y * 320)]);
			// draw pixel
			ctx.fillStyle = `rgb(${r},${g},${b})`;
			ctx.fillRect(x, y, 1, 1);
			if (firstPixel == 0) {
				if (r != 0 || g != 0 || b != 0) {
					firstPixel = _x + _y * 320;
				}
			}
		}
	}
	console.log("LCD_Refresh", VRAM);
	console.log("VRAM First:", firstPixel, "| Data:", VRAM[firstPixel], INT_RGB565TO888(VRAM[firstPixel]));
	// end timer
	let timeEnd = performance.now();
	console.log("LCD_Refresh took", timeEnd - timeStart, "ms");
}

export function Debug_SetCursorPosition(
	x: number,
	y: number
) {
	// get classpad store
	const classpadStore = get(classpad);
	// set cursor position
	classpadStore.debug.x = x;
	classpadStore.debug.y = y;
	// store cursor position
	classpad.set(classpadStore);
	console.log("Debug_SetCursorPosition", x, y);
}

export function INT_HEXTORGB(
	color: string
) {
	// check if # is present
	if (color[0] === "#") {
		// remove #
		color = color.slice(1);
	}
	// check len of color
	if (color.length == 3) {
		// convert to 6 digit hex
		color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
	}
	// convert hex to rgb
	let r = parseInt(color.slice(0, 2), 16);
	let g = parseInt(color.slice(2, 4), 16);
	let b = parseInt(color.slice(4, 6), 16);
	return [r, g, b];
}

export function rectangle(
	x: number,
	y: number,
	w: number,
	h: number,
	color: number[]
) {
	// get vram
	const VRAM = get(classpad).vram;
	// vram is a 320x528 array of 3 bytes
	for (let _x = x; _x < x + w; _x += 1) {
		for (let _y = y; _y < y + h; _y += 1) {
			setPixel(_x, _y, color);
		}
	}	
}

export function vline(
	x: number,
	y1: number,
	y2: number,
	color: number[]
) {
	if (y1>y2) { let z=y2; y2=y1; y1=z;}
	for (let y=y1; y<=y2; y++)
		setPixel(x, y, color);
}

export function line(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color: number[]
) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	let ix = 0;
	let iy = 0;
	if (dx > 0) {
		ix = 1;
	} else {
		ix = -1;
		dx = -dx;
	}
	if (dy > 0) {
		iy = 1;
	} else {
		iy = -1;
		dy = -dy;
	}
	setPixel(x1, y1, color);
	if (dx >= dy) {
		let error = 0;
		while (x1 != x2) {
			x1 += ix;
			error += dy;
			if (error >= (dx >> 1)) {
				y1 += iy;
				error -= dx;
			}
			setPixel(x1, y1, color);
		}
	} else {
		let error = 0;
		while (y1 != y2) {
			y1 += iy;
			error += dx;
			if (error >= (dy >> 1)) {
				x1 += ix;
				error -= dy;
			}
			setPixel(x1, y1, color);
		}
	}
}

export function triangle(
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	colorFill: number[],
	colorLine: number[]
) {
	let z;
	if(x0>x2){ z=x2; x2=x0; x0=z; z=y2; y2=y0; y0=z; }
	if(x1>x2){ z=x2; x2=x1; x1=z; z=y2; y2=y1; y1=z; }
	if(x0>x1){ z=x1; x1=x0; x0=z; z=y1; y1=y0; y0=z; }

	let x = x0; //x is the variable that counts from left to right

	//Values for line a
	let ay = y0; //The point y for the current x on the line a
	let aiy; //The direction of line a
	let adx = (x2>x0 ? (       x2-x0) : (        x0-x2) );
	let ady = (y2>y0 ? (aiy=1, y2-y0) : (aiy=-1, y0-y2) );
	let aerr = 0; //The y value of a (fractional part). y is actually ay+(aerr/adx)

	//Values for line b
	let by = y0; //The point y for the current x on the line b
	let biy; //The direction of line b
	let bdx = (x1>x0 ? (       x1-x0) : (        x0-x1) );
	let bdy = (y1>y0 ? (biy=1, y1-y0) : (biy=-1, y0-y1) );
	let berr = 0;

	//Values for line c
	let cy = y1; //The point y for the current x on the line y (starting at P1)
	let ciy; //The direction of line c
	let cdx = (x2>x1 ? (       x2-x1) : (        x1-x2) );
	let cdy = (y2>y1 ? (ciy=1, y2-y1) : (ciy=-1, y1-y2) );
	let cerr = 0;

	//First draw area between a and b
	while (x<x1){
		x++;
		aerr+=ady;
		while(aerr>=adx >> 2){ //if aerr/adx >= 0.5
			aerr-=adx;
			ay+=aiy;
		}
		berr+=bdy;
		while(berr>=bdx >> 2){ //if berr/bdx >= 0.5
			berr-=bdx;
			by+=biy;
		}
		vline(x,ay,by,colorFill);
	}

	//Then draw area between a and c
	while (x<x2-1){ //we don't need x=x2, bacause x should already have the right vaue... 
		x++;
		aerr+=ady;
		while(aerr>=adx >> 2){ //if aerr/adx >= 0.5
			aerr-=adx;
			ay+=aiy;
		}
		cerr+=cdy;
		while(cerr>=cdx >> 2){ //if berr/bdx >= 0.5
			cerr-=cdx;
			cy+=ciy;
		}
		vline(x,ay,cy,colorFill);
	}

	line(x0,y0,x1,y1,colorLine);
	line(x1,y1,x2,y2,colorLine);
	line(x2,y2,x0,y0,colorLine);
}

export function fillScreen(color: number[]) {
	for (let i = 0; i < 320 * 528; i++) {
		setPixel(i % 320, Math.floor(i / 320), color);
	}
}

export function setPixel(
	x: number,
	y: number,
	color: number[]
) {
	// get vram
	const VRAM = get(classpad).vram;
	// vram is a 320x528 array of 3 bytes
	let i = (x + y * 320);
	VRAM[i] = INT_RGB888TO565(color[0], color[1], color[2]);
}

export function LCD_ClearScreen() {
	// get vram
	const VRAM = get(classpad).vram;
	// vram is a 320x528 array of 3 bytes
	for (let i = 0; i < 320 * 528 * 3; i++) {
		VRAM[i] = 0;
	}
	console.log("LCD_ClearScreen");
}

export function Debug_PrintString(
	text: string,
	invert: boolean
) {
	let canvas = get(canvasStore);
	let ctx = get(contextStore);

	let bg = INT_HEXTORGB(invert ? "#fff" : "#000");
	let fg = INT_HEXTORGB(invert ? "#000" : "#fff");
	// Font width and height
	let fw = 6;
	let fh = 12;
	console.log("Debug_PrintString", text, invert, bg, fg);

	// get debug cursor position
	let classpadState = get(classpad);
	let x = classpadState.debug.x;
	let y = classpadState.debug.y;

	let letters = text.split("");

	// Letter pointers
	let _x = 0;
	let _y = 0;

	for (let l of letters) {
		let char = small_map[l];
		_x = -1;
		_y = 0;

		// ctx.fillStyle = bg;
		// ctx.fillRect(fw * x, fh * y, fw, fh);
		// instead of filling the canvas, write to classpad vram
		rectangle(fw * x, fh * y, fw, fh, bg);

		if (char) {
			// console.log(char);
			let [mx, my] = char["size"];

			for (let p of char["data"]) {
				if (_x >= mx) {
					_y += 1;
					_x = 0;
				} else {
					_x++;
				}
				if (p == 1) {
					// ctx.fillStyle = fg;
					// ctx.fillRect(1 + fw * x + _x, 1 + fh * y + _y, 1, 1);
					setPixel(1 + fw * x + _x, 1 + fh * y + _y, fg);
				}
			}

			x++;
		}
	}
	// set debug cursor position
	classpadState.debug.x = x;
}

export function Debug_Printf(
	x: number,
	y: number,
	invert: boolean,
	text: string
) {
	Debug_SetCursorPosition(x, y);
	Debug_PrintString(text, invert);
}

export function drawAllDebug() {
	// print all characters
	Debug_Printf(0, 1, true, charmap.slice(0, 54));
	Debug_Printf(0, 2, true, charmap.slice(54));
	Debug_Printf(0, 3, false, charmap.slice(0, 54));
	Debug_Printf(0, 4, false, charmap.slice(54));
}

export function exampleDisplay() {
	fillScreen([0,0,64]);
	
	//Example for Debug_Printf(x,y,invert_color,0,format_string) //(small text)
	Debug_Printf(10, 1, false, "Test");

	//Example for Debug_PrintString(string, invert_color) //(big text)
	Debug_SetCursorPosition(16,1);
	Debug_PrintString("HelloWorld", true);

	//use this command to actually update the screen 
	LCD_Refresh();

	//Example for setPixel(x,y,color)
	for (let x=0; x<256;x++){
		for (let y=0; y<256; y++){
			setPixel(50+x,250+y, [x,y,0] );
		}
	}
	// get debug state
	triangle(10,20,40,250,300,100,[0,255,0],[0,0,255]);
	
	//Example for line(x1,y1,x2,y2,color);
	line(100,30,290,500,[255,0,0]);      //Use RGB color
	LCD_Refresh();
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
