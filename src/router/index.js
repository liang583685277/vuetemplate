import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

export const constantRouterMap = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/error',
        component: () => import('../views/error-page/index.vue'),
        redirect: '/401',
        name: 'ErrorPages',
        meta: {
            title: 'Error Pages',
            icon: '404'
        },
        children: [
            {
                path: '/401',
                component: () => import('@/views/error-page/401.vue'),
                name: 'Page401',
                meta: {title: '401', noCache: true}
            },
            {
                path: '/404',
                component: () => import('@/views/error-page/404.vue'),
                name: 'Page404',
                meta: {title: '404', noCache: true}
            }
        ]
    },
]
//动态需要根据权限加载的路由表
export const asyncRouterMap = [
    {
        path: '/myCenter',
        component: () => import('../views/myCenter/index.vue'),
        name: '权限测试',
        redirect: '/ceShi',
        meta: {role: ['admin', 'super_editor']}, //页面需要的权限
        children: [
            {
                path: '/ceShi',
                component: () => import('../views/myCenter/ceshi.vue'),
                name: '权限测试页',
                meta: {role: ['admin', 'super_editor']}  //页面需要的权限
            }]
    },
    {path: '*', redirect: '/404', hidden: true}
];


const router = new VueRouter({
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})
if (localStorage.getItem('token')){
    router.addRoutes(asyncRouterMap)
}
const whiteList = ['/','/home','/about','/error','/401','/404']
router.beforeEach((to, from, next) => {
    if (sessionStorage.getItem('token')) {
        next();
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/error')
        }
    }
})

export default router