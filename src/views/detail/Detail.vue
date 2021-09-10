<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
        <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info :param-info="paramInfo" ref="param"/>
            <detail-comment-info :comment-info="commentInfo" ref="comment"/>
            <goods-list :goods="recommends" ref="recommend"/>
        </scroll>
        <back-top @click.native="backClick" v-show="isShowBackTop"/>
        <detail-bottom-bar @addToCart="addToCart"/>
        <!-- <toast :message="message" :show="show"/> -->
    </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'

import {debounce} from "common/utils"
import {getDetail, getRecommend, Goods, Shop, GoodsParams} from 'network/details'
import {itemListenerMixin, backTopMixin} from "common/mixin"

import { mapActions } from 'vuex'


export default ({
    name: "Detail",
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,
        Scroll,
        GoodsList,
        // Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
        return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            themeTopYs: [],
            getThemeTopY: null,
            currentIndex: 0,
            message: '',
            show: false
        }
    },
    created() {
        // 1.保存传入的iid
        this.iid = this.$route.params.iid

        // 2.根据请求的iid请求数据
        getDetail(this.iid).then(res => {

            // 1.获取顶部的图片进行轮播
            const data = res.result;
            console.log(data);
            this.topImages = res.result.itemInfo.topImages;

            // 2.获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
            
            // 3.获取商品信息
            this.shop = new Shop(data.shopInfo);

            // 4.保存商品详细数据
            this.detailInfo = data.detailInfo;

            // 5.获取参数信息
            this.paramInfo = new GoodsParams(data.itemParams.info, data.itemParams.rule)

            // 6.取出评论的信息
            if (data.rate.cRate !== 0) {
                this.commentInfo = data.rate.list[0];
            }
        })

        // 3.请求推荐数据
        getRecommend().then(res => {
            this.recommends = res.data.list;
        })

        // 4.给getThemeTopY赋值
        this.getThemeTopY = debounce(() => {
            this.themeTopYs = [];
            this.themeTopYs.push(0);
            this.themeTopYs.push(this.$refs.param.$el.offsetTop);
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
            this.themeTopYs.push(Number.MAX_VALUE);
        }, 100)
    },
    mounted() {
    },
    updated() {
    },
    destroyed() {
        this.$bus.$off('itemImgLoad', this.itemImgListener);
    },
    methods: {
        ...mapActions(['addCart']),
        // ...mapActions({add: 'addCart'}),
        imageLoad() {
            this.newRefresh();
            this.getThemeTopY();
        },
        titleClick(index) {
            this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
        },
        contentScroll(position){
            const positionY = Math.abs(position.y);
            let lenght = this.themeTopYs.length;
            for(let i = 0; i < lenght - 1; i++) {
                if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
                    this.currentIndex = i;
                    this.$refs.nav.currentIndex = this.currentIndex;
                }
            }
            this.isShowBackTop = Math.abs(position.y) > 1000;
        },
        addToCart() {
            // 1.获取购物车需要展示的信息
            const product = {};
            product.image = this.topImages[0];
            product.title = this.goods.title;
            product.desc = this.goods.desc;
            product.price = this.goods.realPrice;
            product.iid = this.iid;

            // 2.将商品添加到购物车里(1.promise  2.mapActions)
            // mutations
            // this.$store.commit('addCart', product);
            // actions

            this.addCart(product).then(res => console.log(res)); // mapActions

            this.$store.dispatch('addCart', product).then(res => {
                // this.show = true;
                // this.message = res;
                // setTimeout(() => {
                //     this.show = false;
                //     this.message = ''
                // }, 1500)
                this.$toast.show(res, 2000)
            })
        }
    }
})
</script>

<style scoped>
  #detail {
      position: relative;
      z-index: 10;
      background-color: #fff;
      height: 100vh;
  }

  .detail-nav {
      position: relative;
      z-index: 10;
      background-color: #fff;
  }

  .content {
      height: calc(100% - 44px - 58px);
  }
</style>

// 点击标题, 滚动到对应的主题
// 1. 在detail中监听标题的点击, 获取index
// 2. 滚动到对应的主题: 
//    获取所有主题的offsetTop
//    问题: 在哪里才能获得正确的offsetTop
//        1. created()肯定不行, 压根不能获取元素
//        2. mounted()也不行, 数据还没有获取到
//        3. updated()也不行, DOM还没有渲染完
//        4. $nextTick()也不行, 图片的高度没有被计算在内
//        5. 在图片加载完成后, 获取的高度才是正确的
