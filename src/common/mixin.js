import {debounce} from "common/utils"
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
    data() {
        return {
            itemImgListener: null,
            newRefresh: null
        }
    },
    mounted() {
        // 1.监听item中图片加载完成 
        // 涉及到非父子组件的通信, 选择事件总线解决首页可滚动区域的问题
        // 对refresh非常频繁的问题, 进行防抖操作
        this.newRefresh = debounce(this.$refs.scroll.refresh, 500);

        // 对监听的事件进行保存
        this.itemImgListener = () => { 
            this.newRefresh() 
        };

        this.$bus.$on('itemImgLoad', this.itemImgListener)
    }
}

export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBackTop: false
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0, 300);
        },
    }
}