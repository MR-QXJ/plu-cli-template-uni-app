<template>
	<view class="uchart">
		  <qiun-data-charts
				:chartData="chartData"
				:type="type"
		  />
	</view>
</template>

<script>
	export default {
		props: {
			chartData: {
				type: Object,
				required: true
			},
			type: {
				type: String,
				default: 'bar'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uchart {
		width: 100%;
		height: 500rpx;
	}
</style>
