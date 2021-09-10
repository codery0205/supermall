<template>
  <div class="shop-item">
    <div class="item-selector">
      <check-button @click.native="checkClick" :is-checked="shopItem.checked"></check-button>
    </div>
    <div class="item-img">
      <img :scr="shopItem.image" alt="">
    </div>
    <div class="item-info">
      <div class="item-title">{{shopItem.title}}</div>
      <div class="item-desc">商品描述: {{shopItem.desc}}</div>
      <div class="info-bottom">
        <div class="info-price left">¥{{shopItem.price}}</div>
        <div class="info-count right">x{{shopItem.count}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'

export default {
  name: "CartListItem",
  components: {
    CheckButton
  },
  props: {
    shopItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    checkClick() {
      this.shopItem.checked = !this.shopItem.checked;
    }
  }
}
</script>

<style scoped>
  .shop-item {
    width: 100%;
    font-size: 0;
    padding: 5px;
    border-bottom: 1px solid #ccc;
    display: flex;
  }

  .item-selector {
    width: 14%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-title, .item-desc {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item-img {
    padding: 5px;
  }

  .item-img img {
    border-radius: 5px;
    width: 80px;
    height: 100px;
    overflow: hidden;
    display: block;
  }

  .item-info {
    font-size: 17px;
    color: #333;
    padding: 5px 10px;
    position: relative;
    overflow: hidden;
  }

  .item-info .item-desc {
    font-size: 14px;
    color: #666;
    margin-top: 15px;
  }

  .left,.right {
    margin-top: 25px
  }

  .left {
    color: orange;
  }
</style>