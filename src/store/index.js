import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Swal from 'sweetalert2'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: [],
    totalItem: null,
    codeChannel: [
      {
        code: '0',
        desc: 'QRIS'
      },
      {
        code: '02',
        desc: 'Mandiri ClikPay'
      },
      {
        code: '03',
        desc: 'KlikBCA'
      },
      {
        code: '04',
        desc: 'DOKU Wallet'
      },
      {
        code: '06',
        desc: 'BRI e-Pay'
      },
      {
        code: '15',
        desc: 'Credit Card Visa/Master/JCB'
      },
      {
        code: '16',
        desc: 'Credit Card Tokenization'
      },
      {
        code: '17',
        desc: 'Recurring Payment'
      },
      {
        code: '18',
        desc: 'BCA KlikPay'
      },
      {
        code: '19',
        desc: 'CIMB Cliks'
      },
      {
        code: '22',
        desc: 'Sinarmas VA'
      },
      {
        code: '23',
        desc: 'MOTO'
      },
      {
        code: '25',
        desc: 'Muamalat Internet Banking'
      },
      {
        code: '26',
        desc: 'Danamon Internet Banking'
      },
      {
        code: '28',
        desc: 'Permata Internet Banking'
      },
      {
        code: '29',
        desc: 'BCA VA'
      },
      {
        code: '31',
        desc: 'Indomaret'
      },
      {
        code: '33',
        desc: 'Danamon VA'
      },
      {
        code: '34',
        desc: 'BRI VA'
      },
      {
        code: '35',
        desc: 'Alfagroup'
      },
      {
        code: '36',
        desc: 'Permata VA'
      },
      {
        code: '37',
        desc: 'Kredivo'
      },
      {
        code: '41',
        desc: 'Mandiri VA'
      },
      {
        code: '42',
        desc: 'QNB VA'
      },
      {
        code: '45',
        desc: 'BNI Yap'
      },
      {
        code: '47',
        desc: 'Arta Jasa VA'
      },
      {
        code: '50',
        desc: 'Link AJA'
      }
    ]
  },
  mutations: {
    SET_CART (state, payload) {
      if (!payload) {
        state.cart = []
        state.totalItem = null
        console.log('set_cart null', payload)
      } else {
        console.log('set_cart not null', payload)
        state.cart.push(payload)
        state.totalItem = state.cart.length
      }
    }
  },
  actions: {
    interceptorRequest () {
      axios.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
        console.log('interceptorRequest terpanggil')
        return config
      }, function (error) {
        return Promise.reject(error)
      })
    },
    interceptorResponse () {
      console.log('interceptorResponse terpanggil')
      axios.interceptors.response.use(
        (response) => {
          console.log('response', response)
          return response
        },
        (err) => {
          console.log('err response', err.response)
          if (
            err.response.data.statusCode === 401
          ) {
            localStorage.clear()
            // window.location.replace('/auth/login')
          } else if (
            err.response.data.statusCode === 403
          ) {
            Swal.fire('Oppss...', 'session has timed out, please login again', 'warning')
            localStorage.clear()
            window.location.replace('/auth/login')
          } else if (
            err.response.data.statusCode === 422
          ) {
            localStorage.clear()
            // window.location.replace('/auth/login')
          } else {
            return Promise.reject(err)
          }
        }
      )
    }
  },
  getters: {
    getCart (state) {
      return state.cart
    },
    getTotalItem (state) {
      return state.totalItem
    },
    isLogin (state) {
      return state.token !== null
    },
    getCodeChannel (state) {
      return state.codeChannel
    }
  },
  modules: {
  }
})
