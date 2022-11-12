import { get } from "svelte/store";
import { zoomFactor, classpad } from "../specs";

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