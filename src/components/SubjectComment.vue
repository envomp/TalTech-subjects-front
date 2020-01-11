<template>
	<div class="d-block">
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
		name: "SubjectComment",
		props: ["text", "time"]
	}
</script>

<style scoped>
	.time {
		color: var(--text-secondary);
		opacity: 75%;
	}

	.d-block {
		width: max-content;
		padding: 2px;
	}
</style>