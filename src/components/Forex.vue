<template>
<div class="forex">
	<div class="container">
		<h1 class="display-4">{{ $t('forex.title') }}</h1>
		<hr>
		<div v-if="!isLoading">
			<div class="currency-selector">
				<label>{{ $t('forex.selectCurrency') }}: </label>
				<b-form-select v-model="selectedCurrency" :options="['USD', 'EUR', 'CHF', 'JPY', 'CNY']" class="md-3"></b-form-select>
			</div>
			<div  v-if="current.rate">
				<h2 class="display-7">{{ $t('forex.subtitleCurrent') }}</h2>
				<p class="display-3 price">
					<span class="value">1 BTC = {{ formatCurrency(current.rate) }} {{ current.currencyTo }}</span>
					<span class="date">
						<span class="intro">{{ $t('forex.lastUpdated') }}: </span>
						{{ current.updatedAt | moment(dateFormat) }}
					</span>
				</p>
			</div>
			<div class="alert alert-warning" v-else>{{ $t('forex.errorCurrent') }}</div>
			<hr>
			<div v-if="history.length > 0">
				<h2 class="display-7">{{ $t('forex.subtitleHistory') }}</h2>
				<div class="chart-container" data-tz2u8w97hwptfwl3y57ywguux></div>
			</div>
			<div class="alert alert-warning" v-else>{{ $t('forex.errorHistory') }}</div>
		</div>
	</div>
</div>
</template>

<script>
import Http from '../services/Http';
import Util from '../services/Util';
import Chartist from '../config/Chartist';
import moment from 'moment';

export default {
	name: 'forex',
	data: function () {
		return {
			isLoading: false,
			selectedCurrency: 'USD',
			current: {},
			history: [],
			chart: null
		}
	},
	computed: {
		dateFormat: function () {
			return Util.DATE_FORMAT;
		}
	},
	methods: {
		loadData: function () {
			this.isLoading = true;

			Promise.all([
				Http.getForexCurrent(this.selectedCurrency),
				Http.getForexHistory(this.selectedCurrency)
			]).then((responses) => {
				this.current = responses[0].body;
				this.history = responses[1].body;
				this.mountChart();
				this.isLoading = false;
			}, () => {
				this.current = {};
				this.history = [];
				this.isLoading = false;
			});
		},
		formatCurrency: Util.formatCurrency,
		mountChart: function () {
			const chartData = [];
			for (let i = 0; i < this.history.length; i++) {
				chartData.push({
					x: moment(this.history[i].updatedAt).toDate(),
					y: this.history[i].rate
				});
			}
			window.setTimeout(() => {
				this.chart = Chartist.Line('.chart-container[data-tz2u8w97hwptfwl3y57ywguux]', {
					labels: chartData,
					series: [ {
						name: 'rates',
						data: chartData
					} ]
				}, {
					height: '350px',
					showArea: true,
					axisX: {
						type: Chartist.FixedScaleAxis,
						divisor: 10,
						labelInterpolationFnc: (value) => {
							return moment(value).format('MMM D');
						}
					}
				});
			}, 100);
		}
	},
	watch: {
		selectedCurrency: function () {
			this.loadData();
		}
	},
	mounted: function () {
		this.loadData();
	},
	i18n: {
		messages: {
			en: {
				forex: {
					title: 'Market trend',
					subtitleCurrent: 'Current market price',
					subtitleHistory: 'Trend over the last 30 days',
					lastUpdated: 'Last updated',
					errorCurrent: 'The current market price could not be loaded.',
					errorHistory: 'The trend over the last 30 days could not be loaded.',
					selectCurrency: 'Select currency'
				}
			},
			de: {
				forex: {
					title: 'Kursentwicklung',
					subtitleCurrent: 'Aktueller Kurs',
					subtitleHistory: 'Kursentwicklung der letzten 30 Tage',
					lastUpdated: 'Letztes Update',
					errorCurrent: 'Der aktuelle Kurs konnte nicht geladen werden.',
					errorHistory: 'Die Kursentwicklung der letzten 30 Tage konnte nicht geladen werden',
					selectCurrency: 'Währung wählen'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.price {
	display: inline-block;
	padding: 0.3em 0.7em;
	border-left: 5px solid grey;
	font-size: 56px;
	margin: 0.3em 1em;
	
	.date {
		font-size: 16px;
		display: block;
		margin-top: 10px;
		.intro {
			font-weight: 500;
		}
	}
}
.currency-selector {
	float: right;
	select {
		margin-left: 10px;
	}
}
.chart-container {
	padding: 30px 20px;
}

@media screen and (max-width: 1000px) {
	.price {
		font-size: 24px;
		.date {
			font-size: 14px;
		}
	}
}
</style>

<style lang="scss">
.chart-container[data-tz2u8w97hwptfwl3y57ywguux] .ct-series-a {
	$color: #1aa22f;
	
	.ct-line,
	.ct-point {
		stroke: $color;
	}
	.ct-area {
		fill: $color;
	}
}
</style>