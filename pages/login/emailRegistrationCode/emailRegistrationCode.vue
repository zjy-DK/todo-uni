<template>
	<up-toast ref="uToast" />
	<up-loading-page loadingText="请稍等" :loading="loading" />

	<up-navbar :autoBack="true" bgColor="#F5F6F8" />

	<view class="title-container">
		<text class="title">请输入四位验证码</text>
		<text class="sub-title">验证码已发送到邮箱{{ email }}</text>
	</view>

	<view class="form">
		<up-code-input class="horizontally-centered" v-model="code" mode="line" size="60" maxlength="4" fontSize="24"
			space="30" />
		<view class="submit-wrapper">
			<up-button text="注册" size="normal" @click="submit()" color="#6C8FF8" class="button" />
		</view>
	</view>
</template>

<script>
	import {
		emailRegister
	} from "/api/auth.js";
	import {
		setToken
	} from "/utils/storageUtil.js";

	export default {
		onLoad(option) {
			this.email = option.email;
		},
		data() {
			return {
				email: "",
				code: "",
				loading: false,
			};
		},
		methods: {
			showError(message) {
				this.$refs.uToast.error(message);
			},
			submit() {
				if (!this.code) {
					this.showError("请输入验证码");
					return;
				}

				this.loading = true;
				emailRegister({
						email: this.email,
						code: this.code
					})
					.then((res) => {
						this.loading = false;
						if (res.code === 2001) {
							setToken(res.data.token);
							this.$refs.uToast.success("注册成功");
							setTimeout(() => {
								uni.navigateTo({
									url: "/pages/todo/index"
								});
							}, 1000);
						} else {
							this.showError(res.message);
						}
					})
					.catch((err) => {
						this.loading = false;
						this.showError(err.message || "注册失败");
					});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		background-color: #ffffff;
		width: 100%;
		height: 100%;
	}

	.title-container {
		text-align: center;
		margin-top: 35%;
	}

	.title {
		font-size: 32px;
		display: block;
	}

	.sub-title {
		font-size: 14px;
		color: #687582;
		margin-top: 10px;
		display: block;
	}

	.form {
		margin-top: 10%;
		width: 85%;
		margin-left: auto;
		margin-right: auto;
	}

	.horizontally-centered {
		display: flex;
		justify-content: center;
	}

	.submit-wrapper {
		margin-top: 15%;
	}

	.button {
		margin-top: 10px;
		margin-bottom: 5px;
		border-radius: 12px;
		height: 60px;
	}
</style>