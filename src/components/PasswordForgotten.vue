<template>
<div class="password-forgotten login-registration">
	<div class="container">
		<div class="col-md-4 offset-md-4">
			<img class="logo" src="../assets/about_cb_2.png">
		</div>
		<div class="form-box bordered-box col-md-4 offset-md-4">
			<div class="main-title display-7">{{ $t('passwordForgotten.title') }}</div>
			<hr>
			<form>
				<b-form-fieldset :label="$t('passwordForgotten.email')">
					<b-form-input v-model="email" type="email" :class="{ 'form-error': !validEmail && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-button @click.prevent="submit" :block="true" variant="primary" :disabled="isLoading">{{ $t('passwordForgotten.submit') }}</b-button>
			</form>
		</div>
	</div>
</div>
</template>

<script>
import Router from '@/config/Router';
import Http from '@/services/Http';
import Util from '@/services/Util';

export default {
	name: 'password-forgotten',
	data () {
		return {
			isLoading: false,
			email: '',
			formIsTouched: false
		}
	},
	computed: {
		validEmail: function () {
			return Util.EMAIL_REGEX.test(this.email);
		},
		validForm: function () {
			if (!this.formIsTouched) {
				return true;
			}
			return this.validEmail;
		}
	},
	mounted: function () {
		this.$emit('toggle-header', false);
		this.$emit('set-body-background', 'dark');
	},
	beforeDestory: function () {
		this.$emit('toggle-header', true);
		this.$emit('set-body-background', 'white');
	},
	methods: {
		submit: function () {
			this.formIsTouched = true;

			if (this.validForm) {
				this.isLoading = true;

				Http.forgotPassword(this.email, true).then(() => {
					this.$toasted.global.success(this.$t('passwordForgotten.success'), { duration: 6000 });
					this.isLoading = false;
					Router.push({ name: 'home' });
				}, (response) => {
					// 406 = user is deleted
					if (response.status === 406) {
						this.$toasted.global.error(this.$t('toasts.userIsDeletedError'));
					} else {
						this.$toasted.global.warn(this.$t('passwordForgotten.invalidEmail'));
					}
					this.isLoading = false;
				});
			} else {
				this.$toasted.global.warn(this.$t('toasts.validationError'))
			}
		}
	},
	i18n: {
		messages: {
			en: {
				passwordForgotten: {
					title: 'Password Forgotten',
					email: 'E-Mail Address',
					submit: 'Submit',
					success: 'You should receive now an e-mail with a link. Please open this link to reset your password.',
					invalidEmail: 'The provided e-mail address could not be found in the system.'
				}
			},
			de: {
				passwordForgotten: {
					title: 'Passwort vergessen',
					email: 'E-Mail Adresse',
					submit: 'Abschicken',
					success: 'Sie werden jetzt ein E-Mail mit einem Link erhalten. Bitte folgen Sie diesem Link, um Ihr Passwort zurückzusetzen.',
					invalidEmail: 'Die angegebene E-Mail Adresse konnte nicht gefunden werden.'
				}
			}
		}
	}
};
</script>