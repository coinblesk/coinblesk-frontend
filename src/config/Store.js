import Vue from 'vue';
import Vuex from 'vuex';
import PersistedState from 'vuex-persistedstate'
import HttpService from '@/services/HttpService';
import Translation from '@/config/Translation';
import Router from '@/config/Router';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		language: null,
		user: null,
		userBalance: null,
		auth: {
			token: null,
			authenticated: false,
			role: null
		},
		offline: !(typeof window.navigator.onLine === 'undefined' ||
				window.navigator.onLine === null ||
				window.navigator.onLine)
	},

	// should be private:
	mutations: {
		updateUser: function (state, user) {
			user.lastUpdate = new Date();
			state.user = user;
		},
		clearUser: function (state) {
			state.user = null;
		},
		updateUserBalance: function (state, userBalance) {
			userBalance.lastUpdate = new Date();
			state.userBalance = userBalance;
		},
		clearUserBalance: function (state) {
			state.userBalance = null;
		},

		updateLanguage: function (state, language) {
			state.language = language;
		},
		updateAuth: function (state, token) {
			state.auth.authenticated = true;
			state.auth.token = token;
			state.auth.role = (() => {
				const base64Payload = token.split('.')[1];
				const payload = JSON.parse(window.atob(base64Payload));
				return payload.auth;
			})();
		},
		clearAuth: function (state) {
			state.auth.authenticated = false;
			state.auth.token = null;
			state.auth.role = null;
		},
		setOffline: function (state, offline) {
			state.offline = offline;
		}
	},

	// should be public:
	actions: {
		initialize: function (context) {
			if (!context.state.offline) {
				if (context.state.auth.authenticated) {
					return context.dispatch('updateUser').then(() => {
						return context.dispatch('updateUserBalance');
					});
				} else {
					context.commit('clearUser');
					context.commit('clearUserBalance');
					return Promise.resolve();
				}
			}
		},

		updateUser: function (context) {
			if (context.state.auth.authenticated) {
				return HttpService.Auth.getUser(true)
					.then((response) => {
						context.commit('updateUser', response.body);
						return Promise.resolve();
					}, response => {
						if (response.status !== 0) {
							context.dispatch('logout');
							Vue.toasted.global.warnNoIcon('<i class="fa fa-sign-out"></i>' + Translation.t('toasts.sessionExpired'));
							Router.push({ path: '/login' });

							return Promise.reject();
						} else {
							// offline mode -> do not update
							return Promise.reject();
						}
					});
			} else {
				context.commit('clearUser');
				return Promise.reject();
			}
		},

		updateUserBalance: function (context) {
			if (context.state.auth.authenticated && context.state.auth.role === 'ROLE_USER') {
				return HttpService.Auth.User.getUserBalance(true, false)
					.then((response) => {
						context.commit('updateUserBalance', response.body);
					}, response => {
						if (response.status !== 0) {
							context.dispatch('logout');
							Vue.toasted.global.warnNoIcon('<i class="fa fa-sign-out"></i>' + Translation.t('toasts.sessionExpired'));
							Router.push({ path: '/login' });

							return Promise.reject();
						} else {
							// offline mode -> do not update
							return Promise.reject();
						}
					});
			} else {
				context.commit('clearUserBalance');
				return Promise.reject();
			}
		},

		updateLanguage: function (context, language) {
			return context.commit('updateLanguage', language);
		},
		updateAuth: function (context, token) {
			if (typeof token !== 'undefined' && token !== null && token !== '') {
				return context.commit('updateAuth', token);
			} else {
				return context.commit('clearAuth');
			}
		},
		setOffline: function (context, offline) {
			context.commit('setOffline', !!offline);
		},
		logout: function (context) {
			context.commit('clearUserBalance');
			context.commit('clearUser');
			context.commit('clearAuth');
		}
	},
	plugins: [
		// persists vuex state to localstorage (only the given paths)
		PersistedState({
			key: 'coinblesk_vuex_store',
			paths: [ 'auth', 'user', 'language', 'userBalance' ]
		})
	]
});

export default store;
