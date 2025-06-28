import {
	myRequest
} from '/utils/http';

const serverUrl = '/auth/'

/**
 * 获取用户邮箱注册码
 */
export function emailRegistrationCode(req) {
	return myRequest({
		url: serverUrl + "emailRegistrationCode",
		method: 'post',
		data: req
	})
}

/**
 * 邮箱注册
 */
export function emailRegister(req) {
	return myRequest({
		url: serverUrl + "emailRegister",
		method: 'post',
		data: req
	})
}

/**
 * 用户登录
 */
export function login(req) {
	return myRequest({
		url: serverUrl + "login",
		method: 'post',
		data: req
	})
}

/**
 * 用户登出
 */
export function logout() {
	return myRequest({
		url: serverUrl + 'logout',
		method: 'get'
	})
}

/**
 * 获取登录用户信息
 */
export function getLoginUserInfo() {
	return myRequest({
		url: serverUrl + 'getLoginUserInfo',
		method: 'get'
	})
}