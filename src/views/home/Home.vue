<template>
  <div id="home">
    <nav-bar class="home-nav"><template #center>购物街</template></nav-bar>
    <tab-control ref="tabControl1" :titles="titles" @tabClick="goodsClick" class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" :pull-up-load="true" 
            @scroll="contentScroll" @pullingUp="loadMore">
        <home-swiper :banners="banners" @swiperImageLoad.once="swiperImageLoad"/>
        <recommend-view :recommends="recommends"/>
        <feature-view/>
        <tab-control ref="tabControl2":titles="titles" @tabClick="goodsClick"/>
        <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from './childComponents/HomeSwiper'
import RecommendView from './childComponents/RecommendView'
import FeatureView from './childComponents/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import {getHomeMultidata, getHomeGoods} from "network/home"
import {itemListenerMixin, backTopMixin} from "common/mixin"

export default {
  name: 'Home',
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    TabControl,
    FeatureView,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      titles: ['流行', '新款', '精选'],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    // 1.请求多个数据  
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

    this.goodsClick(0);
  },
  mounted() {
  },
  destroyed() {
  },

  // 有keep-alive才会调用这两个函数
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.newRefresh()
  },
  deactivated() {
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();

    // 2.取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    /* 事件监听相关方法 */
    goodsClick(index) {
      // 也可以用switch
      this.currentType = Object.keys(this.goods)[index];
      if (this.$refs.tabControl1 !== undefined) {
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      }

    },

    contentScroll(position) {
      // 1.判断BackTop是否显示
      this.isShowBackTop = Math.abs(position.y) > 1000;
      this.isTabFixed = Math.abs(position.y) > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    /* 网络请求相关方法 */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
      this.banners = res.data.banner.list; //JS垃圾回收
      this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
      this.goods[type].list.push(...res.data.list);
      this.goods[type].page += 1;

      // 完成上拉加载更多
      // 箭头函数中的this指向上一个作用域
      this.$refs.scroll.finishPullUp()
    })
    }
  }
}
</script>
<style scoped>
  #home {
    height: 100vh;
    /* padding-top: 44px; */
    position: relative;
  }

  .home-nav {
		background-color: var(--color-tint);
		color: #fff;

    /* 在使用浏览器原生滚动所以需要设置， 为了让导航不跟随一起滚动*/
    /* position: fixed; 
    top: 0;
    left: 0;
    right: 0;
    z-index: 9; */
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  /* 方法一 */
  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */

  /* 方法二 */

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>