import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex);

const state = {
    cartList: [],
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})

export default store

// for of

// let oldProduct = null;
// for(let item of state.cartList) {
//     if (item.iid === payload.iid) {
//         oldProduct = item;
//     }
// }
// if (oldProduct) {
//     oldProduct.count += 1
// } else {
//     payload.count = 1;
// }
// state.cartList.push(payload);

