import {
	myRequest
} from '@/utils/http';

const serverUrl = '/todo/'

/**
 * 获取首页todo列表
 */
export function homeTodoList(top) {
	return myRequest({
		url: serverUrl + "homeTodoList?top=" + top,
		method: 'get',
	})
}

/**
 * 获取todo分页
 */
export function getTodoPage(req) {
	return myRequest({
		url: serverUrl + "getTodoPage",
		method: 'post',
		data: req
	})
}

/**
 * 根据ID获取todo
 */
export function getTodoById(id) {
	return myRequest({
		url: serverUrl + 'getTodoById?id=' + id,
		method: 'get'
	})
}

/**
 * 添加todo
 */
export function addTodo(req) {
	return myRequest({
		url: serverUrl + 'addTodo',
		method: 'post',
		data: req
	})
}

/**
 * 更新todo
 */
export function updateTodo(req) {
	return myRequest({
		url: serverUrl + 'updateTodo',
		method: 'post',
		data: req
	})
}

/**
 * 完成todo
 */
export function completeTodo(id) {
	return myRequest({
		url: serverUrl + 'completeTodo',
		method: 'post',
		data: {
			id
		}
	})
}

/**
 * 删除todo
 */
export function deleteTodo(id) {
	return myRequest({
		url: serverUrl + 'deleteTodo',
		method: 'post',
		data: {
			id
		}
	})
}