<script lang="ts">
	import { renderable, width, height, props } from "../specs";

	let x = 0;
	let y = 0;

	let touch = null;
	let pointer;
	let touchDown = false;

	renderable((props, dt) => {
		const { context, width, height } = props;
		let position = [x, y];

		if (touchDown) {
			console.log(touch);
			context.save();
			let r = 28;
			let g = 142;
			let b = 226;
			context.fillStyle = `rgb(${r}, ${g}, ${b})`;
			context.fillRect(x, y, 2, 2);

			context.restore();
		}
	});

	function handleTouchMove({ clientX, clientY }) {
		touch = [clientX, clientY];
	}

	function handleTouchDown(ev) {
		console.log(ev);
		handleTouchMove(ev);
		touchDown = true;
	}

	function handleTouchUp(ev) {
		console.log(ev);
		handleTouchMove(ev);
		touchDown = false;
	}
</script>

<!-- How to easily get the touch ! -->
<!-- <svelte:window
	on:mousedown={handleTouchDown}
	on:mouseup={handleTouchUp}
	on:mousemove={handleTouchMove}
/> -->

<!-- The following allows this component to nest children -->
<slot />
