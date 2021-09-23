<script>
	//#ifndef H5 || APP-PLUS
	import { updateProcess } from '@/utils/utils'
	//#endif
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			//小程序更新
			//#ifndef H5 || APP-PLUS
			updateProcess()
			//#endif
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*公共样式 */
	@import "uview-ui/index.scss";
	* {
	  // box-sizing: border-box;
	  margin: 0;
	  padding: 0;
	}
	page {
		width: 100%;
		height: 100%;
		view {
			// color: #333;
		}
		>view {
			overflow-x: hidden;
			width: 100%;
			background-color: #f6f6f6;
			box-sizing: border-box;
		}
	}
	.inps {
		color: #A3A3A3;
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
</style>
