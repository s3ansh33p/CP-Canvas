import { get } from "svelte/store";
import { zoomFactor,
	classpad,
	canvas as canvasStore,
	context as contextStore
} from "../specs";


export function touchEventToPosition(ev: MouseEvent): [number, number] {
	// Get the target
	var target = ev.target as HTMLElement;

	// Get the bounding rectangle of target
	const rect = target.getBoundingClientRect();

	// Mouse position
	const x = ev.clientX - rect.left;
	const y = ev.clientY - rect.top;

	return [x, y];
}

export function keyEventHandler(key) {
	// set key state
	let classpadState = get(classpad);
	console.log("Key event:", key);
	
	// @TODO: REWORK THIS!!!

	let inputEvent = {
		type: "EVENT_KEY",
		// zero: 0, // I think this is always 0? not sure if it's needed
		data: {
			// depending on the type, this will be different
			// I should maybe make a class instead of this, but for now this is fine

			// for EVENT_KEY
			/**
			 * The direction the key traveled. One of @c KEY_PRESSED,
			 * @c KEY_HELD or @c KEY_RELEASED.
			 */
			// uint32_t direction;
			direction: "KEY_PRESSED",

			/**
			 * The key code for the key. See macros beginning with @c KEYCODE_.
			 */
			// uint16_t keyCode;
			keyCode: key,
		}
	}

	// console.log("inputEvent:", inputEvent);
	classpadState.currentInputs.push(inputEvent);
	classpad.set(classpadState);

	// call event handler contained in classpadState.inputCallback
	// e.g. "debugSelect1KeyHandler" may be set, so call it
	if (classpadState.inputCallback) {
		classpadState.inputCallback();
	}
	// clear key state
	classpadState.currentInputs = [];
	classpad.set(classpadState);

}

/**
 * Called on canvas touch event
 * @param x touch X
 * @param y touch Y
 * @param type touch type
 */
export function handleTouch(x, y, type) {
	let ctx = get(contextStore);

	// round to nearest pixel
	x = Math.round(x);
	y = Math.round(y);

	let r = 28;
	let g = 142;
	let b = 226;
	ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
	ctx.fillRect(x, y, 2, 2);

	// console.log("Touch event: (" + x + "," + y + ")");

	let touchDirection = "TOUCH_DOWN";
	if (type == "up") {
		touchDirection = "TOUCH_UP";
	} else if (type == "move") {
		touchDirection = "TOUCH_DRAG";
	}

	// @TODO: REWORK THIS!!!
	let classpadState = get(classpad);
	let inputEvent = {
		type: "EVENT_TOUCH",
		// zero: 0, // I think this is always 0? not sure if it's needed
		data: {
			/**
			 * The direction of the touch. One of @c TOUCH_DOWN,
			 * @c TOUCH_HOLD_DRAG, @c TOUCH_ACT_BAR, or @c TOUCH_UP.
			 */
			//  uint32_t direction;
			direction: touchDirection,

			/**
			 * The X position of the cursor, in screen pixels. May be negative
			 * or be greater than or equal to the width of the screen.
			 */
			//  int32_t p1_x;
			p1_x: x,

			/**
			 * The Y position of the cursor, in screen pixels. May be negative
			 * or be greater than or equal to the height of the screen.
			 */
			//  int32_t p1_y;
			p1_y: y,
		}
	}

	// console.log("inputEvent:", inputEvent);
	classpadState.currentInputs.push(inputEvent);
	classpad.set(classpadState);

	// call event handler contained in classpadState.inputCallback
	// e.g. "debugSelect1KeyHandler" may be set, so call it
	if (classpadState.inputCallback) {
		classpadState.inputCallback();
	}
	// clear key state
	classpadState.currentInputs = [];
	classpad.set(classpadState);

}
