import { get } from "svelte/store";
import { zoomFactor } from "../specs";

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
