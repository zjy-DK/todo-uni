import {
	myRequest
} from '/utils/http';

const serverUrl = '/user/'

/**
 * 修改用户信息
 */
export function updateUser(req) {
	return myRequest({
		url: serverUrl + "updateUser",
		method: 'post',
		data: req
	})
}

/**
 * 修改密码
 */
export function updatePassword(req) {
	return myRequest({
		url: serverUrl + "updatePassword",
		method: 'post',
		data: req
	})
}