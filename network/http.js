import { LOCAL_USER } from '@/utils/global'
import { ROOT, UPLOAD_IMG } from './api'

async function post(url, data, load = true) {
	load && uni.showLoading({
		title: '加载中...'
	})
	const header = {} 
  // header['Content-Type'] = 'application/x-www-form-urlencoded'
	const localUser = uni.getStorageSync(LOCAL_USER)
  if (localUser){
    header['token'] = JSON.parse(localUser).token || ''
  }
	const res = await uni.request({
		method: 'POST',
		header,
		data,
		url: ROOT + url
	})
	.then(checkStatus)
  .then(checkCode)
	
	load && uni.hideLoading()
	
	return res
}
async function get(url, data) {
	uni.showLoading({
		title: '加载中...'
	})
	const header = {}
	// header['Content-Type'] = 'application/x-www-form-urlencoded'
	const localUser = uni.getStorageSync(LOCAL_USER)
	if (localUser){
	  header['token'] = JSON.parse(localUser).token || ''
	}
	const res = await uni.request({
		method: 'GET',
		header,
		data,
		url: ROOT + url
	})
	.then(checkStatus)
	.then(checkCode)
	
	uni.hideLoading()
	
	return res
}
/**
 * @desc  上传文件
 * @param {String} path	文件路径
 * @param {Boolean} load 是否加载动画
 */
async function uploadPic(path, load = true) {
	if (!path) return
	load && uni.showLoading({
		mask: true,
		title: '加载中...'
	})
	const ures = await uni.uploadFile({
		url: UPLOAD_IMG,
		filePath: path,
		header: {
			'Content-Type': 'multipart/form-data'
		},
		name: 'images',
		formData: {
			folder: 1
		}
	})
	.then(checkStatus)
	.then(checkCode)
	
	load && uni.hideLoading()
	
	if (ures) {
		return JSON.parse(ures)
	}
}
/**
 * @desc  下载文件
 * @param {String} path	下载路径
 * @param {Boolean} load 是否加载动画
 */
async function downLoadFile(url, load = true) {
	if (!url) return
	load && uni.showLoading({
		title: '加载中...'
	})
	const dlRes = await uni.downloadFile({ url })
	
	const res = dlRes[1]?.tempFilePath
	load && uni.hideLoading()
	if (res) {
		return res
	}
	uni.showToast({
		title: '文件下载失败',
		icon: 'none'
	})
}

function checkStatus(http) {
  // 处理http状态
  // 正常状态返回数据
	const res = http[1]
  const data = res.data
	let code = res.statusCode
  if (code === 200 || code === 304) {
   
    code = data.code
    if (code === 2) {
      // token失效
      return {
        code,
        message: "登录失效，请重新登录",
        data: null
      }
    }
    return data
  }
  const codeMsg = {
    400: "错误请求",
    401: "服务器未授权的请求",
    403: "服务器拒绝访问",
    404: "无服务器请求",
    405: "服务器未允许的请求方法",
    408: "服务器繁忙",
    500: "服务器错误",
    501: "无网络",
    502: "网络错误",
    503: "服务不可用",
    504: "网络信号弱",
    505: "不支持的请求"
  };
  const message = codeMsg[code] || `连接错误${code}`

  return {
    code,
    message,
    data: null
  }
}

function checkCode(res) {
  const code = res.code;
  const msg = res.message;
  // 统一处理错误信息
  if (code !== 0) {
    if (code === 2) {
			// token失效
			uni.showModal({
				title: "提醒",
				content: `${msg}！`,
				success(mres) {
					if (mres.confirm) {
						// 退出重新登录
						const user = {
						  token: null,
						  userId: "",
						  userName: "未知用户",
						  realName: "未知姓名",
						  avatarImg: ""
						};
						uni.setStorageSync(
						  LOCAL_USER,
						  JSON.stringify(user)
						)
						const pages = getCurrentPages()
						const currentPage = pages[1] || pages[0]
						const redirect = currentPage?.$page?.fullPath
						uni.redirectTo({
							url: `/pages/profile/login?redirect=${redirect}`
						})
					}
				}
			})
    } else {
      uni.showToast({
				title: `${msg}！`,
				icon: 'error',
				duration: 2000
			})
    }
  }
  return res
}

export {
	get, post, uploadPic, downLoadFile
}