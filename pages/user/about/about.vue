<template>
	<up-navbar leftIcon="arrow-leftward" leftText="关于" bgColor="#f4f6f8" autoBack />

	<!-- logo -->
	<view class="logo-container">
		<up-avatar class="avatar" src="/static/todo.png" size="120" />
		<text class="sub-title">版本信息：v1.0.0</text>
	</view>

	<view class="cell">
		<up-cell class="cellTitle" title="技术栈" />
		<up-cell title="uni-app" value="4.44.2024123110" />
		<up-cell title="Vue" value="3" />
		<up-cell title="uview-plus" value="3.3.61" />
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {},
	};
</script>

<style lang="scss" scoped>
	.logo-container {
		text-align: center;
		margin-top: 20%;
	}

	.avatar {
		margin: auto;
		margin-bottom: 20px;
	}

	.sub-title {
		font-size: 14px;
		color: #687582;
		display: inline-block;
		margin-bottom: 20px;
	}

	.cell {
		margin: auto;
		background-color: #ffffff;
		width: 95%;
		border-radius: 15px;
		margin-bottom: 10px;
	}

	.cellTitle {
		font-weight: 900;
	}
</style>