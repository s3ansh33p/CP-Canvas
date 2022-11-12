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

export type RGBColor = [number, number, number]

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
): RGBColor {
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
	// convert vram to imageData
	let imageData = ctx.createImageData(320, 528);
	let data = imageData.data;
	for (let i = 0; i < VRAM.length; i++) {
		let color = INT_RGB565TO888(VRAM[i]);
		data[i * 4] = color[0];
		data[i * 4 + 1] = color[1];
		data[i * 4 + 2] = color[2];
		data[i * 4 + 3] = 255;
	}
	// draw imageData
	ctx.putImageData(imageData, 0, 0);
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
	// console.log("Debug_SetCursorPosition", x, y);
}

/**
 * Convert an html hex color to RGB
 * @param color "#fff" or "#ffffff" hex color 
 * @returns RGBColor : [r, g, b]
 */
export function INT_HEXTORGB(
	color: string
): RGBColor {
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

/**
 * Draws a rectange to VRAM
 * @param x 
 * @param y 
 * @param w Width
 * @param h Height
 * @param color RGB fill color to rectagle
 */
export function rectangle(
	x: number,
	y: number,
	w: number,
	h: number,
	color: RGBColor
) {
	for (let _x = x; _x < x + w; _x += 1) {
		for (let _y = y; _y < y + h; _y += 1) {
			setPixel(_x, _y, color);
		}
	}	
}

/**
 * 
 * @param x 
 * @param y1 
 * @param y2 
 * @param color 
 */
export function vline(
	x: number,
	y1: number,
	y2: number,
	color: RGBColor
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
	color: RGBColor
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
	colorFill: RGBColor,
	colorLine: RGBColor
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

export function fillScreen(color: RGBColor) {
	for (let i = 0; i < 320 * 528; i++) {
		setPixel(i % 320, Math.floor(i / 320), color);
	}
}

/**
 * Set a pixel in VRAM
 * @param x 
 * @param y 
 * @param color 
 */
export function setPixel(
	x: number,
	y: number,
	color: RGBColor
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
	// vram is a 320x528 array of 16bit colors
	for (let i = 0; i < 320 * 528; i++) {
		// set to white
		VRAM[i] = 0xFFFF;
	}
	console.log("LCD_ClearScreen");
}

/**
 * Print a string on screen
 * @param text String to draw
 * @param invert Invert background (black text on white bg)
 */
export function Debug_PrintString(
	text: string,
	invert: boolean,
	large: boolean = true
) {
	let bg = INT_HEXTORGB(invert ? "#fff" : "#000");
	let fg = INT_HEXTORGB(invert ? "#000" : "#fff");

	// Font width and height
	let fw = 6;
	let fh = 12;
	// console.log("Debug_PrintString: '" + text + "' " + invert + " (" + bg + ") (" + fg + ")" + " " + (large ? "large" : "small"));

	// get debug cursor position
	let classpadState = get(classpad);
	let x = classpadState.debug.x;
	let y = classpadState.debug.y;

	let letters = text.split("");

	// Letter pointers
	let _x = 0;
	let _y = 0;

	if (!large) {
		for (let l of letters) {
			let char = small_map[l];
			_x = -1;
			_y = 0;

			// write background to classpad vram
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
						setPixel(1 + fw * x + _x, 1 + fh * y + _y, fg);
					}
				}

				x++;
			}
		}
	} else {
		// Large font so double the size
		// the same sort of thing as above, but moving the if large outside of the loop to avoid the if check every time
		fw *= 2;
		fh *= 2;
		for (let l of letters) {
			let char = small_map[l];
			_x = -1;
			_y = 0;

			// write background to classpad vram
			rectangle(fw * x, fh * y, fw, fh, bg);

			if (char) {
				// console.log(char);
				let [mx, my] = char["size"];

				for (let p of char["data"]) {
					if (_x >= mx) {
						_y += 2;
						_x = 0;
					} else {
						_x++;
					}
					if (p == 1) {
						// set 2x2 pixels
						setPixel(1 + fw * x + _x * 2 + 1, 1 + fh * y + _y + 1, fg);
						setPixel(1 + fw * x + _x * 2 + 2, 1 + fh * y + _y + 1, fg);
						setPixel(1 + fw * x + _x * 2 + 1, 1 + fh * y + _y + 2, fg);
						setPixel(1 + fw * x + _x * 2 + 2, 1 + fh * y + _y + 2, fg);
					}
				}

				x++;
			}
		}
	}
	// set debug cursor position
	classpadState.debug.x = x;
}

/**
 * Print a string on screen
 * @param x 
 * @param y 
 * @param invert Invert background (black text on white bg)
 * @param text String to draw
 */
