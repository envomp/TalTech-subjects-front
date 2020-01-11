<template>
	<div id="app">

		<the-nav-bar></the-nav-bar>
		<br><br><br><br>

		<router-view></router-view>

	</div>
</template>

<script>
	import TheNavBar from "./components/TheNavBar";

	export default {
		name: 'app',
		components: {TheNavBar},
	}
</script>

<style lang="scss">
	:root {
		background-image: url('./assets/back2.jpg');
		--background-main: #2d2d2e;
		--background-object: #474b4f;
		--background-details: #6b6e70;
		--object-general: #59595a;
		--object-important: #49494b;
		--object-unimportant: rgba(48, 48, 49, 0.66);
		--text-background: #b6b6b7; //#ffffff;
		--text-object: #b6b6b7;
		--text-secondary: grey;
	}

	.row {

	}

	body {
		background-image: url("./assets/back2.jpg");
		background-color: #cccccc;
	}


	.pagination > li > a {
		background-color: white;
		color: #59595a;
	}

	a,
	.pagination > li > a:focus,
	.pagination > li > a:hover,
	.pagination > li > span:focus,
	.pagination > li > span:hover {
		color: #5a5a5a;
		background-color: #eee;
		border-color: #ddd;
	}

	.pagination > .active > a {
		color: white;
		background-color: #59595a;
		border: solid 1px #49494b;
	}

	.pagination > .active > a:hover,
	.pagination {
		background-color: #59595a;
		border: solid 1px #2d2d2e;
	}


	html {
		background: var(--background-main);
	}

	h1 {
		color: var(--text-background)
	}

	h2 {
		color: var(--text-background)
	}

	h3 {
		color: var(--text-background)
	}

	h4 {
		color: var(--text-background)
	}

	table {
		color: var(--text-background)
	}


	button {
		background: var(--object-general);
		border: 0;
		color: var(--text-object);
	}

	button:hover {
		background: var(--object-important);
		color: var(--text-background);
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: var(--text-background);
	}
</style>

