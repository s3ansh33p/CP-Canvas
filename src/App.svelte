<script lang="ts">
	import Canvas from "./lib/Canvas.svelte";
	import ClassPad from "./lib/ClassPad.svelte";
	import { clearScreen, Debug_Printf, doDrawPixels, drawAllDebug, exampleDisplay, LCD_ClearScreen, LCD_Refresh, Debug_SelectMode1 } from "./lib/drawing";
	import { keyEventHandler } from "./lib/helpers";
	import { onMount } from "svelte";
  	import { WinMain } from "./lib/ui/basic";
	import { test_custom_fonts, test_virtual_keyboard } from "./lib/textures/test";

	onMount(() => {
		clearScreen();
	});

	function handleKey(ev) {
		// console.log("Key event:", ev.key);
		// keyEventHandler(ev.key);
		// translate the key to KEY_*
		let key = null;
		// check 0-9
		if (ev.key >= '0' && ev.key <= '9') {
			key = "KEYCODE_" + ev.key;
		}
		// Arrow keys
		if (ev.key.startsWith("Arrow")) {
			key = "KEYCODE_" + ev.key.substring(5).toUpperCase();
		}
		// check for other keys
		switch (ev.key) {
			case "Enter":
				key = "KEYCODE_EXE";
				break;
			case "Backspace":
				key = "KEYCODE_BACKSPACE";
				break;
			case "x":
				key = "KEYCODE_X";
				break;
			case "y":
				key = "KEYCODE_Y";
				break;
			case "z":
				key = "KEYCODE_Z";
				break;
			case "+":
				key = "KEYCODE_PLUS";
				break;
			case "-":
				key = "KEYCODE_MINUS";
				break;
			case "*":
				key = "KEYCODE_TIMES";
				break;
			case "/":
				key = "KEYCODE_DIVIDE";
				break;
			case ",":
				key = "KEYCODE_COMMA";
				break;
			case ".":
				key = "KEYCODE_DOT";
				break;
			case "(":
				key = "KEYCODE_OPEN_PARENTHESIS";
				break;
			case ")":
				key = "KEYCODE_CLOSE_PARENTHESIS";
				break;
			case "^":
				key = "KEYCODE_POWER";
				break;
			case "=":
				key = "KEYCODE_EQUALS";
				break;
				// wasd
			case "w":
				key = "KEYCODE_UP";
				break;
			case "a":
				key = "KEYCODE_LEFT";
				break;
			case "s":
				key = "KEYCODE_DOWN";
				break;
			case "d":
				key = "KEYCODE_RIGHT";
				break;
		}
		if (key == null) return;
		keyEventHandler(key);
	}
</script>
<svelte:window on:keydown={handleKey} />
<main>
	<div class="card">
		<ClassPad>
			<Canvas slot="screen" />
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
			<button on:click={Debug_SelectMode1}>Debug_SelectMode1</button>
			<button on:click={WinMain}>Test_UI</button>
			<button on:click={test_custom_fonts}>Test Custom Fonts</button>
			<button on:click={test_virtual_keyboard}>Test Virtual Keyboard</button>
		</div>

		<div class="debug">
			<pre>
				<span id="db-ms-x"></span>
				<span id="db-ms-y"></span>
			</pre>
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
	.debug {
		position: fixed;
		top: 0;
		right: 0;
	}
</style>
