<template>
  <div>
    <div v-if="stateModalCz" class="custom-modal">
      <div class="modal-box">
        <div class="d-flex justify-content-end header-custom-modal">
          <div class="wrapper-icon-close" @click="handleCloseModal">
            <img src="@/assets/images/icons8-macos-close-90.png" alt="Close">
          </div>
        </div>
          <iframe class="iframe-cz" :src="urlVendor" frameborder="0"></iframe>
      </div>
    </div>

    <div v-if="getCart.length > 0" class="wrapper-cart">
      <div class="container list-cart">
        <div class="item-cart row mb-2" v-for="(data, index) of getCart" :key="index">
          <div class="col-md-12 d-flex justify-content-between align-items-start">
            <div class="desc-item d-flex" @click="pushToDetailCart(index)">
              <div class="container-images">
                <div class="wrapper-image" v-if="data.imageItem">
                  <img :src="data.imageItem" alt="Product Image">
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
      <!-- <hr /> -->
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
                <div v-if="options.length">
                  <div class="select-payment-method" v-for="(data, index) in options" :key="index" @click="selected = data" :class="{select: data.value === selected.value}">
                    <h6>{{data.text}}</h6>
                  </div>
                </div>
                <div v-else>
                  <div class="text-muted text-center py-5">no payment method</div>
                </div>
                <div>
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
          <div class="button-payment" v-b-modal.modal-1 v-if="paymentGateway === 'doku'">
            Proceed to Payment
          </div>
          <div class="button-payment" @click="handleCZ" v-if="paymentGateway === 'cz'">
            Proceed to Payment
          </div>
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
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import axios from 'axios'
import randomstring from 'randomstring'

