<template>
	<div class="d-block" v-bind:style="[this.rating==='POSITIVE' ? {'background': 'green'} : {'background': 'red'}]">
		<p>
			{{this.text}}
		</p>
		<p class="time">
			{{this.time}}
		</p>
	</div>
</template>

<script>
	export default {
		name: "SubjectReview",
		props: ["text", "time", "rating"]
	}
</script>

<style scoped>
	.time {
		color: var(--text-secondary);
		opacity: 75%;
	}

	.d-block {
		width: max-content;
		padding: 5px;
		margin: 5px;
	}
</style>