//代办提醒
const TodoRemind = "todo-remind";
//认证token
const TokenKey = "authorized-token";

//保存token
export function setToken(value) {
	uni.setStorageSync(TokenKey, value);
};

/**
 * 获取token
 */
export function getToken() {
	return uni.getStorageSync(TokenKey);
};

/**
 * 删除token
 */
export function removeToken() {
	uni.removeStorageSync(TokenKey);
};

//设置todo提醒
export function setTodoRemind(value) {
	uni.setStorageSync(TodoRemind, value);
};

/**
 * 获取todo提醒
 */
export function getTodoRemind() {
	let value = uni.getStorageSync(TodoRemind);
	if (value == null || value === undefined || value === "") {
		value = true
		setTodoRemind(value)
	}
	return value
};