<template>
  <div id="cart-list">
    <cart-list-item  v-for="(item, index) in cartList" :shop-item="item" :key="index"/>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

import CartListItem from './CartListItem'

export default {
  name: "CartList",
  components: {
    CartListItem,
  },
  computed: {
    ...mapGetters(['cartList'])
  }
}
</script>

<style scoped>

</style>