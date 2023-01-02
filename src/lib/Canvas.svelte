<script lang="ts">
	import {
		onMount,
		onDestroy,
		setContext,
		createEventDispatcher,
	} from "svelte";
  import { get } from "svelte/store";

	import {
		key,
		width,
		height,
		canvas as canvasStore,
		context as contextStore,
		pixelRatio,
		props,
		time,
		mouseDown,
	} from "../specs";

	import { touchEventToPosition, handleTouch } from "./helpers";

	export let attributes = {};

	const dispatch = createEventDispatcher();

	let listeners = [];
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let frame;

	onMount(() => {
		// prepare canvas stores
		context = canvas.getContext("2d", attributes) as CanvasRenderingContext2D;
		canvasStore.set(canvas);
		contextStore.set(context);
	});

	setContext(key, {
		add(fn) {
			this.remove(fn);
			listeners.push(fn);
		},
		remove(fn) {
			const idx = listeners.indexOf(fn);
			if (idx >= 0) listeners.splice(idx, 1);
		},
	});


	function handleResize() {
		//TODO: calculate pixel ratio
		/*
		let minW = window.innerWidth / $width;
		let minH = window.innerHeight / $height;
		let ratio = Math.floor(Math.min(minW, minH));
		if (ratio > 1) {
			// window.devicePixelRatio
			pixelRatio.set(ratio * window.devicePixelRatio);
		}
		// width.set(window.innerWidth);
		// height.set(window.innerHeight);
        */
	}

	function handleTouchDown(ev) {
		dispatch("touchDown", {
			event: ev,
		});
		// console.log(ev);
		handleTouch(...touchEventToPosition(ev), "down");
		mouseDown.set(true);
	}
	function handleTouchUp(ev) {
		dispatch("touchUp", {
			event: ev,
		});
		handleTouch(...touchEventToPosition(ev), "up");
		mouseDown.set(false);
	}
	function handleTouchMove(ev) {
		dispatch("touchMove", {
			event: ev,
		});
		let pos = touchEventToPosition(ev);
		document.getElementById("db-ms-x").innerHTML = "X: " + Math.ceil(pos[0]).toString();
		document.getElementById("db-ms-y").innerHTML = "Y: " + Math.ceil(pos[1]).toString();
		let isMouseDown = get(mouseDown);
		if (isMouseDown) {
			handleTouch(pos[0], pos[1], "drag");
		}
	}

</script>

<canvas
	bind:this={canvas}
	width={$width}
	height={$height}
	style="width: {$width}px; height: {$height}px;"
	on:mousedown={handleTouchDown}
	on:mouseup={handleTouchUp}
	on:mousemove={handleTouchMove}
/>
<svelte:window on:resize|passive={handleResize} />
<slot />
