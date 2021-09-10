<template>
  <div id="cart">
    <nav-bar class="cart-nav">
      <template #center>购物车({{length}})</template>
    </nav-bar>
    <!--商品列表-->
    <scroll class="content" :probe-type="3" ref="scroll">
      <cart-list/>
    </scroll>
    <cart-bottom-bar/>
  </div>
</template>

<script>
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import NavBar from 'components/common/navbar/NavBar'

import Scroll from 'components/common/scroll/Scroll'

import { mapGetters } from 'vuex'

export default {
  name: 'Cart',
  components: {
    NavBar,
    CartList,
    Scroll,
    CartBottomBar
  },
  computed: {
    ...mapGetters({
      length :'cartLength',
    })
    // 两种用法都可
    // ...mapGetters(['cartLength', 'cartList'])
  },
  activated() {
    this.$refs.scroll.refresh();
  }
}
</script>

<style scoped>
  #cart {
    position: relative;
    height: 100vh;
  }

  .cart-nav {
	  background-color: var(--color-tint);
  	color: #fff;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>

