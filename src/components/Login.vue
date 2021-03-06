<template>
<div class="login login-registration">
	<div class="compact">
		<div class="form-box bordered-box">
			<div class="main-title display-7">{{ $t('login.title') }}</div>
			<hr>
			<form>
				<b-form-fieldset :label="$t('login.email')">
					<b-form-input v-model="email" type="text"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('login.password')">
					<b-form-input v-model="password" type="password"></b-form-input>
				</b-form-fieldset>
				<b-button @click.prevent="login" :block="true" variant="primary" :disabled="isLoading">{{ $t('login.submit') }}</b-button>
			</form>
			<div class="links-below">
				<router-link :to="{ name: 'password-forgotten' }" class="password-forgotten">{{ $t('login.forgotPassword') }}</router-link>
				<router-link :to="{ name: 'registration' }" class="sign-up">{{ $t('login.signUp') }}</router-link>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import HttpService from '@/services/HttpService';

export default {
	name: 'login',
	data: function () {
		return {
			email: '',
			password: '',
			isLoading: false
		}
	},
	mounted: function () {
		this.$emit('toggle-header', false);
		this.$emit('set-body-background', 'dark');
	},
	beforeDestroy: function () {
		this.$emit('toggle-header', true);
		this.$emit('set-body-background', 'white');
	},
	methods: {
		login: function () {
			if (!this.isLoading) {
				this.isLoading = true;

				const credentials = { email: this.email, password: this.password };
				const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';

				HttpService.login(credentials, true).then((response) => {
					this.$store.dispatch('updateAuth', response.body.token).then(() => {
						this.$store.dispatch('updateUserBalance');
					});
					this.$store.dispatch('updateUser').then(() => {
						this.$toasted.global.successNoIcon('<i class="fa fa-sign-in"></i>' + this.$t('toasts.signedIn'));
						this.isLoading = false;
						if (redirect) {
							this.$router.push({ path: redirect });
						}
					}, () => {
						this.isLoading = false;
						this.$toasted.global.error(this.$t('toasts.internalError'));
						this.$store.dispatch('logout');
					});
				}, (response) => {
					if (response.status === 406) {
						this.$toasted.global.error(this.$t('toasts.userIsDeletedError'));
					} else if (/^4/.test(response.status.toString())) {
						this.$toasted.global.warn(this.$t('toasts.wrongPassword'));
					}
					this.isLoading = false;
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.login {
	.sign-up {
		float: left;
	}
	.password-forgotten {
		float: right;
	}
}
</style>

<i18n>
{
	"en": {
		"login": {
			"title": "Sign In",
			"email": "E-Mail",
			"password": "Password",
			"submit": "Sign in",
			"signUp": "Sign up now!",
			"forgotPassword": "Forgot your password?"
		}
	},
	"de": {
		"login": {
			"title": "Anmelden",
			"email": "E-Mail Adresse",
			"password": "Passwort",
			"submit": "Anmelden",
			"signUp": "Jetzt registrieren!",
			"forgotPassword": "Passwort vergessen?"
		}
	}
}
</i18n>
