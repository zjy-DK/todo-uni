<template>
	<up-toast ref="uToast" />
	<up-loading-page loadingText="请稍等" :loading="loading" />

	<up-navbar bgColor="#F5F6F8" @leftClick="returnHome" />

	<!-- 用户资料 -->
	<view class="section section-top">
		<up-cell title="资料" isLink @click="updateUser()" />
		<up-cell title="用户名称" :value="user.userName" />
		<up-cell title="用户性别" :value="user.sex === 'man' ? '男' : '女'" />
		<up-cell title="手机号" :value="user.phoneNumber" />
	</view>

	<!-- 账号信息 -->
	<view class="section">
		<up-cell title="账号" />
		<up-cell title="注册邮箱" :value="user.email" />
		<up-cell title="注册日期" :value="user.createTime" />
		<up-cell title="最后登录IP" :value="user.loginIp" />
		<up-cell title="最后登录时间" :value="user.loginDate" />
	</view>

	<!-- 系统 -->
	<view class="section">
		<up-cell title="系统" />
		<up-cell title="设置" isLink @click="setting()" />
		<up-cell title="关于" isLink @click="about()" />
	</view>

	<!-- 账号操作 -->
	<view class="section">
		<up-cell title="账号操作" />
		<up-cell title="修改密码" isLink @click="updatePassword()" />
		<up-cell title="退出登录" isLink @click="logoutUser()" />
	</view>
</template>

<script>
	import {
		getLoginUserInfo,
		logout
	} from "/api/auth";
	import {
		removeToken
	} from "/utils/storageUtil.js";

	export default {
		data() {
			return {
				user: {},
				loading: false,
			};
		},
		onLoad() {
			this.showLoading();
			this.getUserInfo();
		},
		mounted() {
			uni.$once("refreshUserIndex", () => {
				this.getUserInfo();
			});
		},
		methods: {
			showLoading() {
				this.loading = true;
			},
			hideLoading() {
				this.loading = false;
			},
			showError(message) {
				this.$refs.uToast.error(message);
			},
			showSuccess(message) {
				this.$refs.uToast.success(message);
			},
			getUserInfo() {
				getLoginUserInfo()
					.then((res) => {
						this.hideLoading();
						if (res.code === 2001) {
							this.user = res.data;
						} else {
							this.showError(res.message);
						}
					})
					.catch((err) => {
						this.hideLoading();
						this.showError(err.message || "获取用户信息失败");
					});
			},
			logoutUser() {
				this.showLoading();
				logout()
					.then((res) => {
						this.hideLoading();
						if (res.code === 2001) {
							removeToken();
							this.showSuccess("退出成功");
							setTimeout(() => {
								uni.reLaunch({
									url: "/pages/login/index"
								});
							}, 1000);
						} else {
							this.showError(res.message);
						}
					})
					.catch((err) => {
						this.hideLoading();
						this.showError(err.message || "退出失败");
					});
			},
			updatePassword() {
				uni.navigateTo({
					url: `/pages/user/updatePassword/updatePassword?id=${this.user.id}`,
				});
			},
			about() {
				uni.navigateTo({
					url: "/pages/user/about/about"
				});
			},
			setting() {
				uni.navigateTo({
					url: "/pages/user/setting/setting"
				});
			},
			updateUser() {
				uni.navigateTo({
					url: `/pages/user/updateUser/updateUser?id=${this.user.id}`,
				});
			},
			returnHome() {
				uni.navigateTo({
					url: "/pages/todo/index"
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.section {
		margin: auto;
		background-color: #ffffff;
		width: 95%;
		border-radius: 15px;
		margin-bottom: 10px;
	}

	.section-top {
		margin-top: 80px;
	}
</style>