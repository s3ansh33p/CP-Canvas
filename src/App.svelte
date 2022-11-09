<script lang="ts">
	import Background from "./lib/Background.svelte";
	import SubPixel from "./lib/SubPixel.svelte";
	import Canvas from "./lib/Canvas.svelte";
	import ClassPad from "./lib/ClassPad.svelte";
	import { clearScreen, Debug_Printf, doDrawPixels, drawAllDebug, exampleDisplay, LCD_ClearScreen, LCD_Refresh } from "./lib/drawing";
	import TouchTest from "./lib/TouchTest.svelte";
	import { onMount } from "svelte";

	onMount(() => {
		clearScreen();
	});
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

		<div class="toolbar">
			<button on:click={() => doDrawPixels()}>DrawThings</button>
			<button on:click={() => clearScreen()}>ClearScreen</button>
			<button on:click={() => Debug_Printf(0, 1, true, "Hello...")}
				>Hello</button
			>
			<button on:click={drawAllDebug}>DrawAllDebug</button>
			<button on:click={exampleDisplay}>ExampleDisplay</button>
			<button on:click={LCD_Refresh}>LCD_Refresh</button>
			<button on:click={LCD_ClearScreen}>LCD_ClearScreen</button>
		</div>
	</div>
</main>

<style>
	.toolbar {
		position: fixed;
		/* top: 2rem; */
		/* left: 6rem; */
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
