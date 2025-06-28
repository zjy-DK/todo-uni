import md5 from 'js-md5';

/**
 * 密码加盐后MD5
 * @param {HTMLElement} elm
 *
 */
export function transPsw(val) {
	return md5(val + 'boot')
}


/**
 * 检查密码是否包含大写、小写、数字和特殊符号，且长度在8~20之间
 *
 * @param {string} password - 密码字符串
 * @returns {boolean} 是否有效
 */
export function isValidPassword(password) {
	if (typeof password !== 'string' || password.length === 0) {
		return false;
	}

	// 正则说明：
	// (?=.*[A-Z])       至少一个大写字母
	// (?=.*[a-z])       至少一个小写字母
	// (?=.*\d)          至少一个数字
	// (?=.*[!@#$%^&*])  至少一个特殊符号（可根据需要扩展）
	// [!@#$%^&*]      匹配字母、数字、下划线和指定特殊字符（可根据需要调整）
	// {8,20}            长度为8到20个字符
	const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,20}$/;

	return regex.test(password);
}