export function Debug_Printf(
	x: number,
	y: number,
	invert: boolean,
	text: string
) {
	Debug_SetCursorPosition(x, y);
	Debug_PrintString(text, invert, false);
}

/**
 * Debug function test to print all character on screen
 */
export function drawAllDebug() {
	// print all characters
	Debug_Printf(0, 1, true, charmap.slice(0, 53));
	Debug_Printf(0, 2, true, charmap.slice(53));
	Debug_Printf(0, 3, false, charmap.slice(0, 53));
	Debug_Printf(0, 4, false, charmap.slice(53));
}

/**
 * Color function for easier copy/paste from c code
 * Returns RGB888 color
 */
function color(
	r: number,
	g: number,
	b: number
) : RGBColor {
	return [r, g, b];
}
/**
 * SDK demo
 */
export function exampleDisplay() {
	fillScreen(color(0,0,64));
	
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
			setPixel(50+x,250+y, color(x,y,0) );
		}
	}
	// get debug state
	triangle(10,20,40,250,300,100,color(0,255,0),color(0,0,255));
	
	//Example for line(x1,y1,x2,y2,color);
	line(100,30,290,500,color(255,0,0));      //Use RGB color
	LCD_Refresh();
}

// 80062F78
export function Debug_SelectMode1() {
	LCD_ClearScreen();
	Debug_SetCursorPosition(0, 0);
	Debug_PrintString("====<< SELECT  MODE >>====", true)
	Debug_SetCursorPosition(1, 2);
	Debug_PrintString("1.TEST MENU", true);
	Debug_SetCursorPosition(1, 4);
	Debug_PrintString("2.FAT TEST MENU", true);
	Debug_SetCursorPosition(1, 6);
	Debug_PrintString("3.DEBUG MODE ON", true);
	Debug_SetCursorPosition(1, 8);
	// 80062FC2 - calls Debug_OSABSROMInfo
	Debug_PrintString("OS_Date ", true);
	Debug_SetCursorPosition(3, 9);
	// gets OS date - simulated here
	Debug_PrintString("2017/05/12 15:15", true);

	Debug_SetCursorPosition(1, 10);
	Debug_PrintString("ABS_Date ", true);
	// gets ABS date - simulated here
	Debug_SetCursorPosition(3, 11);
	Debug_PrintString("2012/09/04 15:11", true);

	Debug_SetCursorPosition(1, 12);
	Debug_PrintString("ROM_Ver ", true);
	// gets ROM version - simulated here
	Debug_PrintString("02.01.2000.0000", true);
	
	LCD_Refresh();
	// set classpad state
	let classpadState = get(classpad);
	classpadState.cpu.r0 = 1; // menu Index
	classpad.set(classpadState);
	// then calls 80062838, which will get input
	AwaitKeyPress(debugSelect1KeyHandler);
}

// 80062A94
function Debug_TestMenu() {
	LCD_ClearScreen();
	// skipping some stuff, but just shows ROM version
	Debug_SetCursorPosition(2, 0x11); // 17
	Debug_PrintString("ROM_Ver ", true);
	Debug_PrintString("02.01.2000.0000", true);
	
	Debug_SetCursorPosition(2, 0xF);
	// Debug_PrintString("CALIBRATION  XX", true);
	Debug_PrintString("CALIBRATION  --", true); // seems to be -- when tested on both modded and unmodded firmware
	// some check for "OK", "NG" or "--" on the last 2 characters of calibration
	
	Debug_TestMenu_Inner();

	AwaitKeyPress(debugTestMenuKeyHandler);
}

function Debug_TestMenu_Inner() {
	// main loop here
	// I'm making this bit a little more concise
	let stringsMenu = [
		"### LY777D TEST MENU 111 ",
		"1.PATTERN AUTO CHECK",
		"2.FUNC AUTO CHECK",
		"3.TEST FUNCTION",
		"4.VERSION",
		"5.SERVICE",
		"6.VERSION AND SUM",
		"7.BRIGHTNESS",
		"8.CALIBRATION",
		"9.PINCH CHECK",
		"10.OFF CURRENT",
		"11.SEND-RECEIVE",
		"12.RECEIVE-SEND",
		"0.END(RESET)"
	];
	let menuIndex = get(classpad).cpu.r0;
	// console.log("menuIndex", menuIndex);
	// in reality, this is slighly more complicated but more optimized, but this is fine
	for (let i = 0; i < stringsMenu.length; i++) {
		let joinedString = " " + stringsMenu[i] + " ".repeat(26 - stringsMenu[i].length);
		Debug_SetCursorPosition(0, i);
		Debug_PrintString(joinedString, (i != menuIndex));
	}

	LCD_Refresh();
}

