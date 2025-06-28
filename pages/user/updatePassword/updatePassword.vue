<template>
	<up-toast ref="uToast" />
	<up-loading-page loadingText="请稍等" :loading="loading" />

	<up-navbar :autoBack="true" bgColor="#F5F6F8" />

	<view class="card card-top">
		<view class="form">
			<up-form labelPosition="top" :model="req" ref="formRef" labelWidth="auto">
				<up-form-item label="旧密码" prop="req.oldPassword" borderBottom ref="oldPassItem">
					<up-input v-model="req.oldPassword" type="password" border="surround" placeholder="请输入旧密码"
						style="background-color: #f4f6f8" />
				</up-form-item>

				<up-form-item label="新密码" prop="req.newPassword" borderBottom ref="newPassItem">
					<up-input v-model="req.newPassword" type="password" border="surround" placeholder="请输入新密码"
						style="background-color: #f4f6f8" />
				</up-form-item>

				<up-form-item label="再次确认新密码" prop="req.newPassword1" borderBottom ref="confirmPassItem">
					<up-input v-model="req.newPassword1" type="password" border="surround" placeholder="请输入新密码"
						style="background-color: #f4f6f8" />
				</up-form-item>
			</up-form>

			<view class="submit-container">
				<up-button color="#1296DB" text="确定" customStyle="margin-top: 20px" @click="submit" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		updatePassword
	} from "/api/user";
	import {
		transPsw,
		isValidPassword
	} from '/utils/passwordUtil.js';

	export default {
		data() {
			return {
				loading: false,
				req: {
					id: "",
					oldPassword: "",
					newPassword: "",
					newPassword1: "",
				},
			};
		},
		onLoad(option) {
			this.req.id = option.id;
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
			submit() {
				if (!isValidPassword(this.req.newPassword)) {
					this.showError("密码强度不达标！需包含大小写字母，数字和特殊符号，长度8-20位。");
					return;
				}
				if (this.req.newPassword !== this.req.newPassword1) {
					this.showError("前后两次新密码不一致，请重新输入");
					return;
				}
				this.req.oldPassword = transPsw(this.req.oldPassword)
				this.req.newPassword = transPsw(this.req.newPassword)

				this.showLoading();
				updatePassword(this.req)
					.then((res) => {
						if (res.code === 2001) {
							this.showSuccess(res.message);
							setTimeout(() => {
								uni.reLaunch({
									url: "/pages/login/index"
								});
							}, 500);
						} else {
							this.showError(res.message);
						}
						this.hideLoading();
					})
					.catch((err) => {
						this.hideLoading();
						this.showError(err.message || "修改失败");
					});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.card {
		margin: auto;
		background-color: #ffffff;
		width: 95%;
		border-radius: 15px;
	}

	.card-top {
		margin-top: 80px;
	}

	.form {
		margin: auto;
		width: 95%;
	}

	.submit-container {
		margin-bottom: 10px;
		height: 50px;
	}
</style>