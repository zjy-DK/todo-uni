<template>
  <up-toast ref="uToast"></up-toast>
  <up-loading-page loadingText="请稍等" :loading="loading"></up-loading-page>

  <view class="whole">
    <view class="head">
      <up-row justify="space-between" customStyle="margin-top: 44px;">
        <up-col span="2" style="display: flex">
          <up-icon
            style="margin-left: 5px"
            name="grid"
            size="28"
            @click="clickSetting"
          ></up-icon>
        </up-col>
        <up-col span="3" style="display: flex">
          <up-icon
            style="margin-right: 20px; margin-left: 20px"
            name="checkmark"
            size="28"
            @click="clickShowComplete"
          ></up-icon>
          <up-icon name="list" size="28" @click="clickShowSort"></up-icon>
        </up-col>
      </up-row>
      <up-search
        class="head-search"
        style="margin: 0 auto"
        placeholder="搜索"
        bgColor="#ffffff"
        v-model="search"
        @search="clickSearch"
        @clear="clearSearch"
        :show-action="false"
      ></up-search>
    </view>
    <view v-if="!isSearch">
      <!--置顶-->
      <view v-if="topTodoList.length !== 0" class="cell">
        <up-cell-group>
          <up-cell class="cell-title">
            <template #title>
              <view class="cell-view">
                <up-icon
                  name="pushpin-fill"
                  size="24"
                  color="#1296DB"
                ></up-icon>
                <text class="cell-view-text">已置顶</text>
              </view>
            </template>
          </up-cell>
          <up-cell v-for="item in topTodoList">
            <template #title>
              <view class="cell-view">
                <up-checkbox-group
                  v-model="item.check"
                  placement="column"
                  @change="complete(item)"
                >
                  <up-checkbox
                    :customStyle="{ marginBottom: '8px' }"
                    :label="item.title"
                    :inactiveColor="item.inactiveColor"
                  >
                  </up-checkbox>
                </up-checkbox-group>
              </view>
            </template>
            <template #value>
              <up-icon
                name="list"
                size="16"
                color="black"
                @click="details(item)"
              ></up-icon>
            </template>
          </up-cell>
        </up-cell-group>
      </view>

      <!--代办-->
      <view class="cell">
        <up-cell-group>
          <up-cell v-for="item in todoList">
            <template #title>
              <view class="cell-view">
                <up-checkbox-group
                  v-model="item.check"
                  placement="column"
                  @change="complete(item)"
                >
                  <up-checkbox
                    :customStyle="{ marginBottom: '8px' }"
                    :label="item.title"
                    :inactiveColor="item.inactiveColor"
                  >
                  </up-checkbox>
                </up-checkbox-group>
              </view>
            </template>
            <template #value>
              <up-icon
                name="list"
                size="16"
                color="black"
                @click="details(item)"
              ></up-icon>
            </template>
          </up-cell>
        </up-cell-group>
      </view>

      <!--已完成-->
      <view v-if="isShowComplete">
        <view class="cell">
          <up-cell-group>
            <up-cell class="cell-title">
              <template #title>
                <view class="cell-view">
                  <up-icon name="checkmark" size="24" color="#bfbfbf"></up-icon>
                  <text class="cell-view-text">已完成</text>
                </view>
              </template>
            </up-cell>
            <up-cell v-for="item in completeTodoList">
              <template #title>
                <view class="cell-view">
                  <up-checkbox-group
                    v-model="checkboxValue1"
                    placement="column"
                    @change="checkboxChange"
                  >
                    <up-checkbox
                      :customStyle="{ marginBottom: '8px' }"
                      :label="item.title"
                      disabled="true"
                    >
                    </up-checkbox>
                  </up-checkbox-group>
                </view>
              </template>
              <template #value>
                <up-icon
                  name="list"
                  size="16"
                  color="black"
                  @click="details(item)"
                ></up-icon>
              </template>
            </up-cell>
          </up-cell-group>
        </view>
        <up-text
          style="margin: 0 auto; width: 60px; padding-bottom: 10px"
          type="info"
          text="查看更多"
          @click="more()"
        ></up-text>
      </view>
    </view>

    <!--搜索结果-->
    <view v-if="isSearch">
      <!--有数据情况-->
      <view v-if="searchTodoList.length !== 0" class="cell">
        <up-cell-group>
          <up-cell class="cell-title">
            <template #title>
              <view class="cell-view">
                <up-icon name="search" size="24"></up-icon>
                <text class="cell-view-text">搜索结果</text>
              </view>
            </template>
          </up-cell>
          <up-cell v-for="item in searchTodoList" :title="item.title">
            <template #value>
              <up-icon
                name="list"
                size="16"
                color="black"
                @click="details(item)"
              ></up-icon>
            </template>
          </up-cell>
        </up-cell-group>
      </view>
      <!--无数据情况-->
      <up-empty
        :show="searchTodoList.length === 0"
        mode="list"
        icon="/static/null_list.png"
        text="未查询到相关数据"
        marginTop="200"
        width="80"
        height="80"
      ></up-empty>
    </view>
  </view>

  <!--排序菜单-->
  <up-action-sheet
    :show="showSort"
    @close="showSort = false"
    :actions="sortActions"
    cancelText="取消"
    round="15"
    title="排序"
    @select="sortSelect"
  >
  </up-action-sheet>

  <!--右下方新增按钮-->
  <uni-fab
    :pattern="pattern"
    horizontal="right"
    vertical="bottom"
    popMenu="flase"
    @fabClick="clickAdd()"
  ></uni-fab>

  <!--新增和编辑弹框-->
  <up-popup
    mode="bottom"
    :show="showTodoPopup"
    round="10"
    @close="closeTodoPopup"
  >
    <view class="add-popup-form">
      <up-input
        class="input-title"
        v-model="todo.title"
        border="none"
        placeholder="请输入标题"
      ></up-input>
      <scroll-view class="text_field_outer" scroll-y>
        <textarea
          class="textarea-desc"
          v-model="todo.remark"
          auto-height="true"
          placeholder="描述"
          placeholder-style="color:#C0C4CC;margin-left:5px;"
          maxlength="2000"
        ></textarea>
      </scroll-view>
    </view>
    <view class="add-popup-tag">
      <up-icon
        class="icon-tag"
        name="tags-fill"
        :color="priorityColor"
        size="24"
        @click="showPriority = true"
      ></up-icon>
      <up-icon
        class="icon-pin"
        name="pushpin-fill"
        :color="pushpinColor"
        size="24"
        @click="editPushpin"
      ></up-icon>
      <view class="action-buttons">
        <up-icon
          v-if="todo.id !== undefined"
          class="icon-trash"
          name="trash"
          color="red"
          size="24"
          @click="showDel = true"
        ></up-icon>
        <up-button
          class="btn-submit"
          text="确定"
          size="small"
          @click="submit()"
          color="#1296DB"
        ></up-button>
      </view>
    </view>
  </up-popup>

  <!--优先级菜单-->
  <up-action-sheet
    :show="showPriority"
    @close="showPriority = false"
    :actions="priorityActions"
    cancelText="取消"
    round="15"
    title="优先级"
    @select="prioritySelect"
  >
  </up-action-sheet>

  <!--删除确认-->
  <up-modal
    content="是否删除该代办,此操作不可逆!!!"
    :show="showDel"
    showCancelButton
    asyncClose
    @confirm="confirmDel()"
    @cancel="() => (showDel = false)"
  ></up-modal>
