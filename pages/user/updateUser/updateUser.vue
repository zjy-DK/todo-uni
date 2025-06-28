<template>
  <up-toast ref="uToast" />
  <up-loading-page loadingText="请稍等" :loading="loading" />

  <up-navbar :autoBack="true" bgColor="#F5F6F8" />

  <view class="card card-top">
    <view class="form">
      <up-form
        labelPosition="top"
        :model="userInfo"
        ref="formRef"
        labelWidth="auto"
      >
        <up-form-item
          label="用户名称"
          prop="userInfo.userName"
          borderBottom
          ref="userNameItem"
        >
          <up-input
            style="background-color: #f4f6f8"
            v-model="userInfo.userName"
            border="surround"
            placeholder="请输入用户名称"
          />
        </up-form-item>

        <up-form-item
          label="性别"
          prop="userInfo.sex"
          borderBottom
          ref="sexItem"
        >
          <up-radio-group v-model="userInfo.sex">
            <up-radio label="男" name="man" />
            <up-radio label="女" name="woman" />
          </up-radio-group>
        </up-form-item>

        <up-form-item
          label="手机号"
          prop="userInfo.phoneNumber"
          borderBottom
          ref="phoneItem"
        >
          <up-input
            style="background-color: #f4f6f8"
            v-model="userInfo.phoneNumber"
            border="surround"
            placeholder="请输入手机号"
          />
        </up-form-item>
      </up-form>

      <view class="submit-container">
        <up-button
          color="#1296DB"
          text="确定"
          customStyle="margin-top: 20px"
          @click="submit"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { getLoginUserInfo } from "/api/auth";
import { updateUser } from "/api/user";

export default {
  data() {
    return {
      loading: false,
      userId: null,
      userInfo: {},
    };
  },
  onLoad(option) {
    this.userId = option.id;
    this.showLoading();
    getLoginUserInfo()
      .then((res) => {
        this.hideLoading();
        if (res.code === 2001) {
          this.userInfo = res.data;
        } else {
          this.showError(res.message);
        }
      })
      .catch((err) => {
        this.hideLoading();
        this.showError(err.message || "获取用户信息失败");
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
    submit() {
      this.showLoading();
      this.userInfo.id = this.userId;

      updateUser(this.userInfo)
        .then((res) => {
          if (res.code === 2001) {
            this.showSuccess(res.message);
            uni.$emit("refreshUserIndex");
            setTimeout(() => {
              uni.navigateTo({ url: "/pages/user/index" });
            }, 500);
          } else {
            this.showError(res.message);
          }
        })
        .catch((err) => {
          this.hideLoading();
          this.showError(err.message || "更新失败");
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
