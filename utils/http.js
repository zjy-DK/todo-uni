import {
	getAesKey,
	aesEncrypt,
	aesDecrypt
} from "./encrypt/AESUtils.js";
import {
	rsaEncrypt,
	getRsaKeys
} from "./encrypt/RSAUtils.js";
import {
	getToken
} from '/utils/storageUtil.js';


let baseURL = '';
// 是否在控制台显示接口请求日志,本地环境启用,打包环境禁用
let showHttpLog = false;
// 测试环境
// baseURL = 'http://10.10.2.115:9917';
// 正式环境
baseURL = 'http://127.0.0.1:9917';

//请求是否加密s
var isEncrypt = false;

//加密aesKey
var aesKey = "";

/**
 * 加密请求数据
 */
function encryptData(options) {
	if (!isEncrypt) {
		return;
	}
	//获取 aesKey
	aesKey = getAesKey(16);
	//RSA 加密AES密钥
	let encryptAesKey = rsaEncrypt(aesKey);
	//添加加密请求头
	options.aksEncrypt = isEncrypt;
	options.aesKey = encryptAesKey;

	//AES加密param数据并替换原始数据
	let param = options.url.split("?")[1];
	if (param !== undefined && param !== "") {
		//加密可能出现+等特殊符号，这里用encodeURIComponent解决
		let encryptParam = encodeURIComponent(aesEncrypt(aesKey, param));
		options.url =
			options.url.replace(/\?.*$/, "") + "?" + "encryptParam=" + encryptParam;
	}
	//AES加密body数据并替换原始数据
	if (options.data !== undefined && options.data !== null) {
		let dataJson = JSON.stringify(options.data);
		let encryptDataJson = aesEncrypt(aesKey, dataJson);
		options.data = encryptDataJson;
	}
}

/**
 * 解密响应数据
 */
function decryptData(res) {
	if (!isEncrypt) {
		return;
	}
	res.data = JSON.parse(aesDecrypt(aesKey, res.data));
	aesKey = "";
}

export const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		//加密请求数据
		encryptData(options)
		uni.request({
			url: baseURL + options.url, //接口地址：前缀+方法中传入的地址
			method: options.method || 'GET', //请求方法：传入的方法或者默认是“GET”
			data: options.data || {}, //传递参数：传入的参数或者默认传递空集合
			//自定义请求头信息
			header: {
				'authorization': getToken(),
				'aksEncrypt': options.aksEncrypt,
				'aesKey': options.aesKey
			},
			success: (res) => {
				if (res.statusCode === 200) {
					//解密响应数据
					decryptData(res)
					resolve(res.data)
				} else if (res.statusCode === 401) {
					//跳转登录页
					uni.reLaunch({
						url: '/pages/login/index'
					})
				} else {
					reject('请求失败，请重试')
				}

			},
			// 这里的接口请求，如果出现问题就输出接口请求失败
			fail: (err) => {
				console.log('err')
				reject(err)
			}
		})
	})
}