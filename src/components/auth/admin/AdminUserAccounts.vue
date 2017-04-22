<template>
	<div class="admin-user-accounts">
		<div class="container">
			<h1 class="display-4">{{ $t('adminUserAccounts.title') }}</h1>
			<hr>
			<div v-if="!isLoading">
				<div v-if="items.length > 0">
	
					<div class="justify-content-centermy-1 row">
						<b-form-fieldset horizontal label="Rows per page" class="col-6" :label-size="6">
							<b-form-select :options="[{text:10,value:10},{text:20,value:20},{text:50,value:50}]" v-model="perPage">
							</b-form-select>
						</b-form-fieldset>
					</div>
		
					<b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
						<template slot="email" scope="item">
							{{ item.value }}
						</template>
						<template slot="creationDate" scope="item">
							{{ item.value | moment("YYYY-MM-DD, HH:mm:ss") }}
						</template>
						<template slot="deleted" scope="item">
							{{ item.value }}
						</template>
						<template slot="userRole" scope="item">
							<span style="display: none;">{{ item.value }}</span>
							<span class="badge badge-primary" :class="{'translucent': item.value !== 'ADMIN'}">ADMIN</span>
							<span class="badge badge-primary" :class="{'translucent': item.value !== 'USER'}">USER</span>
						</template>
						<template slot="balance" scope="item">
							{{ item.value }}
						</template>
					</b-table>
		
					<div class="justify-content-center row my-1">
						<b-pagination size="md" :total-rows="this.items.length" :per-page="perPage" v-model="currentPage" />
					</div>
	
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import Http from '../../../services/Http';

export default {
	name: 'admin-accounts',
	data: () => {
		return {
			isLoading: false,
			items: [],
			currentPage: 1,
			perPage: 10
		};
	},
	computed: {
		fields: function () {
			// usage of this.$t requires it to be in computed instead of data
			return {
				email: {
					label: this.$t('adminUserAccounts.field.email'),
					sortable: true
				},
				creationDate: {
					label: this.$t('adminUserAccounts.field.creationDate'),
					sortable: true
				},
				deleted: {
					label: this.$t('adminUserAccounts.field.deleted'),
					sortable: true
				},
				userRole: {
					label: this.$t('adminUserAccounts.field.userRole'),
					sortable: true
				},
				balance: {
					label: this.$t('adminUserAccounts.field.balance'),
					sortable: true
				}
			};
		}
	},
	mounted: function () {
		this.updateData();
	},
	methods: {
		details: function (item) {
			alert(JSON.stringify(item));
		},
		updateData: function () {
			this.isLoading = true;

			Http.adminGetUserAccounts()
				.then((response) => {
					this.items = response.body;
					this.isLoading = false;
				}, () => {
					this.isLoading = false;
				});
		}
	},
	i18n: {
		messages: {
			en: {
				adminUserAccounts: {
					title: 'User account overview',
					field: {
						email: 'E-Mail',
						creationDate: 'Creation Date',
						deleted: 'Deleted?',
						userRole: 'User Role',
						balance: 'Balance'
					}
				}
			},
			de: {
				adminUserAccounts: {
					title: 'Benutzerkonten',
					field: {
						email: 'E-Mail',
						creationDate: 'Erstelldatum',
						deleted: 'Gelöscht?',
						userRole: 'Benutzerrolle',
						balance: 'Saldo'
					}
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.badge {
	cursor: pointer;
	&.translucent {
		opacity: 0.2;
	}
}
</style>