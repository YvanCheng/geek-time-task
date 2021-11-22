<template>
  <div class="poseidon-sidebar">
    <el-menu
      v-if="menus && menus.length > 0"
      class="sidebar-menu"
      :default-active="activeIndex"
      :collapse="isCollapse"
      :manualActive="true"
      background-color="#f3f4f6"
      active-text-color="#0062ff"
      @select="selectMenu"
    >
      <div class="sidebar-title">
        <h1 v-if="!isCollapse">{{ title }}</h1>
        <i
          class="icon-collapse"
          :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          @click="isCollapse = !isCollapse"
        ></i>
      </div>

      <div v-for="menuItem in menus" :key="menuItem.key">
        <el-submenu
          v-if="menuItem.subMenus && menuItem.subMenus.length > 0"
          :index="menuItem.route"
        >
          <template slot="title">
            <i :class="'menu-icon ' + menuItem.icon"></i>
            <span v-if="!isCollapse">{{ menuItem.name }}</span>
          </template>
          <el-menu-item
            v-for="menuChildrenItem in menuItem.subMenus"
            :key="menuChildrenItem.route"
            :index="menuItem.route"
          >
            <i
              v-if="menuChildrenItem.icon"
              :class="menuChildrenItem.icon"
              style="margin-right: 5px"
            ></i>
            <span v-else style="margin-left: 21px">&nbsp;</span>
            <span slot="title">{{ menuChildrenItem.name }}</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item :index="menuItem.route" v-else>
          <i :class="'menu-icon ' + menuItem.icon"></i>
          <span slot="title">{{ menuItem.name }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>
<script src="//at.alicdn.com/t/font_2586022_ecz54szq1t.js"></script>
<script lang="ts">
import { SidebarItemModel } from "./model";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class PoseidonSidebar extends Vue {
  @Prop() private title!: string;

  @Prop() private menus!: SidebarItemModel[];

  private name = "poseidon-sidebar";

  private isCollapse = false;

  private activeIndex = this.getActiveByRoute();

  private getActiveByRoute() {
    return this.$route.path.substring(1, this.$route.path.length);
  }

  private selectMenu(menuRoute: string) {
    this.$emit("selectMenu", menuRoute);
  }

  @Watch("isCollapse", { immediate: true })
  onChangeCollapsed(val: boolean) {
    this.$emit("changeCollapse", val);
  }

  @Watch("$route.path")
  onPathChange() {
    this.activeIndex = this.getActiveByRoute();
  }
}
</script>

<style lang="scss" scoped>
$titleHeight: 60px;

.poseidon-sidebar /deep/ .el-menu-item {
  //  background-color: transparent !important;
  height: 50px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #dfe4ef !important;
  }
}
// #84b9fb
.poseidon-sidebar /deep/ .el-menu-item.is-active {
  background-color: #dfe4ef !important;
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    bottom: 0;
    background-color: #0062ff !important;
  }
}

.poseidon-sidebar /deep/ .el-submenu__title {
  &:hover {
    background-color: #dfe4ef !important;
  }
}

.poseidon-sidebar {
  position: fixed;
  left: 0;
  background: #f3f4f6;
}
.sidebar-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px 0 24px;
  box-sizing: border-box;
  height: $titleHeight;
  line-height: $titleHeight;

  h1 {
    display: inline-block;
    font-size: 16px;
    font-weight: 500;
    font-weight: normal;
    white-space: nowrap;
    width: 120px;
    overflow: hidden;
  }
}
.sidebar-menu {
  height: 100vh;
  width: 57px;

  &::-webkit-scrollbar-track-piece {
    background-color: #fff; /* 滚动条的背景颜色 */
    border-radius: 2px; /* 滚动条的圆角宽度 */
  }
  &::-webkit-scrollbar {
    width: 6px; /* 滚动条的宽度 */
    height: 8px; /* 滚动条的高度 */
  }
  &::-webkit-scrollbar-thumb:vertical {
    /* 垂直滚动条的样式 */
    background-color: #999;
    border-radius: 2px;
    outline: 1px solid #fff;
    outline-offset: -1px;
    border: 1px solid #fff;
  }
}

/* stylelint-disable-next-line */
.sidebar-menu:not(.el-menu--collapse) {
  overflow-y: auto;
  overflow-x: hidden;
  width: 200px;
}
.icon-collapse {
  color: rgba($color: #222222, $alpha: 0.75);
  cursor: pointer;
}
// https://github.com/ElemeFE/element/blob/dev/packages/theme-chalk/src/menu.scss#L203
.menu-icon {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
}

::v-deep .el-menu-item,
.el-submenu__title {
  i {
    font-size: 17px;
    color: #222222;
    opacity: 0.75;
  }
}

::v-deep .el-icon-arrow-down {
  font-size: 16px;
  color: rgba($color: #222222, $alpha: 0.75);
  right: 12px;
}
</style>