function debugTestMenuKeyHandler() {
	// get classpad state
	let classpadState = get(classpad);
	// get r0 - has current menu index
	let r0 = classpadState.cpu.r0;
	// get key pressed
	let input = classpadState.currentInputs[0];
	if (input.length == 0) return;
	// check event type
	if (input.type != "EVENT_KEY") {
		console.log("debugTestMenuKeyHandler: not a key event");
		return;
	}
	let key = input.data.keyCode;
	// console.log("debugTestMenuKeyHandler: key pressed: " + key);
	if (key == "KEYCODE_UP") {
		r0--;
		if (r0 < 0) r0 = 13;
		classpadState.cpu.r0 = r0;
		classpad.set(classpadState);
		Debug_TestMenu_Inner();
	} else if (key == "KEYCODE_DOWN") {
		r0++;
		if (r0 > 13) r0 = 0;
		classpadState.cpu.r0 = r0;
		classpad.set(classpadState);
		Debug_TestMenu_Inner();
	} else if (key == "KEYCODE_EXE") {
		// choose menu item and call function
		// console.log("debugTestMenuKeyHandler: menu item " + r0);
		if (r0 == 1) {
			console.log("debugTestMenuKeyHandler: pattern auto check");
			// Debug_TestMenu_PatternAutoCheck();
		} else if (r0 == 2) {
			console.log("debugTestMenuKeyHandler: func auto check");
			// Debug_TestMenu_FuncAutoCheck();
		} else if (r0 == 3) {
			console.log("debugTestMenuKeyHandler: test function");
			// Debug_TestMenu_TestFunction();
		} else if (r0 == 4) {
			console.log("debugTestMenuKeyHandler: version");
			// Debug_TestMenu_Version();
		} else if (r0 == 5) {
			console.log("debugTestMenuKeyHandler: service");
			// Debug_TestMenu_Service();
		} else if (r0 == 6) {
			console.log("debugTestMenuKeyHandler: version and sum");
			// Debug_TestMenu_VersionAndSum();
		} else if (r0 == 7) {
			console.log("debugTestMenuKeyHandler: brightness");
			// Debug_TestMenu_Brightness();
		} else if (r0 == 8) {
			console.log("debugTestMenuKeyHandler: calibration");
			// Debug_TestMenu_Calibration();
		} else if (r0 == 9) {
			console.log("debugTestMenuKeyHandler: pinch check");
			// Debug_TestMenu_PinchCheck();
		} else if (r0 == 10) {
			console.log("debugTestMenuKeyHandler: off current");
			// Debug_TestMenu_OffCurrent();
		} else if (r0 == 11) {
			console.log("debugTestMenuKeyHandler: send-receive");
			// Debug_TestMenu_SendReceive();
		} else if (r0 == 12) {
			console.log("debugTestMenuKeyHandler: receive-send");
			// Debug_TestMenu_ReceiveSend();
		} else if (r0 == 13) {
			console.log("debugTestMenuKeyHandler: end(reset)");
			// Debug_TestMenu_EndReset();
		}			
		// else r0 == 0, but just re-renders the menu, so ignore 
	}
	// ignore other keys
}

// sub_80062838
function debugSelect1KeyHandler() {
	// get classpadState
	let classpadState = get(classpad);
	// get key state
	let inputs = classpadState.currentInputs;
	// console.log("debugSelect1KeyHandler", inputs);
	// check if any key is pressed
	if (inputs.length > 0) {
		// get first key
		// check the event type is "EVENT_KEY"
		if (inputs[0].type != "EVENT_KEY") {
			console.log("debugSelect1KeyHandler: not a key event");
			return;
		}
		let key = inputs[0].data.keyCode;
		// console.log("key", key);
		// check if key is 1
		if (key == "KEYCODE_1") {
			// call Debug_TestMenu
			// console.log("Debug_TestMenu");
			Debug_TestMenu();
		} else if (key == "KEYCODE_2") {
			// call Debug_FATTestMenu
			// Debug_FATTestMenu();
			console.log("Debug_FATTestMenu");
		} else if (key == "KEYCODE_3") {
			// call Debug_DebugModeOn
			// Debug_DebugModeOn();
			console.log("Debug_DebugModeOn");
		}
		// wait for key
	}
	// wait for key
}

function AwaitKeyPress(functionCall: () => void) {
	// set classpad state to wait for keypress
	let classpadState = get(classpad);
	classpadState.waitingForKeypress = true;
	classpadState.inputCallback = functionCall;
	// maybe set the function to call when key is pressed?
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

	// round to nearest pixel
	x = Math.round(x);
	y = Math.round(y);

	let r = 28;
	let g = 142;
	let b = 226;
	ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
	ctx.fillRect(x, y, 2, 2);

	console.log("Touch event: (" + x + "," + y + ")");
}
