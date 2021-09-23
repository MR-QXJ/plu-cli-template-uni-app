import { post, downLoadFile, uploadPic } from '@/network/http'
import { LOGIN } from '@/network/api'

//点击登录
async function login () {
	const providerOauth = await uni.getProvider({service: 'oauth'})
	const provider = providerOauth[1]?.provider[0]
	
	//#ifdef MP-WEIXIN
	const profile = await uni.getUserProfile({
		desc: "获取您的用户信息以供xxx"
	})
	//#endif
	
	//#ifndef H5 || MP-WEIXIN
	const profile = await uni.getUserInfo({
		provider
	})
	//#endif
	
	const userInfo = profile[1]?.userInfo
	if (!userInfo) return  //放弃授权
	
	uni.showLoading({
		mask: true,
		title: '加载中...'
	})
	const resCode = await uni.login({
		provider
	})
	const code = resCode[1]?.code
	
	//下载临时头像
	const dl = await downLoadFile(userInfo.avatarUrl, false)
	
	//上传头像
	const ul = await uploadPic(dl, false)
	if (!ul) return
	
	const avatar = ul.data.list[0].id
	const nickname = userInfo.nickName
	
	//调登录接口
	const loginRes = await post(LOGIN, { code, avatar, nickname }, false)
	
	uni.hideLoading()
	//登录成功
	return loginRes
}

export {
	login
}