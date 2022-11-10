import { getContext, onMount, onDestroy } from "svelte";
import { writable, derived, readable } from "svelte/store";

// TODO: the classpad is responsive, change it to writable
export const width = readable(320);
export const height = readable(528);
export const zoomFactor = readable(1.5);

export const pixelRatio = writable(window.devicePixelRatio);
export const context = writable<CanvasRenderingContext2D>();
export const canvas = writable<HTMLCanvasElement>();
export const time = writable(0);

// classpad is a store that contains the state of the classpad
// contains cpu, lcd, keyboard, etc
export const classpad = writable({
	cpu: {
		r0: 0, r1: 0, r2: 0, r3: 0,
		r4: 0, r5: 0, r6: 0, r7: 0,
		r8: 0, r9: 0, r10: 0, r11: 0,
		r12: 0, r13: 0, r14: 0, r15: 0,
		gbr: 0, pr: 0, ach: 0, acl: 0
	},
	// vram is a 320x528 array of 16-bit colors
	vram: new Uint16Array(320 * 528),
	debug: {
		x: 0,
		y: 0
	}		
});

// A more convenient store for grabbing all game props
export const props = deriveObject({
	context,
	canvas,
	width,
	height,
	pixelRatio,
	time,
});

export const key: Symbol = Symbol();

function deriveObject(obj) {
	const keys = Object.keys(obj);
	const list = keys.map((key) => {
		return obj[key];
	});
	return derived(list, (array) => {
		return array.reduce((dict, value, i) => {
			dict[keys[i]] = value;
			return dict;
		}, {});
	});
}
