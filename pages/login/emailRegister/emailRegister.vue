<template>
  <up-toast ref="uToast" />
  <up-loading-page loadingText="请稍等" :loading="loading" />

  <up-navbar :autoBack="true" bgColor="#F5F6F8"></up-navbar>

  <view class="title-container">
    <text class="title-text">用户注册</text>
  </view>

  <view class="form">
    <input
      v-model="email"
      placeholder="请输入用户邮箱"
      border="none"
      class="input"
    />
    <view class="submit-wrapper">
      <up-button
        text="发送验证码"
        size="normal"
        @click="submit()"
        color="#6C8FF8"
        class="button"
      />
    </view>
  </view>
</template>
<script>
import { emailRegistrationCode } from "/api/auth.js";

export default {
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  methods: {
    showError(message) {
      this.$refs.uToast.error(message);
    },
    submit() {
      if (!this.email) {
        this.showError("请输入用户邮箱");
        return;
      }

      this.loading = true;
      emailRegistrationCode({ email: this.email })
        .then((res) => {
          this.loading = false;
          if (res.code === 2001) {
            this.$refs.uToast.success("发送成功");
            setTimeout(() => {
              uni.navigateTo({
                url: `/pages/login/emailRegistrationCode/emailRegistrationCode?email=${this.email}`,
              });
            }, 1000);
          } else {
            this.showError(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.showError(err.message || "验证码发送失败");
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

.title-text {
  font-size: 36px;
}

.form {
  margin-top: 20%;
  width: 85%;
  margin-left: auto;
  margin-right: auto;
}

.input {
  margin-top: 10px;
  height: 60px;
  box-shadow: 0px 0px 20px 15px rgba(0, 0, 0, 0.03);
  border-radius: 15px;
  padding-left: 15px;
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
