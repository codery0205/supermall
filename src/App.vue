<template>
  <div id="app">
    <!-- exculde的值为组件导出中的name属性 -->
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
import MainTabBar from 'components/content/mainTabBar/MainTabBar'
export default {
  name: 'App',
  components: {
    MainTabBar,
  }
}
</script>

<style>
  @import "assets/css/base.css";
</style>