// import dayjs from 'dayjs' // ES 2015
export default {
  name: 'Cart',
  props: {
    dataBusiness: Object
  },
  data: () => {
    return {
      stateModalCz: false,
      paymentGateway: '',
      mallIdCCVA: '',
      clientIdCCVA: '',
      mallIdQR: '',
      clientIdQR: '',
      clientSecret: '',
      enableWaiting: true,
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
      allDataBusiness: {},
      urlVendor: '',
      TRANSIDMERCHANT: randomstring.generate(12),
      customerAccountId: localStorage.getItem('customer_account_id') || null,
      dataCustomer: {
        name: '',
        email: '',
        phoneNumber: ''
      }
    }
  },
  mounted () {
    console.log('pinjam harusnya', this.getCart)
    const dateNow = new Date()
    this.dateNow = dayjs(dateNow).format('YYYYMMDDHHMMss')
    this.handleDataCustomer()
    this.handleOptionPaymentMethods()
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
      console.log('this.allDataBusiness', this.dataBusiness.czVendorIdentifier)
      const generateSignature = {
        data: {
          request: {
            vendorIdentifier: this.dataBusiness.czVendorIdentifier,
            token: '',
            referenceId: this.TRANSIDMERCHANT,
            entityId: this.dataBusiness.czEntityId,
            merchantName: this.dataBusiness.outletName,
            merchantDescription: 'Cashlez Sunter',
            currencyCode: 'IDR',
            amount: this.handleAllAmount.resultAmount,
            callbackSuccess: '',
            callbackFailure: '',
            message: '',
            description: 'Test Transaction',
            transactionUsername: this.dataBusiness.czUser
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
    async handleOptionPaymentMethods () {
      if (this.dataBusiness.dokuClientId || this.dataBusiness.czEntityId) {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/payment-method/development?businessId=${this.dataBusiness.businessId}`)
        const resultPayment = []
        data.data.rows.map(value => {
          if (!value.outlet_id || value.outlet_id === this.dataBusiness.outletId || value.outlet_id == 1) {
            resultPayment.push(value)
          }
        })
        resultPayment.map(value => {
          this.optionPaymentMethod.push(value)
        })
        if (this.dataBusiness.dokuClientId) {
          this.paymentGateway = 'doku'
          const dokuclientSecret = this.dataBusiness.dokuclientSecret
          if (this.dataBusiness.dokuClientId) {
            this.clientIdCCVA = this.dataBusiness.dokuClientId
            this.mallIdCCVA = this.dataBusiness.dokuSharedKey
            resultPayment.map(value => {
              console.log('value.doku_type', value.doku_type)
              if (value.doku_type == 'virtual') {
                this.options.push(
                  { value: 36, text: 'Permata Bank (VA)' },
                  { value: 34, text: 'Bank BRI (VA)' }
                )
              }
              if (value.doku_type == 'debit') {
                this.options.push(
                  { value: 15, text: 'Credit Card (VISA, Master Card, JCB)' }
                )
              }
            })
          }
          if (this.dataBusiness.dokuClientIdQris) {
            this.clientIdQR = this.dataBusiness.dokuClientIdQris
            this.mallIdQR = this.dataBusiness.dokuSharedKeyQris
            this.clientSecret = dokuclientSecret
            resultPayment.map(value => {
              if (value.doku_type == 'qr') {
                this.options.push(
                  { value: 0, text: 'QRIS' }
                )
              }
            })
          }
        }
        if (this.dataBusiness.czEntityId) {
          this.paymentGateway = 'cz'
        }
      }
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

      this.enableWaiting = false
      console.log('add transaction')
      console.log('final data getcart', this.getCart)
      const tempItems = []
      const receiptId = 'ORDER_' +
      this.dataBusiness.outletId +
      ':' +
      localStorage.getItem('customer_account_id') || null +
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
        customer_account_id: localStorage.getItem('customer_account_id') || null,
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
      console.log('cek selected', this.selected)
      if (this.selected.value === 0) {
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
      localStorage.getItem('customer_account_id') || null +
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
        customer_account_id: localStorage.getItem('customer_account_id') || null,
        payment_method_id: paymentMethodId,
        payment_discount: 0,
        payment_tax: this.handleAllAmount.tax,
        payment_service: this.handleAllAmount.service,
        payment_total: this.handleAllAmount.paymentTotal,
        amount: this.handleAllAmount.resultAmount,
        payment_change: 0,
        invoice: this.TRANSIDMERCHANT,
        status: 'done'
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
      this.$router.push({ name: 'DetailCart', params: { idCart: id } })
    },
    decrement (id) {
      console.log('decrement', id)
      const tempData = this.getCart[id]
      if (tempData.totalItem > 1) {
        this.pushToDetailCart(id)
        tempData.totalItem = tempData.totalItem - 1
        this.getCart[id].totalAmount = this.getCart[id].priceItem * this.getCart[id].totalItem
        console.log('getCart', this.getCart)
      } else {
        this.getCart.splice(id, 1)
      }
    },
    increment (id) {
      this.pushToDetailCart(id)
      console.log('increment', id)
      const tempData = this.getCart[id]
      tempData.totalItem = tempData.totalItem + 1
      this.getCart[id].totalAmount = this.getCart[id].priceItem * this.getCart[id].totalItem
      console.log('getCart', this.getCart)
    },
    deleteCart (id) {
      this.getCart.splice(id, 1)
    }
  },
  computed: {
    ...mapGetters(['getCart']),
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
.item-cart{
  cursor: pointer;
}
.item-cart:hover{
  transform: scale(1.005);
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
.wrapper-action{
  width: 22%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
}
.total-item{
  height: 20px;
  background-color: #623863;
  color: white;
  padding: 0 10px;
  border-radius: 6px;
  padding-bottom: 3px;
}
.btn-delete-cart{
  margin-top: 10%;
}
.desc-item{
  flex: 4;
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
  align-items: space-between;
  background-color: #623863;
  color: white;
  font-size: 14px;
  padding: 6px 0;
  border-radius: 10px;
}
.desc-price{
  width: 100%;
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
  width: 60%;
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
    width: 60%;
  }
  .header-custom-modal {
    background-color: white;
  }
  .modal-box{
    width: 85%;
  }
}
@media only screen and (max-width: 495px) {
  .modal-box{
    border: 1px solid;
    width: 95%;
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
}
</style>