</template>

<script>
import {
  completeTodo,
  getTodoPage,
  homeTodoList,
  addTodo,
  updateTodo,
  deleteTodo,
} from "/api/todo";
import { getTodoRemind } from "/utils/storageUtil.js";

export default {
  data() {
    return {
      loading: false,
      pattern: {
        iconColor: "#ffffff",
        buttonColor: "#1296DB",
      },
      // 右上角更多操作菜单
      actions: [{ text: "显示已完成" }, { text: "排序" }, { text: "搜索" }],
      isShowComplete: false,
      isSearch: false,
      showSort: false,
      sortActions: [{ name: "时间" }, { name: "标题" }, { name: "优先级" }],
      // 数据状态
      topTodoList: [],
      todoList: [],
      completeTodoList: [],
      searchTodoList: [],
      pageQuery: {
        currentPage: 1,
        pageSize: 20,
        query: {
          title: "",
          status: "",
        },
      },
      // 弹窗控制
      showTodoPopup: false,
      showPriority: false,
      showDel: false,
      priorityActions: [{ name: "T0" }, { name: "T1" }, { name: "T2" }],
      priorityColor: "#1296DB",
      pushpinColor: "#bfbfbf",
      todo: {},
      search: "",
    };
  },
  onLoad() {
    this.getHomeTodoList();
  },
  onPullDownRefresh() {
    this.getHomeTodoList();
    if (this.isShowComplete) {
      this.resetPage();
    }
    uni.stopPullDownRefresh();
  },
  methods: {
    /**
     * 获取首页代办数据
     */
    getHomeTodoList() {
      this.loading = true;
      homeTodoList(true).then((res) => {
        if (res.code === 2001) {
          const { topTodoList, unCompleteTodoList } = res.data;
          this.topTodoList = topTodoList;
          this.todoList = unCompleteTodoList;
          this.todoToStr();
        } else {
          this.showError(res.message);
        }
        this.loading = false;
      });
    },

    /**
     * 获取已完成列表
     */
    getPage() {
      this.loading = true;
      getTodoPage(this.pageQuery).then((res) => {
        if (res.code === 2001) {
          this.completeTodoList.push(...res.data.records);
        } else {
          this.showError(res.message);
        }
        this.loading = false;
      });
    },

    /**
     * 重置分页
     */
    resetPage() {
      this.pageQuery.currentPage = 1;
      this.completeTodoList = [];
      this.getPage();
    },

    /**
     * 设置待办颜色标记
     */
    todoToStr() {
      const setInactiveColor = (item) => {
        switch (item.priority) {
          case "t0":
            item.inactiveColor = "red";
            break;
          case "t1":
            item.inactiveColor = "#1296DB";
            break;
          default:
            item.inactiveColor = "";
        }
      };

      this.todoList.forEach(setInactiveColor);
      this.topTodoList.forEach(setInactiveColor);
    },

    /**
     * 打卡成功提示音效
     */
    checkSuccessPrompt() {
      if (getTodoRemind()) {
        const audio = uni.createInnerAudioContext();
        audio.autoplay = true;
        audio.src = "/static/ding.mp3";
        audio.onError((err) => console.error("音频播放失败", err));
      }
    },

    /**
     * 完成待办事项
     */
    complete(todo) {
      this.loading = true;
      completeTodo(todo.id).then((res) => {
        if (res.code === 2001) {
          this.checkSuccessPrompt();
          this.getHomeTodoList();
          if (this.isShowComplete) this.resetPage();
          this.showToast(res.message);
        } else {
          this.showError(res.message);
        }
        this.loading = false;
      });
    },

    /**
     * 编辑或查看详情
     */
    details(todo) {
      this.todo = { ...todo };
      this.setPriorityColor(todo.priority);
      this.setPushpinColor(todo.top);
      this.showTodoPopup = true;
    },

    /**
     * 新增代办
     */
    clickAdd() {
      this.todo = {
        id: undefined,
        remark: "",
        title: "",
        priority: "t1",
        top: false,
      };
      this.setPriorityColor("t1");
      this.setPushpinColor(false);
      this.showTodoPopup = true;
    },

    /**
     * 加载更多完成项
     */
    more() {
      this.pageQuery.currentPage += 1;
      this.getPage();
    },

    /**
     * 排序选择
     */
    sortSelect(e) {
      const sortHandler = {
        时间: () =>
          this.todoList.sort(
            (a, b) => new Date(b.createTime) - new Date(a.createTime)
          ),
        标题: () =>
          this.todoList.sort((a, b) => a.title.localeCompare(b.title)),
        优先级: () =>
          this.todoList.sort((a, b) => a.priorityIndex - b.priorityIndex),
      };
      const handler = sortHandler[e.name];
      if (handler) handler();
    },

    /**
     * 关闭弹窗
     */
    closeTodoPopup() {
      this.todo = {};
      this.priorityColor = "#1296DB";
      this.pushpinColor = "#bfbfbf";
      this.showTodoPopup = false;
    },

    /**
     * 设置优先级颜色
     */
    setPriorityColor(priority) {
      switch (priority) {
        case "t0":
          this.priorityColor = "red";
          break;
        case "t1":
          this.priorityColor = "#1296DB";
          break;
        case "t2":
          this.priorityColor = "#bfbfbf";
          break;
      }
    },

    /**
     * 设置置顶图标颜色
     */
    setPushpinColor(top) {
      this.pushpinColor = top ? "#1296DB" : "#bfbfbf";
    },

    /**
     * 选择优先级
     */
    prioritySelect(e) {
      const map = {
        T0: { key: "t0", color: "red" },
        T1: { key: "t1", color: "#1296DB" },
        T2: { key: "t2", color: "#bfbfbf" },
      };
      const selected = map[e.name];
      if (selected) {
        this.todo.priority = selected.key;
        this.priorityColor = selected.color;
      }
    },

    /**
     * 置顶切换
     */
    editPushpin() {
      this.todo.top = !this.todo.top;
      this.setPushpinColor(this.todo.top);
    },

    /**
     * 提交新增/编辑
     */
    submit() {
      this.loading = true;
      const api = this.todo.id ? updateTodo : addTodo;
      api(this.todo).then((res) => {
        if (res.code === 2001) {
          this.showToast(res.message);
          this.getHomeTodoList();
          if (this.isShowComplete) this.resetPage();
        } else {
          this.showError(res.message);
        }
        this.showTodoPopup = false;
        this.loading = false;
      });
    },

    /**
     * 删除确认
     */
    confirmDel() {
      this.loading = true;
      deleteTodo(this.todo.id).then((res) => {
        if (res.code === 2001) {
          this.showToast(res.message);
          this.getHomeTodoList();
          if (this.isShowComplete) this.resetPage();
        } else {
          this.showError(res.message);
        }
        this.showDel = false;
        this.showTodoPopup = false;
        this.loading = false;
      });
    },

    /**
     * 搜索功能
     */
    clickSearch(value) {
      if (!value.trim()) {
        this.showError("请输入搜索关键字");
        return;
      }
      this.isSearch = true;
      this.loading = true;
      getTodoPage({
        currentPage: 1,
        pageSize: 500,
        query: { title: value },
      }).then((res) => {
        if (res.code === 2001) {
          this.searchTodoList = res.data.records;
        } else {
          this.showError(res.message);
        }
        this.loading = false;
      });
    },

    /**
     * 清除搜索
     */
    clearSearch() {
      this.isSearch = false;
      this.searchTodoList = [];
    },

    /**
     * 跳转设置页面
     */
    clickSetting() {
      uni.navigateTo({ url: "/pages/user/index" });
    },

    /**
     * 显示/隐藏已完成
     */
    clickShowComplete() {
      this.isShowComplete = !this.isShowComplete;
      if (this.isShowComplete) {
        this.pageQuery = {
          currentPage: 1,
          pageSize: 20,
          query: { status: "complete" },
        };
        this.getPage();
      } else {
        this.completeTodoList = [];
      }
    },

    /**
     * 显示排序弹窗
     */
    clickShowSort() {
      this.showSort = true;
    },

    /**
     * 公共提示方法
     */
    showToast(message) {
      this.$refs.uToast.success(message);
    },

    /**
     * 公共错误提示方法
     */
    showError(message) {
      this.$refs.uToast.error(message);
    },
  },
};
</script>

