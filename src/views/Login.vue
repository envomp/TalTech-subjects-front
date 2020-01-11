<template>
	<div class="container">
		<div class="row mt-5">
			<div class="col-sm-8 offset-sm-2">

				<div class="unprotected mb-5">
					<h1>
						<b-badge v-if="!loginError" variant="dark">Please log in</b-badge>
						<b-badge v-else variant="danger">Wrong username and/or password</b-badge>
					</h1>
				</div>

				<div class="form-group">
					<form @submit.prevent="callLogin()">

						<div class="form-group">
							<label for="username">Username</label>
							<input class="form-control" id="username" name="username" type="text"
										 v-model="user">
						</div>

						<div class="form-group">
							<label for="password">Password</label>
							<input class="form-control" id="password" name="password" type="password"
										 v-model="password">
						</div>

						<div class="unprotected">
							<h1>
								<b-btn type="submit" class="w-50">Login</b-btn>
							</h1>
						</div>

					</form>
				</div>

				<div class="mt-5">
					<p>No account? Go and make one!</p>
					<router-link tag="b-btn" to="/register">Register</router-link>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'login',

		data() {
			return {
				loginError: false,
				user: '',
				password: '',
				error: false,
				errors: []
			}
		},
		methods: {
			callLogin() {
				this.errors = [];
				this.$store.dispatch("login", {user: this.user, password: this.password})
						.then(() => {
							this.$router.push('/home');
						})
						.catch(error => {
							this.loginError = true;
							this.errors.push(error);
							this.error = true
						})
			}
		}
	}
</script>
