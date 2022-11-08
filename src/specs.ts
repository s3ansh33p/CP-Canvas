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
