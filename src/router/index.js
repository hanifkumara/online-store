import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main/Main.vue'
import Menu from '../views/Main/Menu.vue'
import AllMenu from '../views/Main/AllMenu'
import Category from '../views/Main/Category'
import GetDataTable from '../views/Main/GetDataTable'
import Detail from '../views/Main/Detail'
import Cart from '../views/Main/Cart'
import DetailCart from '../views/Main/DetailCart'
import RedirectDoku from '../views/Payment/RedirectDoku'
import NotifyDoku from '../views/Payment/NotifyDoku'
import IdentifyDoku from '../views/Payment/IdentifyDoku'
import QRISDoku from '../views/Payment/QRISDoku'

import MainAllbusiness from '../views/Main/AllBusiness/Main'
import AllOutlets from '../views/Main/AllBusiness/AllOutlets'
import ProductOutlet from '../views/Main/AllBusiness/ProductOutlet'
import DetailNoscan from '../views/Main/AllBusiness/DetailNoscan'
import CartNoscan from '../views/Main/AllBusiness/CartNoscan'
import DetailCartNoscan from '../views/Main/AllBusiness/DetailCartNoscan'
import AllMenuNoscan from '../views/Main/AllBusiness/AllMenuNoscan'
import CategoryNoscan from '../views/Main/AllBusiness/CategoryNoscan'

import Auth from '../views/Auth/Auth'
import Login from '../views/Auth/Login'
import Signup from '../views/Auth/Signup'

import TestWhatsapp from '../views/Dev/TestWhatsapp'
import TestQRIS from '../views/Dev/TestQRIS'
import TestSwipeEvent from '../views/Dev/TestSwipeEvent'
import PaymentCashlez from '../views/Dev/PaymentCashlez'

import Account from '../views/Customer/Account'
import Customer from '../views/Customer/Customer'
import HistoryTransaction from '../views/Customer/HistoryTransaction'
import DetailHistoryTransaction from '../views/Customer/DetailHistoryTransaction'

import store from '../store/index'
import Swal from 'sweetalert2'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: 404,
    redirect: '/main'
  },
  {
    path: '/dev/test-whatsapp',
    name: 'TestWhatsapp',
    component: TestWhatsapp
  },
  {
    path: '/dev/test-qris',
    name: 'TestQRIS',
    component: TestQRIS
  },
  {
    path: '/dev/test-swipe-event',
    name: 'TestSwipeEvent',
    component: TestSwipeEvent
  },
  {
    path: '/dev/payment-cashlez',
    name: 'PaymentCashlez',
    component: PaymentCashlez
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
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: { requiresVisitor: true },
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'signup',
        name: 'Signup',
        component: Signup
      }
    ]
  },
  {
    path: '/payment/redirect-doku',
    name: 'RedirectDoku',
    component: RedirectDoku
  },
  {
    path: '/payment/notify-doku',
    name: 'NotifyDoku',
    component: NotifyDoku
  },
  {
    path: '/payment/identify-doku',
    name: 'IdentifyDoku',
    component: IdentifyDoku
  },
  {
    path: '/payment/qris-doku',
    name: 'QRISDoku',
    component: QRISDoku
  },
  {
    path: '/get-data/:tableId/:businessId',
    name: 'GetDataTable',
    component: GetDataTable
  },
  {
    path: '/menu/:tableId',
    name: 'Menu',
    component: Menu,
    meta: { requiresAuth: true },
    redirect: '/menu/:tableId/all-menu',
    children: [
      {
        path: 'all-menu',
        name: 'AllMenu',
        component: AllMenu
      },
      {
        path: 'category/:categoryName',
        name: 'Category',
        component: Category
      },
      {
        path: 'cart',
        name: 'Cart',
        component: Cart
      },
      {
        path: 'detail/:id',
        name: 'Detail',
        component: Detail
      },
      {
        path: 'detail-cart/:idCart',
        name: 'DetailCart',
        component: DetailCart
      }
    ]
  },
  {
    path: '/allbusiness',
    name: 'MainAllbusiness',
    meta: { requiresAuth: true },
    component: MainAllbusiness,
    redirect: '/allbusiness/all-outlets',
    children: [
      {
        path: 'all-outlets',
        name: 'AllOutlets',
        component: AllOutlets
      },
      {
        path: 'product-outlet/:idBusiness/:idOutlet',
        name: 'ProductOutlet',
        component: ProductOutlet,
        redirect: '/allbusiness/product-outlet/:idBusiness/:idOutlet/all-menu',
        children: [
          {
            path: 'all-menu',
            name: 'AllMenuNoscan',
            component: AllMenuNoscan
          },
          {
            path: 'category/:categoryName',
            name: 'CategoryNoscan',
            component: CategoryNoscan
          }
        ]
      },
      {
        path: 'detail/:id',
        name: 'DetailNoscan',
        component: DetailNoscan
      },
      {
        path: 'cart',
        name: 'CartNoscan',
        component: CartNoscan
      },
      {
        path: 'detail-cart/:idCart',
        name: 'DetailCartNoscan',
        component: DetailCartNoscan
      }
    ]
  },
  {
    path: '/customer',
    name: 'Customer',
    meta: { requiresAuth: true },
    component: Customer,
    redirect: '/customer/account',
    children: [
      {
        path: 'account',
        name: 'Account',
        component: Account
      },
      {
        path: 'history-transaction',
        name: 'HistoryTransaction',
        component: HistoryTransaction
      },
      {
        path: 'detail-history-transaction/:id',
        name: 'DetailHistoryTransaction',
        component: DetailHistoryTransaction
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!localStorage.getItem('token')) {
      // Swal.fire(
      //   'Must be logged in!!',
      //   '',
      //   'error'
      // )
      next({
        path: '/auth/login'
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (localStorage.getItem('token')) {
      // Swal.fire(
      //   'You already logged in!!',
      //   '',
      //   'warning'
      // )
      next({
        path: '/allbusiness'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