<style>
.whole {
  margin: auto;
  width: 98%;
}

.head {
  margin-bottom: 10px;
  margin-top: 44px;
}

.head-search {
  padding-top: 10px;
  width: 98%;
}

.cell {
  /* margin-top: 20px; */
  margin: auto;
  background-color: #ffffff;
  width: 98%;
  border-radius: 15px;
  margin-bottom: 10px;
}

.cell-title {
  font-weight: 900;
}

.cell-view {
  display: flex;
  align-items: center;
}

.cell-view-text {
  float: left;
  margin-left: 5px;
}

.text_field_outer {
  margin-top: 10px;
  border: 1px solid lightgray;
  background-color: #fff;
  box-sizing: border-box;
  display: inline-block;
  height: 215px;
  padding: 1vh 1vw;
  position: relative;
}

.add-popup-form {
  width: 100vw;
  height: 250px;
}

.add-popup-tag {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* 输入框样式 */
.input-title {
  margin-top: 20px;
  margin-left: 10px;
  border: none;
}

.textarea-desc {
  min-height: 200px;
  width: 100%;
  border: none;
}

.icon-tag,
.icon-pin {
  margin-left: 10px;
}

.action-buttons {
  margin-left: auto;
  margin-right: 10px;
  display: flex;
}

.icon-trash {
  margin-right: 10px;
}

.btn-submit {
  width: 30px;
}
</style>
