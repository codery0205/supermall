<template>
    <div>
        <nav-bar>
            <template #left>
                <div @click="backClick">
                    <img src="~assets/img/common/back.svg" class="backImg">
                </div>
            </template>
            <template #center>
                <div class="title">
                    <span v-for="(item, index) in titles" 
                    class="title-item"
                    :class="{active: index === currentIndex}"
                    @click="itemClick(index)">{{item}}</span>
                </div>
            </template>
        </nav-bar>
    </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
export default ({
    name: "DetailNavBar",
    components: {
        NavBar
    },
    data() {
        return {
            titles: ['商品', '参数', '评论', '推荐'],
            currentIndex: 0
        }
    },
    methods: {
        itemClick(index) {
            this.currentIndex = index;
            this.$emit('titleClick', index);
        },
        backClick() {
            this.$router.back();
        }
    }
})
</script>

<style scoped>
  .backImg {
      padding: 11px 19px;
  }
  .title {
      display: flex;
      font-size: 13px;
  }
  .title-item {
      flex: 1
  }
  .active {
      color: var(--color-tint)
  }
</style>
