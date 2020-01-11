<template>
	<b-button
					@click="toggleSubscription"
					@mouseover="hovered = true"
					@mouseleave="hovered = false"
					class="sub-button"
					:class="this.subStatus ? 'subbed' : 'nosub'"
	>
		{{ currentMessage }}
	</b-button>
</template>

<script>
	import api from "./backend-api";

	export default {
		name: "TheSubscriptionButton",
		props: ["subStatus", "subjectId"],
		data() {
			return {
				hovered: false
			}
		},
		computed: {
			currentMessage() {
				if (this.hovered) {
					return this.hoverMessage;
				} else {
					return this.defaultMessage;
				}
			},
			hoverMessage() {
				return this.subStatus ? "Unsubscribe" : "Subscribe";
			},
			defaultMessage() {
				return this.subStatus ? "Subscribed" : "Not subscribed";
			}
		},
		methods: {
			toggleSubscription() {
				if (this.subStatus) {
					api.removeUserSubscription(this.$store.state.userId, this.$store.state.token, this.subjectId);
				} else {
					api.addUserSubscription(this.$store.state.userId, this.$store.state.token, this.subjectId);
				}
				this.$emit("sub-toggle", this.subjectId);
			}
		}
	}
</script>

<style scoped>
	.sub-button {
		height: 100%;
		width: 100%
	}

	.subbed, .nosub:hover{
		background-color: #338530
	}

	.nosub, .subbed:hover {
		background-color: #852830
	}
</style>