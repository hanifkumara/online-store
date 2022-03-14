<template>
  <div>
    <div class="d-flex justify-content-end">
      <!-- <div class="wrapper-beetstore-logo">
        <div class="wrapper-logo">
          <img src="@/assets/images/Beet Store.png" alt="Logo BeetPOS">
        </div>
        <div class="store">STORE</div>
      </div> -->
    </div>
    <div class="container">
      <div class="row mt-4">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-end">
            <div>
              <h4 class="name-business-outlet">{{dataBusiness.businessName}} - {{dataBusiness.outletName}}</h4>
              <div class="wrapper-icon-back" @click="goBack">
                <img src="@/assets/images/back-arrow.png" alt="Back">
              </div>
            </div>
            <div class="d-flex align-items-center" v-if="customerAccountId">
              <router-link :to="{name: 'CartNoscan'}">
                <div class="wrapper-icon-cart">
                  <div v-if="getTotalItem > 0">
                    <div class="count-notif">
                      {{getTotalItem}}
                    </div>
                  </div>
                  <img src="@/assets/images/shopping-cart.png" alt="Cart">
                </div>
              </router-link>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
    <div v-if="getCart.length > 0" class="wrapper-cart">
      <div class="container list-cart">
        <div class="item-cart row mb-2" v-for="(data, index) of getCart" :key="index">
          <div class="col-md-12 d-flex justify-content-between align-items-start">
            <div class="desc-item d-flex" @click="pushToDetailCart(index)">
              <div class="container-images">
                <div class="wrapper-image" v-if="data.imageItem">
                  <img :src="data.imageItem" alt="Product Image" @error="handlePlaceholderImg">
                </div>
                <div class="wrapper-image" v-else>
                  <img src="@/assets/images/websiteplanet-dummy-540X400.png" alt="Product Image">
                </div>
              </div>
              <div>
                <div class="name-item">{{data.nameItem}}</div>
                <div class="price-item">Rp. {{data.totalAmount | numFormat}}</div>
                <div class="notes-item">{{data.notes}}</div>
                <div v-if="data.notesItem">
                  <div class="notes-item">{{data.notesItem}}</div>
                </div>
                <div v-else>
                </div>
              </div>
            </div>
            <div class="wrapper-action">
              <div class="total-item d-flex justify-content-between align-items-center">
                <div class="button-minus" @click="decrement(index)">-</div>
                {{data.totalItem}}
                <div class="button-plus" @click="increment(index)">+</div>
              </div>
              <div class="badge badge-danger btn-delete-cart" @click="deleteCart(index)">
                delete
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="stateModalCz" class="custom-modal">
        <div class="modal-box">
          <div class="d-flex justify-content-end header-custom-modal">
            <div class="wrapper-icon-close" @click="handleCloseModal">
              <img src="@/assets/images/icons8-macos-close-90.png" alt="Close">
            </div>
          </div>
            <iframe class="iframe-cz" :src="urlVendor" allow="geolocation" frameborder="0"></iframe>
        </div>
      </div>

      <div class="container">
        <div class="desc-price mb-3">
          <div class="tax d-flex justify-content-between">
            <h6>Tax (10%)</h6>
            <h5>Rp. {{handleAllAmount.tax | numFormat}}</h5>
          </div>
          <div class="service d-flex justify-content-between">
            <h6>Service (5%)</h6>
            <h5>Rp. {{handleAllAmount.service | numFormat}}</h5>
          </div>
          <div class="grand-total d-flex justify-content-between">
            <h4>Sub Total :</h4>
            <h5>Rp. {{handleAllAmount.resultAmount | numFormat}}</h5>
          </div>
          <div>
            <b-modal modal-footer id="modal-1" title="Please select payment method">
              <div>
                <div class="select-payment-method" v-for="(data, index) in options" :key="index" @click="selected = data" :class="{select: data.value === selected.value}">
                  <h6>{{data.text}}</h6>
                </div>
              </div>
              <template #modal-footer>
                <div v-if="selected.value !== null && enableWaiting">
                  <div class="w-100">
                    <b-button
                      variant="primary"
                      size="sm"
                      class="float-right"
                      @click="handleTransactionDoku"
                    >
                      Submit
                    </b-button>
                  </div>
                </div>
                <div v-else>
                  <div class="w-100">
                    <b-button
                      variant="primary"
                      size="sm"
                      class="float-right"
                      disabled
                    >
                      Submit
                    </b-button>
                  </div>
                </div>
              </template>
            </b-modal>
          </div>
          <!-- @click="handleTransactionDoku" -->
          <button class="button-payment" :disabled="loading" @click="handleTransaction">
            Proceed to Payment
            <div class="wrapper-loading ml-3" v-if="loading">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<circle cx="84" cy="50" r="10" fill="#353535">
    <animate attributeName="r" repeatCount="indefinite" dur="0.25s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"></animate>
    <animate attributeName="fill" repeatCount="indefinite" dur="1s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#353535;#d4d4d4;#9b9b9b;#666666;#353535" begin="0s"></animate>
