import {
	myRequest
} from '/utils/http';

const serverUrl = '/exception/'

/**
 * 获取异常日志分页
 */
export function getPage(req) {
	return myRequest({
		url: serverUrl + "getPage",
		method: 'post',
		data: req
	})
}

/**
 * 获取异常详情
 */
export function getById(id) {
	return myRequest({
		url: serverUrl + 'getById?id=' + id,
		method: 'get'
	})
}

/**
 * 获取未读异常日志
 */
export function unreadExceptionLog() {
	return myRequest({
		url: serverUrl + 'unreadExceptionLog',
		method: 'get'
	})
}