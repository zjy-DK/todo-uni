import {
	myRequest
} from '/utils/http';

const serverUrl = '/slowRequestLog/'

/**
 * 分页获取慢请求日志
 */
export function page(req) {
	return myRequest({
		url: serverUrl + "page",
		method: 'post',
		data: req
	})
}

/**
 * 获取慢请求日志详情
 */
export function getById(id) {
	return myRequest({
		url: serverUrl + 'getById?id=' + id,
		method: 'get'
	})
}

/**
 * 获取未读慢请求日志
 */
export function unreadLog() {
	return myRequest({
		url: serverUrl + 'unreadLog',
		method: 'get'
	})
}