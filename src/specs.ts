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
	cpu: { // might be useful to have a cpu store by itself
		r0: 0, r1: 0, r2: 0, r3: 0,
		r4: 0, r5: 0, r6: 0, r7: 0,
		r8: 0, r9: 0, r10: 0, r11: 0,
		r12: 0, r13: 0, r14: 0, r15: 0,
		gbr: 0, pr: 0, ach: 0, acl: 0
	},
	debug: {
		x: 0,
		y: 0,
	},
	debugMenu: {
		isThreeBitColour : false,
	},
	waitingForKeypress: false,		
	waitingForAnyInput: false,
	currentInputs: [], // array of InputEvents,
	inputCallback: null // String of the callback function
});

// VRAM Dedicated Store
// vram is a 320x528 array of 16-bit colors
export const vram = writable(new Uint16Array(320 * 528));
// VRAM Backup Store
export const vramBackup = writable(new Uint16Array(320 * 528));

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

// mouse state
export const mouseDown = writable(false);

export const getState = () => {
	const api = getContext(key);
	return api.getState();
};

export type RenderElement = {
	ready: boolean;
	mounted: boolean;
	render?: Function;
	setup?: Function;
};

export const renderable = (render) => {
	const api = getContext(key);
	const element: RenderElement = {
		ready: false,
		mounted: false,
	};
	if (typeof render === "function") element.render = render;
	else if (render) {
		if (render.render) element.render = render.render;
		if (render.setup) element.setup = render.setup;
	}
	api.add(element);
	onMount(() => {
		element.mounted = true;
		return () => {
			api.remove(element);
			element.mounted = false;
		};
	});
};

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
