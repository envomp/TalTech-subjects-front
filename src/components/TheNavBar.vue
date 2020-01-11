<template>
	<div id="nav">
		<router-link v-show="!this.$store.state.loginSuccess" to="/register">Register</router-link>
		<router-link v-show="!this.$store.state.loginSuccess" to="/login">Login</router-link>
		<router-link v-show="this.$store.state.loginSuccess" to="/">Home</router-link>
		<router-link v-show="this.$store.state.loginSuccess && this.$store.state.isAdmin" to="/admin">Admin</router-link>
		<router-link v-show="this.$store.state.loginSuccess" to="#">
			<span v-on:click="logoutConfirmation">Logout</span>
		</router-link>
	</div>
</template>

<script>
    import BDialog from "buefy/src/components/dialog/Dialog";

    export default {
        name: "TheNavBar",
        components: {BDialog},
        methods: {
            info(item, index, button) {
                this.infoModal.title = `Row index: ${index}`;
                this.infoModal.content = JSON.stringify(item, null, 2);
                this.$root.$emit('bv::show::modal', this.infoModal.id, button)
            },
            logout() {
                this.$root.$emit('bv::show::modal', "logoutModal");
            },
            logoutConfirmation() {
                this.$buefy.dialog.confirm({
                    message: 'Are you sure you want to logout?',
                    onConfirm: () => {
                        this.$buefy.toast.open('User confirmed');
                        this.$store.dispatch("logout");
                        this.$router.push({ path: '/login' });
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
	#nav {
		background-color: var(--text-object);
		overflow: hidden;
		display: flex;
		flex-wrap: nowrap;

		a {
			font-size: 2.5vh;
			font-weight: bold;
			color: var(--background-main);
			float: left;
			padding: 1vh 1vw 1vh 0.5vw;

			&.router-link-exact-active {
				background: var(--object-important);
				color: var(--text-background);
			}
		}
	}
</style>