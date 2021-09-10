<template>
    <div class="bottom-bar">
        <div class="check-content">
            <check-button :is-checked="isSelectAll" 
                          @click.native="checkClick" 
                          class="check-button"/>
            <span>全选</span>
        </div>
        <div class="price">合计: ¥ {{totalPrice}}</div>
        <div class="calculate" @click="calcClick">去计算({{checkLength}})</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CheckButton from 'components/content/checkButton/CheckButton'
export default {
    name: "CartBottomBar",
    components: {
        CheckButton
    },
    computed: {
        ...mapGetters(['cartList']),
        totalPrice() {
            return this.cartList.length ? 
                   this.cartList.filter(item => item.checked)
                   .map(item => item.count * item.price)
                   .reduce((pre, item) => pre + item, 0).toFixed(2) : 0
        },
        checkLength() {
            return this.cartList.length ? 
                   this.cartList.filter(item => item.checked)
                   .map(item => item.count)
                   .reduce((pre, item) => pre + item, 0) : 0
        },
        isSelectAll() {
            // if (this.cartList.length !== 0){
            //     return !(this.cartList.filter(item => !item.checked).length)
            // } else {
            //     return false
            // }
            return this.cartList.length ? !this.cartList.find(item => !item.checked) : false
        }
    },
    methods: {
        checkClick() {
            if (this.isSelectAll) { // 全部选中
                this.cartList.forEach(item => item.checked = false)
            } else if (!this.isSelectAll && this.cartList.length) { // 部分选中或者全部未选中且有长度
                this.cartList.forEach(item => item.checked = true)
            }
        },
        calcClick() {
            if (!this.isSelectAll) {
                this.$toast.show('请选择购买的商品', 2000)
            }
        }
    }
}
</script>


<style scoped>
  .bottom-bar {
    position: fixed;
    display: flex;

    width: 100%;
    height: 40px;
    bottom: 49px;
    line-height: 40px;
    
    background: #eee;
  }

  .check-content {
      display: flex;
      align-items: center;
      margin-left: 10px;
      width: 60px;
  }

  .check-button {
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-right: 5px;
  }

  .price {
      padding-left: 10px;
      font-size: 15px;
      flex: 1;
  }

  .calculate {
      width: 90px;
      text-align: center;
      background-color: rgb(241, 43, 43);
      color: #fff;
  }
</style>