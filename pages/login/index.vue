<template>
	<up-toast ref="uToast"></up-toast>
	<up-loading-page loadingText="请稍等" :loading="loading"></up-loading-page>

	<view class="welcome-container">
		<text class="title">欢迎使用Todo</text>
		<text class="register-link" @click="register()">没有账号？注册</text>
	</view>

	<view class="form">
		<text class="form-text">用户邮箱</text>
		<input class="input" placeholder="请输入用户邮箱" border="none" v-model="email" />
		<text class="form-text password-label">密码</text>
		<input class="input" placeholder="请输入密码" border="surround" v-model="password" password="true" />

		<view class="submit-container">
			<up-button class="button" text="登录" size="normal" @click="submit()" color="#6C8FF8"></up-button>
		</view>
	</view>
</template>

<script>
	import {
		login
	} from '/api/auth.js';
	import {
		setToken
	} from '/utils/storageUtil.js';
	import {
		transPsw
	} from '/utils/passwordUtil.js';

	export default {
		data() {
			return {
				email: '',
				password: '',
				loading: false
			};
		},
		methods: {
			showError(message) {
				this.$refs.uToast.error(message);
			},
			submit() {
				let {
					email,
					password
				} = this;
				if (!email) return this.showError('请输入用户邮箱');
				if (!password) return this.showError('请输入密码');
				password = transPsw(password)
				this.loading = true;
				login({
						email,
						password
					})
					.then((res) => {
						this.loading = false;
						if (res.code === 2001) {
							setToken(res.data.token);
							this.$refs.uToast.success('登录成功');
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/todo/index'
								});
							}, 1000);
						} else {
							this.showError(res.message);
						}
					})
					.catch((err) => {
						this.loading = false;
						this.showError(err.message || '登录失败');
					});
			},
			register() {
				uni.navigateTo({
					url: '/pages/login/emailRegister/emailRegister'
				});
			},
			resetPassword() {
				this.$refs.uToast.warning('暂未开放，请联系管理员');
			},
			sms() {
				this.$refs.uToast.warning('暂未开放');
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		background-color: #ffffff;
		width: 100%;
		height: 100%;
	}

	.welcome-container {
		text-align: center;
		margin-top: 35%;
	}

	.title {
		font-size: 36px;
		display: block;
	}

	.register-link {
		font-size: 20px;
		color: #687582;
		margin-top: 10px;
		display: block;
	}

	.form {
		margin-top: 20%;
		width: 85%;
		margin-left: auto;
		margin-right: auto;
	}

	.form-text {
		display: inline-block;
		font-size: 16px;
	}

	.password-label {
		margin-top: 30px;
	}

	.input {
		margin-top: 10px;
		height: 60px;
		box-shadow: 0px 0px 20px 15px rgba(0, 0, 0, 0.03);
		border-radius: 15px;
		padding-left: 15px;
	}

	.submit-container {
		margin-top: 15%;
	}

	.button {
		margin-top: 10px;
		margin-bottom: 5px;
		border-radius: 12px;
		height: 60px;
	}
</style>