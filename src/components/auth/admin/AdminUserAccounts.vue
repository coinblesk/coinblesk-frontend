<template>
	<div class="admin-user-accounts">
		<div class="compact">
			<h1 class="display-4">{{ $t('adminUserAccounts.title') }}</h1>
			<hr>
			<div class="pos-rel">
				<spinner :is-loading="isLoading"></spinner>
			
				<div v-if="!isLoading">
					<div v-if="items.length > 0">
						
						<div class="table-wrapper">
							<b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
								<template slot="email" scope="item">
									{{ item.value }}
								</template>
								<template slot="creationDate" scope="item">
									{{ item.value | moment(dateFormat) }}
								</template>
								<template slot="activated" scope="item">
									<span v-if="item.item.unregistered">
										<i class="fa fa-minus"></i>
									</span>
									<span v-else v-html="item.value ? $t('adminUserAccounts.yes') : $t('adminUserAccounts.no')"></span>
								</template>
								<template slot="deleted" scope="item">
									<span v-html="item.value ? $t('adminUserAccounts.yes') : $t('adminUserAccounts.no')"></span>
								</template>
								<template slot="unregistered" scope="item">
									<span v-html="item.value ? $t('adminUserAccounts.yes') : $t('adminUserAccounts.no')"></span>
								</template>
								<template slot="userRole" scope="item">
									<span class="badge badge-primary">{{ item.value ? item.value.replace(/^ROLE_/, '') : null }}</span>
								</template>
								<template slot="balance" scope="item">
									{{ item.value }}
								</template>
								<template slot="details" scope="item">
									<b-button size="sm" :to="{ name: 'admin-user-accounts-detail', params: { email: item.item.email } }">
										{{ $t('adminUserAccounts.detailsButton') }}
									</b-button>
								</template>
							</b-table>
						</div>
			
						<div class="justify-content-center row" v-show="perPage < this.items.length">
							<b-pagination size="md" :total-rows="this.items.length" :per-page="perPage" v-model="currentPage" />
						</div>
		
						<div class="rows-per-page">
							<b-form-fieldset>
								<label>{{ $t('general.rowsPerPage') }}</label>
								<b-form-select size="sm" :options="[{text:10,value:10},{text:20,value:20},{text:50,value:50}]" v-model="perPage"></b-form-select>
							</b-form-fieldset>
						</div>
						
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';
import Spinner from '@/components/Spinner';

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
	components: {
		Spinner
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
				unregistered: {
					label: this.$t('adminUserAccounts.field.unregistered'),
					sortable: true
				},
				activated: {
					label: this.$t('adminUserAccounts.field.activated'),
					sortable: true
				},
				userRole: {
					label: this.$t('adminUserAccounts.field.userRole'),
					sortable: true
				},
				balance: {
					label: this.$t('adminUserAccounts.field.balance'),
					sortable: true
				},
				details: {
					label: this.$t('adminUserAccounts.field.details'),
					sortable: false
				}
			};
		},
		dateFormat: function () {
			return UtilService.DATE_FORMAT;
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

			HttpService.Auth.Admin.getUserAccounts()
				.then((response) => {
					this.items = response.body;
					this.isLoading = false;
				}, () => {
					this.isLoading = false;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.table-wrapper {
	max-width: 100%;
	width: 100%;
	overflow-x: auto;
	@include light-scrollbar();
	margin-bottom: 20px;
	
	/deep/ table {
		min-width: 1150px;
		margin-bottom: 5px;
		thead th {
			border-top: 0;
		}
	}
}
.rows-per-page {
	margin-top: 25px;
	text-align: center;
}
</style>

<i18n>
{
	"en": {
		"adminUserAccounts": {
			"title": "User accounts",
			"detailsButton": "Details",
			"yes": "Yes",
			"no": "No",
			"field": {
				"email": "E-Mail",
				"creationDate": "Creation Date",
				"deleted": "Deleted?",
				"unregistered": "Unregistered?",
				"activated": "Activated?",
				"userRole": "User Role",
				"balance": "Balance",
				"details": "Details"
			}
		}
	},
	"de": {
		"adminUserAccounts": {
			"title": "Benutzerkonten",
			"detailsButton": "Details",
			"yes": "Ja",
			"no": "Nein",
			"field": {
				"email": "E-Mail",
				"creationDate": "Erstelldatum",
				"deleted": "Gelöscht?",
				"unregistered": "Nicht registriert?",
				"activated": "Aktiviert?",
				"userRole": "Benutzerrolle",
				"balance": "Saldo",
				"details": "Details"
			}
		}
	}
}
</i18n>
