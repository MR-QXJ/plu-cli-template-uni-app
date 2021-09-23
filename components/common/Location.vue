<template>
	<view class="location">
		<u-button @click="locationAut">获取定位</u-button>
		<view>
			{{ location }}
		</view>
	</view>
</template>

<script>
	import { modal } from '@/utils/utils'
	export default {
		data() {
			return {
				location: null
			}
		},
		methods: {
			getLocationInfo(alertCallback) {
				const _this = this
				uni.getLocation({
					geocode: true,
					success(l) {
						console.log(l)
						_this.location = l
					},
					async fail(err) {
						console.log(err)
						const confirm = await modal('定位失败，请同意授权并保持GPS信号畅通')
						confirm && alertCallback && alertCallback()
					}
				})
			},
			async locationAut() {
				const _this = this

				//#ifdef APP-PLUS
				const sys = uni.getSystemInfoSync()
				if (sys.platform === 'android') {
					const context = plus.android.importClass('android.content.Context')
					const locationManager = plus.android.importClass('android.location.LocationManager')
					const main = plus.android.runtimeMainActivity()
					const mainSvr = main.getSystemService(context.LOCATION_SERVICE)
					const GPS = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)
					const Intent = plus.android.importClass('android.content.Intent')
					const Settings = plus.android.importClass('android.provider.Settings')
					const intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
					if (!GPS) {
						const confirm = await modal('请打开定位服务功能', {
							showCancel: false
						})
						confirm && main.startActivity(intent) //打开手机定位设置
						return 
					}
					this.getLocationInfo(() => main.startActivity(intent))

				} else if (sys.platform === 'ios') {
					var cllocationManger = plus.ios.import("CLLocationManager");
					var enable = cllocationManger.locationServicesEnabled();
					var status = cllocationManger.authorizationStatus();
					plus.ios.deleteObject(cllocationManger);
					if (enable && status != 2) {
						console.log("手机系统的定位已经打开");
						this.getLocationInfo()
					} else {
						const confirm = await modal('请打开定位服务功能', {
							showCancel: false
						})
						if (confirm) {
							//ios打开设置：
							plus.runtime.openURL("app-settings://");
							// var UIApplication = plus.ios.import("UIApplication");
							// var application2 = UIApplication.sharedApplication();
							// var NSURL2 = plus.ios.import("NSURL");
							// // var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");
							// // var setting2 = NSURL2.URLWithString("App-Prefs:root=LOCATION_SERVICES");
							// // var setting2 = NSURL2.URLWithString("app-settings");
							// var setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION");
							// // var setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION_SERVICES");
							// application2.openURL(setting2);
							// plus.ios.deleteObject(setting2);
							// plus.ios.deleteObject(NSURL2);
							// plus.ios.deleteObject(application2);
						}
					}
				}
				//#endif

				//#ifdef MP-WEIXIN
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						_this.getLocationInfo()
					},
					async fail() {
						const confirm = await modal('需要获取您的地理位置，请确认授权')
						if (confirm) {
							uni.openSetting({
								success(set) {
									console.log(set.authSetting['scope.userLocation'])
									if (set.authSetting['scope.userLocation']) {
										_this.getLocationInfo()
									}
								}
							})
						}
					}
				})
				//#endif	

			}
		},
	}
</script>

<style lang="scss" scoped>
.location {
	
}
</style>
