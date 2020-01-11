<template>
	<button :class="classes" @click="click(data)" title="Update">
        <span>
            <i aria-hidden="true" class="fa fa-eye"></i>
        </span>
		&nbsp;
		{{ name }}
	</button>
</template>

<script>
	export default {
		props: {
			data: {},
			name: {},
			click: () => {
			},
			meta: {},
			classes: {},
		}
	}
</script>

<style scoped>
	button {
		border-radius: 0;
		background: var(--object-important);
	}
</style>
