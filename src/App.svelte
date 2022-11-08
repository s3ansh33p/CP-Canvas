<script lang="ts">
	import Background from "./lib/Background.svelte";
	import SubPixel from "./lib/SubPixel.svelte";
	import Canvas from "./lib/Canvas.svelte";
	import ClassPad from "./lib/ClassPad.svelte";
	import { doDrawPixels } from "./lib/drawing";
	import TouchTest from "./lib/TouchTest.svelte";
</script>

<main>
	<div class="card">
		<ClassPad>
			<Canvas slot="screen" />
			<!-- <CanvasLoop slot="screen">
				<Background color="hsl(0, 0%, 10%)">
					<SubPixel divisions={30} color="hsla(0, 0%, 100%, 0.5)" />
				</Background>
				<TouchTest />
			</CanvasLoop> -->
		</ClassPad>

		<button on:click={() => doDrawPixels()}>DrawThings</button>
	</div>
</main>

<style>
	button {
		position: fixed;
		top: 2rem;
		left: 6rem;
	}
</style>
