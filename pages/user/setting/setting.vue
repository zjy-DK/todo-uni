<template>
	<up-navbar leftIcon="arrow-leftward" leftText="设置" bgColor="#f4f6f8" autoBack />

	<view class="section section-top">
		<up-cell class="section-title" title="铃声提示" />
		<up-cell title="todo" label="完成todo时发出提示">
			<template #value>
				<up-switch v-model="todoRemind" size="18" @change="changeTodo" />
			</template>
		</up-cell>
	</view>
</template>

<script>
	import {
		setTodoRemind,
		getTodoRemind
	} from "/utils/storageUtil.js";

	export default {
		data() {
			return {
				todoRemind: true, // 是否开启 todo 完成提醒
			};
		},
		onLoad() {
			this.todoRemind = getTodoRemind();
		},
		methods: {
			changeTodo(e) {
				setTodoRemind(e);
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
		margin-top: 20%;
	}

	.section-title {
		font-weight: 900;
	}
</style>