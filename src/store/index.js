import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        cancelStatic: false //请求中断状态
    },
    mutations: {
        cancelStatic(state,data){
            state.cancelStatic = data
        }
    },
    actions: {},
    modules: {}
})