</circle><circle cx="16" cy="50" r="10" fill="#353535">
  <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
  <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
</circle><circle cx="50" cy="50" r="10" fill="#666666">
  <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s"></animate>
  <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s"></animate>
</circle><circle cx="84" cy="50" r="10" fill="#9b9b9b">
  <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s"></animate>
  <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s"></animate>
</circle><circle cx="16" cy="50" r="10" fill="#d4d4d4">
  <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s"></animate>
  <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s"></animate>
</circle>
<!-- [ldio] generated by https://loading.io/ --></svg>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="d-flex align-items-center justify-content-center">
          <h4 class="text-muted">Empty Cart</h4>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import randomstring from 'randomstring'
import Swal from 'sweetalert2'
// import dayjs from 'dayjs' // ES 2015
export default {
  name: 'CartNoscan',
  data: () => {
    return {
      loading: false,
      stateModalCz: false,
      paymentGateway: '',
      mallIdCCVA: '',
      clientIdCCVA: '',
      mallIdQR: '',
      clientIdQR: '',
      clientSecret: '',
      enableWaiting: true,
      customerAccountId: localStorage.getItem('customer_account_id'),
      allAmount: null,
      urlPayment: '',
      dateNow: '',
      selected: {
        value: null,
        text: ''
      },
      options: [
        // { value: null, text: 'Please select payment method', disabled: true },
        // { value: 29, text: 'BCA (VA)', disabled: true },
        // { value: 32, text: 'CIMB NIAGA (VA)', disabled: true },
        // { value: 35, text: 'ALFA', disabled: true },
        // { value: 41, text: 'Mandiri', disabled: true }
      ],
      optionPaymentMethod: [],
      dataBusiness: {},
      allDataBusiness: {},
      urlVendor: '',
      TRANSIDMERCHANT: randomstring.generate(12),
      customerAccountId: localStorage.getItem('customer_account_id'),
      dataCustomer: {
        name: '',
        email: '',
        phoneNumber: ''
      }
    }
  },
  mounted () {
    console.log('getCart', this.getCart)
    const dateNow = new Date()
    this.dateNow = dayjs(dateNow).format('YYYYMMDDHHMMss')
    this.handleDataBusiness()
    this.handleDataCustomer()
  },
  methods: {
    handleCloseModal () {
      this.stateModalCz = false
    },
    async checkStatusPaymentCz (url) {
      console.log('urlnya', url)
      const result = await axios.post('https://api-link.cashlez.com/validate_url', {
        status: '',
        message: '',
        data: {
          request: {
            generatedUrl: url
          }
        }
      })
      console.log('result.data.data', result.data.data)
      console.log('result.data.data.response.processStatus', result.data.data.response.processStatus)
      return result.data.data
    },
    async handleCZ () {
      this.stateModalCz = true
      console.log('this.allDataBusiness', this.allDataBusiness.cz_vendor_identifier)
      const generateSignature = {
        data: {
          request: {
            vendorIdentifier: this.allDataBusiness.cz_vendor_identifier,
            token: '',
            referenceId: this.TRANSIDMERCHANT,
            entityId: this.allDataBusiness.cz_entity_id,
            merchantName: this.dataBusiness.outletName,
            merchantDescription: 'Cashlez Sunter',
            currencyCode: 'IDR',
            amount: this.handleAllAmount.resultAmount,
            callbackSuccess: '',
            callbackFailure: '',
            message: '',
            description: 'Test Transaction',
            transactionUsername: this.allDataBusiness.cz_user
          }
        }
      }
      const { data } = await axios.post('https://api.beetpos.com/api/v1/signature/generate', generateSignature)
      console.log('data.data', data.data[0].result)

      generateSignature.signature = data.data[0].result

      console.log('generateSignature', generateSignature)
      const generateUrlVendor = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/signature/generate-url-vendor`, generateSignature)
      console.log('generateUrlVendor', generateUrlVendor.data.data)
      this.urlVendor = generateUrlVendor.data.data.response.generatedUrl
    },
    handlePlaceholderImg (e) {
      e.target.src = 'https://via.placeholder.com/250'
    },
    async handleDataCustomer () {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/customer-account/${this.customerAccountId}`)
      console.log('handleDataCustomer', data)
      this.dataCustomer = {
        name: data.data.name,
        email: data.data.email,
        phoneNumber: data.data.phone_number
      }
    },
    async handleDataBusiness () {
      const data = JSON.parse(localStorage.getItem('main_data'))
      const resultOutlet = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/outlet-noverify/${data.idOutlet}`)
      const resultBusiness = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/business-noverify/${data.idBusiness}`)
      console.log('resultOutlet', resultOutlet)
      console.log('resultBusiness', resultBusiness)

      const resDataBusiness = {
        outletId: resultOutlet.data.data.id,
        businessId: resultBusiness.data.data.id,
        businessName: resultBusiness.data.data.name,
        outletName: resultOutlet.data.data.name
      }
      this.dataBusiness = resDataBusiness
      this.allDataBusiness = resultBusiness.data.data
    },
    async handleTransactionDoku () {
      let paymentMethod
      let paymentMethodId

      if (this.selected.value === 0) paymentMethod = 'qr'
      if (this.selected.value === 15) paymentMethod = 'debit'
      if (this.selected.value === 34) paymentMethod = 'virtual'
      if (this.selected.value === 36) paymentMethod = 'virtual'
      console.log('this.optionPaymentMethod', this.optionPaymentMethod)
      this.optionPaymentMethod.map(value => {
        if (value.doku_type === paymentMethod) {
          paymentMethodId = value.id
        }
      })

      console.log('paymentMethod', paymentMethod)
      console.log('paymentMethodId', paymentMethodId)

      this.enableWaiting = false
      console.log('add transaction')
      console.log('final data getcart', this.getCart)
      const tempItems = []
      const receiptId = 'ORDER_' +
      this.dataBusiness.outletId +
      ':' +
      localStorage.getItem('customer_account_id') +
      ':' +
      dayjs(new Date()).format('YYYY/MM/DD:HH:mm:ss')

      this.getCart.map(value => {
        const tempAddons = []
        if (value.fullDataAddons) {
          value.fullDataAddons.map(value2 => {
            tempAddons.push({
              id: value2.id,
              price: value2.price
            })
          })
        }
        tempItems.push({
          sales_type_id: 1,
          product_id: value.idItem,
          addons: tempAddons || [],
          quantity: value.totalItem,
          price_product: value.priceItem,
          price_discount: 0,
          price_service: 0,
          price_addons_total: value.totalPriceAddons || 0,
          price_total: value.totalAmount,
          notes: value.notes
        })
      })
      const mainData = JSON.parse(localStorage.getItem('main_data'))
      const sendData = {
        receipt_id: receiptId,
        items: tempItems,
        outlet_id: mainData.idOutlet,
        business_id: mainData.idBusiness,
        customer_account_id: localStorage.getItem('customer_account_id'),
        payment_method_id: paymentMethodId,
        payment_discount: 0,
        payment_tax: this.handleAllAmount.tax,
        payment_service: this.handleAllAmount.service,
        payment_total: this.handleAllAmount.paymentTotal,
        amount: this.handleAllAmount.resultAmount,
        payment_change: 0,
        invoice: this.TRANSIDMERCHANT,
        paymentchannel: this.selected.value
      }
      console.log('sendData', sendData)
      const resTransaction = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/transaction-customer`, sendData)
      console.log(resTransaction.data.data)
      if (this.selected.value === 0) {
        // Development
        console.log('this.clientIdQR', this.clientIdQR)
        console.log('this.mallIdQR', this.mallIdQR)
        console.log('this.clientSecret', this.clientSecret)

        const resQRString = await axios.get(`${process.env.VUE_APP_PAYMENT_DOKU_QRIS}?amount=${this.handleAllAmount.resultAmount}&sharedKey=${this.mallIdQR}&clientId=${this.clientIdQR}&clientSecret=${this.clientSecret}`)

        const transactionId = resTransaction.data.data.id
        const transactionIdQRIS = resQRString.data.data.transactionId
        await axios.put(`${process.env.VUE_APP_API_URL}/api/v1/transaction-customer?id=${transactionId}&transactionIdQRIS=${transactionIdQRIS}`)
        this.$router.push({ name: 'QRISDoku', query: { qrString: resQRString.data.data.qrCode, businessName: this.dataBusiness.businessName, outletName: this.dataBusiness.outletName } })
      } else {
        window.location = this.urlPayment
      }
    },
    async handleTransaction () {
      this.loading = true
      try {
        this.dataBusiness
        const tempItems = []
        this.getCart.map(value => {
          console.log('value ===>', value)
          tempItems.push({
            productId: value.idItem,
            quantity: value.totalItem,
            priceProduct: value.priceItem
          })
        })
        const sendDataTransaction = {
          businessId: this.dataBusiness.businessId,
          outletId: this.dataBusiness.outletId,
          customerId: localStorage.getItem('customerId'),
          items: JSON.stringify(tempItems),
          totalPayment: this.handleAllAmount.resultAmount
        }
        console.log('sendDataTransaction',sendDataTransaction)
        await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/transaction`, sendDataTransaction)
        this.loading = false
        Swal.fire(
          'Transaction Successfully',
          '',
          'success'
        )
        this.$store.commit('SET_CART', null)
        this.$router.push({ name: 'MainAllbusiness' })
      } catch (error) {
        this.loading = false
        Swal.fire(
          "Something wen't wrong",
          '',
          'error'
        )
        console.log('error', error)
      }
    },
    async handleTransactionCz (data) {
      let paymentMethod
      let paymentMethodId
      if (data.response.paymentType.id === 1) paymentMethod = 'ecomm'
      if (data.response.paymentType.id === 2) paymentMethod = 'virtual'
      if (data.response.paymentType.id === 3) paymentMethod = 'ovo'
      if (data.response.paymentType.id === 4) paymentMethod = 'qr'
      if (data.response.paymentType.id === 7) paymentMethod = 'virtual'

      console.log('this.optionPaymentMethod', this.optionPaymentMethod)
      this.optionPaymentMethod.map(value => {
        if (value.cz_type === paymentMethod) {
          paymentMethodId = value.id
        }
      })

      this.enableWaiting = false
      console.log('add transaction')
      console.log('final data getcart', this.getCart)
      const tempItems = []
      const receiptId = 'ORDER_' +
      this.dataBusiness.outletId +
      ':' +
      localStorage.getItem('customer_account_id') +
      ':' +
      dayjs(new Date()).format('YYYY/MM/DD:HH:mm:ss')

      this.getCart.map(value => {
        const tempAddons = []
        if (value.fullDataAddons) {
          value.fullDataAddons.map(value2 => {
            tempAddons.push({
              id: value2.id,
              price: value2.price
            })
          })
        }
        tempItems.push({
          sales_type_id: 1,
          product_id: value.idItem,
          addons: tempAddons || [],
          quantity: value.totalItem,
          price_product: value.priceItem,
          price_discount: 0,
          price_service: 0,
          price_addons_total: value.totalPriceAddons || 0,
          price_total: value.totalAmount,
          notes: value.notes
        })
      })
      const sendData = {
        receipt_id: receiptId,
        items: tempItems,
        outlet_id: parseInt(this.dataBusiness.outletId),
        business_id: parseInt(this.dataBusiness.businessId),
        customer_account_id: localStorage.getItem('customer_account_id'),
        payment_method_id: paymentMethodId,
        payment_discount: 0,
        payment_tax: this.handleAllAmount.tax,
        payment_service: this.handleAllAmount.service,
        payment_total: this.handleAllAmount.paymentTotal,
        amount: this.handleAllAmount.resultAmount,
        payment_change: 0,
        invoice: this.TRANSIDMERCHANT,
        status: 'done',
        paymentchannel: data.response.paymentType.code === 'ECOMM' ? 15 : data.response.paymentType.code === 'TCASH_QR_PAYMENT' ? 0 : null
      }
      console.log('sendData', sendData)
      const resTransaction = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/transaction-customer`, sendData)
      console.log(resTransaction.data.data)
    },
    proceedPayment () {
      console.log('')
    },
    pushToDetailCart (id) {
      console.log('ini id nya bre', id)
      this.$router.push({ name: 'DetailCartNoscan', params: { idCart: id } })
    },
    decrement (id) {
      console.log('decrement', id)
      const tempData = this.getCart[id]
      if (tempData.totalItem > 1) {
        tempData.totalItem = tempData.totalItem - 1
        this.getCart[id].totalAmount = this.getCart[id].priceItem * this.getCart[id].totalItem
        console.log('getCart', this.getCart)
        // this.pushToDetailCart(id)
      } else {
        this.getCart.splice(id, 1)
      }
    },
    increment (id) {
      console.log('increment', id)
      const tempData = this.getCart[id]
      tempData.totalItem = tempData.totalItem + 1
      this.getCart[id].totalAmount = this.getCart[id].priceItem * this.getCart[id].totalItem
      console.log('getCart', this.getCart)
      // this.pushToDetailCart(id)
    },
    goBack () {
      this.$router.go(-1)
    },
    deleteCart (id) {
      this.getCart.splice(id, 1)
    },
    handleStatusTransactionCz () {
      const dataBusiness = this.dataBusiness
      this.stateModalCz = false
      this.$store.commit('SET_CART', null)
      this.$router.push({ name: 'ProductOutlet', params: { idBusiness: dataBusiness.businessId, idOutlet: dataBusiness.outletId } })
      Swal.fire(
        'Transaction Successfully',
        '',
        'success'
      )
    }
  },
  computed: {
    ...mapGetters(['getCart', 'getTotalItem']),
    handleAllAmount () {
      const tempAllAmount = []
      const basket = []
      const result = {}
      let priceAllItem = null
      this.getCart.map(value => {
        tempAllAmount.push(value.totalAmount)
      })
      if (tempAllAmount.length > 0) {
        console.log('tempAllAmount', tempAllAmount)
        const resultAmount = tempAllAmount.reduce((acc, curr) => {
          return acc + curr
        })
        console.log('result dalam', resultAmount)
        priceAllItem = resultAmount
        result.resultAmount = resultAmount
      }
      result.tax = Math.ceil(result.resultAmount * 10 / 100)
      result.service = Math.ceil(result.resultAmount * 5 / 100)
      result.paymentTotal = result.resultAmount
      result.resultAmount = Math.ceil(result.resultAmount + result.tax + result.service)

      this.getCart.map(value => {
        basket.push([value.nameItem, value.priceItem, value.totalItem, value.totalAmount])
      })
      basket.push(['tax', result.tax, 1, result.tax], ['service', result.service, 1, result.service])

      console.log('one way', this.dataCustomer)
      this.urlPayment = `${process.env.VUE_APP_FRONTEND_URL}/payment/doku?BASKET=${basket.join(';')}&MALLID=${this.clientIdCCVA}&CHAINMERCHANT=NA&AMOUNT=${result.resultAmount}.00&PURCHASEAMOUNT=${result.resultAmount}.00&TRANSIDMERCHANT=${this.TRANSIDMERCHANT}&WORDS=&REQUESTDATETIME=${this.dateNow}&CURRENCY=360&PURCHASECURRENCY=360&SESSIONID=&PAYMENTCHANNEL=${this.selected.value}&ADDRESS=&COUNTRY=INDONESIA&STATE=&CITY=&PROVINCE=&ZIPCODE=&TAXSERVICE=${result.tax + result.service}&SUBTOTAL=${priceAllItem}&PAYMENTMETHOD=${this.selected.text}&NAME=${this.dataCustomer.name}&EMAIL=${this.dataCustomer.email}&PHONENUMBER=${this.dataCustomer.phoneNumber}&SHAREDKEY=${this.mallIdCCVA}`
      return result
    }
  },
  watch: {
    urlVendor (val) {
      const looping = setInterval(async () => {
        const data = await this.checkStatusPaymentCz(val)
        console.log('watch urlVendor', data)
        await this.checkStatusPaymentCz(val)
        console.log('this.checkStatusPaymentCz()', await this.checkStatusPaymentCz(val))
        console.log('hooknya', data)
        if (!this.stateModalCz) {
          console.log('Event close modal')
          clearInterval(looping)
        }
        if (data.response.processStatus === 'APPROVED') {
          this.handleTransactionCz(data)
          console.log('Data ketika Approved', data)
          this.handleStatusTransactionCz()
          clearInterval(looping)
        }
      }, 3000)
    }
  }
}
</script>

<style scoped>
iframe.iframe-cz{
  width: 100%;
  height: 100vh;
}
.count-notif{
  position: absolute;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background-color: rgb(248, 72, 72);
  color: white;
  font-size: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: -6px;
}
h6{
  margin: 0;
}
.select-payment-method{
  padding: 15px 12px;
  margin: 5px 0;
  border-radius: 10px;
  cursor: pointer;
}
.wrapper-icon-cart:hover {
  transform: scale(1.02);
}
.wrapper-icon-cart{
  cursor: pointer;
  width: 25px;
  height: 25px;
  object-fit: contain;
  position: relative;
}
.wrapper-icon-cart > img{
  width: 100%;
  height: 100%;
}
iframe{
  width: 100%;
  height: 60vh;
}
.container-images{
  width: 140px;
}
.wrapper-image{
  width: 120px;
  height: 90px;
  margin-right: 10px;
  object-fit: contain;
}
.wrapper-image > img {
  width: 100%;
  height: 100%;
}
.btn-delete-cart{
  margin-top: 10%;
}
.total-item{
  height: 20px;
  background-color: #623863;
  color: white;
  padding: 0 10px;
  border-radius: 6px;
  padding-bottom: 3px;
}
.desc-item{
  flex: 4;
}
.wrapper-loading > svg{
  width: 25px;
  height: 25px;
}
.select{
  color: white;
  background-color: #623863;
}
.button-minus, .button-plus{
  cursor: pointer;
}
.name-item{
  font-size: 19px;
  font-weight: 600;
}
.price-item{
  font-size: 16px;
  font-weight: 600;
}
.wrapper-icon-back{
  width: 20px;
  cursor: pointer;
  height: 20px;
  object-fit: contain;
}
.wrapper-action{
  width: 22%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
}
.wrapper-icon-back:hover{
  transform: scale(1.05);
}
.wrapper-icon-back > img{
  width: 100%;
  height: 100%;
}
.list-cart{
  height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.button-payment{
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #623863;
  color: white;
  font-size: 14px;
  padding: 10px 0;
  border-radius: 10px;
}
button{
  width: 100%;
  border: none;
}
.desc-price{
  width: 100%;
}
.wrapper-beetstore-logo{
  display: flex;
  align-items: center;
  /* d-flex align-items-center */
  margin-right: 10%;
}
.wrapper-logo{
  margin-top: 20px;
  width: 100px;
  object-fit: contain;
}
.store{
  color: #623863;
  font-size: 2.6rem;
  text-align: center;
  margin-bottom: -20px;
}
.wrapper-logo > img{
  width: 100%;
}
.item-cart{
  cursor: pointer;
}
.item-cart:hover{
  transform: scale(1.005);
}
.custom-modal{
  top: 20px;
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.modal-box{
  background-color: rgb(242,247,252);
  box-shadow: 0 0 3px 1px #623863;
  width: 100%;
}
.header-custom-modal {
  background-color: rgb(242,247,252);
}
.wrapper-icon-close{
  margin: 10px 25px;
  width: 35px;
  height: 35px;
  object-fit: contain;
}
.wrapper-icon-close>img{
  width: 100%;
  height: 100%;
}
@media screen and (max-width: 786px) {
  .modal-box{
    background-color: white;
  }
  .header-custom-modal {
    background-color: white;
  }
  .modal-box{
    border: 1px solid;
  }
}
@media only screen and (max-width: 495px) {
  .modal-box{
    border: 1px solid;
  }
  .store{
    font-size: 1.8rem;
    margin-bottom: -13px;
  }
  .wrapper-logo{
    width: 80px;
    margin-top: 10px;
  }
  .desc-price{
    position: fixed;
    bottom: 0;
    width: 92%;
  }
  .container-images{
    width: 120px;
  }
  .wrapper-image{
    width: 110px;
    height: 80px;
    object-fit: contain;
  }
  .name-item{
    font-size: 13px;
    font-weight: 600;
  }
  .tax > h6, .tax > h5{
    font-size: 12px;
  }
  .service > h6, .service > h5{
    font-size: 12px;
  }
  .grand-total > h6, .grand-total > h4{
    font-size: 15px;
    font-weight: 600;
  }
  .notes-item{
    font-size: 12px;
  }
  .name-business-outlet{
    font-size: 16px;
  }
}
</style>
