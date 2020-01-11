<template>
	<div class="d-inline"> <!--:style="'width: max-content; background: '{{this.color}}"-->
		<img v-bind:style="[this.good ? {'src': '../assets/good.png'} : {'src': '../assets/bad.png'}]"> <!--:src='this.image'-->
	</div>
</template>

<script>
	export default {
		name: "SubjectRating",
		props: ["image", "color", "good"],
		methods: {
			get_url: function () {
				return this.image;
			}
		}
	}
</script>

<style scoped>
	img {
		height: 7vh;
		width: auto;
	}
</style>