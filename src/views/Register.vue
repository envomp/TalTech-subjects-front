<template>
	<div class="container">
		<div class="row mt-5">
			<div class="col-sm-8 offset-sm-2">

				<div class="unprotected mb-5">
					<h1>
						<b-badge v-if="!registerError" variant="dark">Register as an user</b-badge>
						<b-badge v-else variant="danger">User with same username already exists</b-badge>
					</h1>
				</div>

				<form @submit.prevent="handleSubmit">

					<div class="form-group">
						<label for="username">Username</label>
						<input :class="{ 'is-invalid': submitted && $v.user.username.$error }"
									 class="form-control"
									 id="username"
									 name="username"
									 v-model="user.username"
						>
						<div class="invalid-feedback" v-if="submitted && $v.user.username.$error">
							<span v-if="!$v.user.username.required">Username is required</span>
							<span v-if="!$v.user.username.minLength">Username must be at least 6 characters</span>
						</div>
					</div>

					<div class="form-group">
						<label for="password">Password</label>
						<input :class="{ 'is-invalid': submitted && $v.user.password.$error }"
									 class="form-control"
									 id="password"
									 name="password"
									 type="password"
									 v-model="user.password"
						>
						<div class="invalid-feedback" v-if="submitted && $v.user.password.$error">
							<span v-if="!$v.user.password.required">Password is required</span>
							<span v-if="!$v.user.password.minLength">Password must be at least 8 characters</span>
						</div>
					</div>

					<div class="form-group">
						<label for="confirmPassword">Confirm Password</label>
						<input :class="{ 'is-invalid': submitted && $v.user.confirmPassword.$error }"
									 class="form-control"
									 id="confirmPassword"
									 name="confirmPassword"
									 type="password"
									 v-model="user.confirmPassword"
						>
						<div class="invalid-feedback" v-if="submitted && $v.user.confirmPassword.$error">
							<span v-if="!$v.user.confirmPassword.required">Confirm Password is required</span>
							<span v-else-if="!$v.user.confirmPassword.sameAsPassword">Passwords must match</span>
						</div>
					</div>

					<h1>
						<b-btn type="submit" class="w-50">Register</b-btn>
					</h1>

				</form>

				<div class="mt-5">
					<p>Already have an account?</p>
					<router-link tag="b-btn" to="/login">Login</router-link>
				</div>

			</div>
		</div>
	</div>

</template>

<script>
	import {minLength, required, sameAs} from "vuelidate/lib/validators";
	import api from "../components/backend-api";

	export default {
		name: "app",
		data() {
			return {
				user: {
					username: "",
					password: "",
					confirmPassword: ""
				},
				registerError: false,
				submitted: false
			};
		},
		validations: {
			user: {
				username: {required, minLength: minLength(6)},
				password: {required, minLength: minLength(8)},
				confirmPassword: {required, sameAsPassword: sameAs('password')}
			}
		},
		methods: {
			handleSubmit(e) {
				this.submitted = true;

				// stop here if form is invalid
				this.$v.$touch();
				if (this.$v.$invalid) {
					return;
				}

				api.createUser(this.user.username, this.user.password).then(response => {
							console.log('Created new User with Id ' + response.data);
							this.$router.push('/home')
						})
						.catch(e => {
							this.registerError = true;
						})
			}
		}
	};
</script>
