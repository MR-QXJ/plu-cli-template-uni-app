
import { downLoadFile } from '@/network/http'
import { LOCAL_USER } from './global'

async function modal(content, options) {
	const conf = await uni.showModal({
		content,
		confirmColor: '#305AF5',
		cancelColor: '#999',
		...options
	})
	return conf[1]?.confirm
}
//图片或文件预览
async function previewFile(path, load) {
	//图片
	if (/\.(png|jpg|gif|jpeg|webp)$/.test(path)) {
		return uni.previewImage({
			urls: [path]
		})
	}
	
	load && uni.showLoading({
		title: '加载中...'
	})
	//文件
	const splitPot = path.split('.')
	const fileType = splitPot[splitPot.length - 1]
	
	const filePath = await downLoadFile(path, false)
	uni.openDocument({
		filePath,
		fileType,
		fail(err) {
			console.log(err);
			uni.showToast({
				title: '文件打开失败',
				icon: 'none'
			})
		},
		complete() {
			load && uni.hideLoading()
		}
	})
}
/**
 * @desc 修改本地缓存中用户数据对象的指定字段值
 * @param {Object} key 要修改的键
 * @param {Object} value 修改后的值
 */
function changeLocalUser (key, value) {
	let userMsg = JSON.parse(uni.getStorageSync(LOCAL_USER) || '{}') 
	uni.setStorageSync(LOCAL_USER, JSON.stringify(userMsg, (k, val)=>{
		if (k === key) return value
		return val
	}))
}
/**
 * @desc  选择图片方式自定义弹出表
 */
async function choosePermitImg() {
	let res
	const choose = await uni.showActionSheet({
		itemList: ['从相册中选择', '拍照'],
		itemColor: "#366FFF"
	})
	const tapIndex = choose[1]?.tapIndex
	const itemMap = {
		0: 'album',
		1: 'camera'
	}
	const sourceType = itemMap[tapIndex]
	if (sourceType) {
		res = await chooseImgShop([sourceType])
	}
	return res
}
/**
 * @desc  选择图片
 * @param {Array[string]} sourceType 选择图片的方式: album-从相册中选择、camera-手机拍照 默认都有,多个会弹出选择列表
 */
async function chooseImgShop (sourceType) {
	const cres = await uni.chooseImage({
		count: 1,
		sizeType: ['original', 'compressed'],
		sourceType
	})
	return cres[1]?.tempFiles
}
//小程序更新机制
function updateProcess() {
	const updateManager = uni.getUpdateManager()
	updateManager.onUpdateReady(function () {
	  uni.showModal({
	    title: '更新提示',
	    content: '发现新功能，立即体验？',
	    success({confirm}) {
	      if (confirm) {
	        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
	        updateManager.applyUpdate()
	      }
	    }
	  })
	})
	updateManager.onUpdateFailed(function () {
	  // 新版本下载失败
		uni.showModal({
		  title: '已经有新版本咯~',
		  content: '请您删除当前小程序，重新搜索打开呦~'
		})
	})
}

export {
	modal, previewFile, changeLocalUser, choosePermitImg, chooseImgShop, updateProcess
}
