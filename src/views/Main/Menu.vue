<template>
  <div>
    <div class="top-color" />
    <div class="d-flex justify-content-end">
      <div class="wrapper-logo">
        <img src="@/assets/images/396 PPI-06 1.png" alt="Logo BeetPOS">
      </div>
    </div>
    <div class="bg-orange">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="d-flex justify-content-between align-items-end">
              <h4 class="name-business-outlet">{{dataBusiness.businessName}} - {{dataBusiness.outletName}}</h4>
                <!-- <div class="d-flex align-items-center" v-if="customerAccountId"> -->
                  <div @click="pushToAllMerchant" class="badge badge-info all-merchant mr-2">See All Merchant</div>
                  <router-link :to="{name: 'Cart'}">
                    <div class="wrapper-icon-cart">
                      <div v-if="totalItem > 0">
                        <div class="count-notif">
                          {{totalItem}}
                        </div>
                      </div>
                      <img src="@/assets/images/shopping-cart.png" alt="Cart">
                    </div>
                  </router-link>
                <!-- </div> -->
                <!-- <div v-else>
                  <div @click="pushToAllMerchant" class="badge badge-info all-merchant">See All Merchant</div>
                </div> -->
            </div>
            <hr />
            <div class="wrap-input">
              <input type="text" v-model="search" placeholder="Search . . ." >
              <div class="wrapper-icon">
                <img src="@/assets/images/icons8-search-480.png" alt="Search">
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-12">
            <div class="wrapper-link-category">
              <router-link :to="{name: 'AllMenu'}" >
                <div class="title-category">All</div>
              </router-link>
              <router-link v-for="(data, i) in allCategory" :key="i" :to="{name: 'Category', params: {categoryName: data.toLowerCase()}}" class="ml-2">
                <div class="title-category">{{data}}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div v-if="enableLoading">
      <Loading />
    </div>
    <div v-else class="wrapper-router">
      <router-view :resultProduct="resultProduct" :dataBusiness="dataBusiness"/>
    </div>
    <!-- <div v-if="allPromos.length > 0" class="wrapper-promo">
      <h6 class="available-promo mt-3">Available Promo</h6>
      <div class=" d-flex">
        <div v-for="(data, index) in allPromos" :key="index">
          <div class="wrapper-image-promo">
            <img src="@/assets/images/unnamed.jpg" alt="Image Promo">
            <img @mouseover="hover='A a aisiteru'" @mouseleave="hover=''" :src="data.imagePromo" alt="Image Promo">
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import Loading from '../../components/Loading.vue'

export default {
  name: 'Menu',
  mounted () {
    this.getProduct()
    console.log('this.getCart', this.getCart)
    console.log('this.getCart.length', this.getCart.length)
  },
  components: {
    Loading
  },
  data () {
    return {
      enableLoading: false,
      customerAccountId: localStorage.getItem('customer_account_id') || null,
      hasPromo: true,
      resultProduct: [],
      allPromos: [],
      tableId: this.$route.params.tableId,
      allCategory: [],
      search: '',
      dataBusiness: {},
      totalItem: null
    }
  },
  methods: {
    async getProduct () {
      try {
        this.enableLoading = true

        const dataTable = JSON.parse(localStorage.getItem('data_table'))
        console.log('dataTable', dataTable)

        // result table hanya mendapatkan outlet id nya saja
        const resultTable = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/table-management/table-guest/${dataTable.tableId}/${dataTable.businessId}`)

        const resultBusiness = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/business/${dataTable.businessId}`)
        const outletId = resultTable.data.data.outlet_id
        const resultOutlet = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/outlet/${outletId}`)
        axios.get(`${process.env.VUE_APP_API_URL}/api/v1/promo/${outletId}`)
          .then(result => {
            const resultPromo = []
            result.data.data.map(value => {
              if (value.special_promo_id) {
                value.Special_Promo.image = `${process.env.VUE_APP_API_URL}/${value.Special_Promo.image}`
                resultPromo.push({ typePromo: value.Promo_Category.name, descPromo: value.Promo_Category.description, namePromo: value.Special_Promo.name, imagePromo: value.Special_Promo.image })
              } else if (value.voucher_promo_id) {
                value.Voucher_Promo.image = `${process.env.VUE_APP_API_URL}/${value.Voucher_Promo.image}`
                resultPromo.push({ typePromo: value.Promo_Category.name, descPromo: value.Promo_Category.description, namePromo: value.Voucher_Promo.name, imagePromo: value.Voucher_Promo.image })
              } else if (value.automatic_promo_id) {
                value.Automatic_Promo.image = `${process.env.VUE_APP_API_URL}/${value.Automatic_Promo.image}`
                resultPromo.push({ typePromo: value.Promo_Category.name, descPromo: value.Promo_Category.description, namePromo: value.Automatic_Promo.name, imagePromo: value.Automatic_Promo.image })
              }
            })
            console.log('promo outlet', value)
            resultPromo.map(value => this.allPromos.push(value))
          })
          .catch(e => {
            console.log('errorya', e)
          })
        console.log('this.allPromos', this.allPromos)
        console.log('Data Business', resultBusiness.data.data)
        console.log('Outlet Name', resultOutlet.data.data.name)
        const tempDataBusiness = {
          businessId: dataTable.businessId,
          outletId: outletId,
          businessName: resultBusiness.data.data.name,
          outletName: resultOutlet.data.data.name
        }
        if (resultBusiness.data.data.doku_client_id && resultBusiness.data.data.doku_shared_key) {
          tempDataBusiness.dokuClientId = resultBusiness.data.data.doku_client_id
          tempDataBusiness.dokuSharedKey = resultBusiness.data.data.doku_shared_key
        }
        if (resultBusiness.data.data.doku_client_id_qris && resultBusiness.data.data.doku_shared_key_qris && resultBusiness.data.data.doku_client_secret) {
          tempDataBusiness.dokuClientIdQris = resultBusiness.data.data.doku_client_secret
          tempDataBusiness.dokuSharedKeyQris = resultBusiness.data.data.doku_client_secret
          tempDataBusiness.dokuclientSecret = resultBusiness.data.data.doku_client_secret
        }
        if (resultBusiness.data.data.cz_entity_id && resultBusiness.data.data.cz_vendor_identifier) {
          tempDataBusiness.czEntityId = resultBusiness.data.data.cz_entity_id
          tempDataBusiness.czVendorIdentifier = resultBusiness.data.data.cz_vendor_identifier
          tempDataBusiness.czUser = resultBusiness.data.data.cz_user
        }
        this.dataBusiness = tempDataBusiness
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/product?outlet_id=${outletId}`)
        const result = data.data.filter(
          (val) => val.outlet_id === outletId
        )
        const containerCategory = []
        const uniqueArray = []
        result.map(value => {
          if (value.product_category_id && !value.Product_Category.hidden) {
            containerCategory.push(value.Product_Category.name)
          }
        })
        containerCategory.map(value => {
          if (uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value)
          }
        })
        uniqueArray.map((val) => this.allCategory.push(val))
        console.log('allcategory', this.allCategory)
        console.log('result product: ', result)
        result.map(value => {
          if (value.image) {
            value.image = `${process.env.VUE_APP_API_URL}/${value.image}`
          }
        })
        const handleHiddenCategory = result.filter(value => {
          console.log('handleHiddenCategory', value)
          if (value.Product_Category) {
            if (!value.Product_Category.hidden) {
              return value
            }
          } else {
            return value
          }
        })
        console.log('handleHiddenCategory', handleHiddenCategory)
        handleHiddenCategory.map(value => this.resultProduct.push(value))

        this.enableLoading = false
      } catch (error) {
        this.enableLoading = false
        console.log('error => ', error)
      }
    },
    pushToAllMerchant () {
      console.log('wew')
      console.log(this.totalItem)
      if (this.totalItem > 0) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Are you sure you want to delete the product in the cart',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store.commit('SET_CART', null)
            this.$router.push({ name: 'MainAllbusiness' })
          }
        })
      } else {
        this.$store.commit('SET_CART', null)
        this.$router.push({ name: 'MainAllbusiness' })
      }
    }
  },
  computed: {
    ...mapGetters(['getCart'])
  },
  watch: {
    search (val) {
      if (val) {
        const searchName = []
        this.resultProduct.map(value => {
          if (value.name.toLowerCase().includes(val.toLowerCase())) {
            searchName.push(value)
          }
        })
        this.resultProduct = []
        searchName.map(value => this.resultProduct.push(value))
      } else {
        this.allCategory = []
        this.resultProduct = []
        return this.getProduct()
      }
    },
    getCart (val) {
      console.log(val)
      this.totalItem = val.length
      console.log('watch getCart')
    }
  }
}
</script>

<style scoped>
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
.top-color{
  background-color: #623863;
  width: 100%;
  height: 10px;
}
.wrapper-logo{
  margin-top: 20px;
  margin-right: 20px;
  width: 200px;
  object-fit: contain;
}
.wrapper-logo > img{
  width: 100%;
}

a{
  color: black;
  text-decoration-line: none;
}
a.router-link-active {
  color: #623863;
  font-weight: 700;
  position: relative;
}
a.router-link-active::after {
  position: absolute;
  content: '';
  height: 5px ;
  width: 100%;
  bottom: -10px;
  left: 0;
  right: 0;
  background: #623863;
}
.bg-orange{
  padding-top: 20px;
}
.wrap-input{
  position: relative;
}
.wrap-input > input{
  border: 1.5px solid #623863;
  width: 100%;
  padding: 4px 20px;
  padding-right: 50px;
  border-radius: 10px;
}
.wrap-input > input:focus{
  outline: none;
  box-shadow: 0px 3px 5px black;
}
.wrapper-icon{
  position: absolute;
  right: 14px;
  top: 4px;
  width: 25px;
  height: 25px;
}
.wrapper-icon > img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.wrapper-router{
  /* height: 525px; */
  overflow: scroll;
  overflow-x: hidden;
}
.wrapper-link-category{
  display: flex;
  align-items: start;
  flex-wrap: nowrap;
  width: 100%;
  height: 50px;
  overflow: auto;
}
.title-category{
  display: flex;
  justify-content: start;
  white-space: nowrap
}
::-webkit-scrollbar {
  width: 4px;
  height: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(177, 177, 177);
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #808080;
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
.all-merchant{
  cursor: pointer;
}
.all-merchant:hover{
  transform: scale(1.05);
}
@media only screen and (max-width: 495px) {
  .all-merchant{
    font-size: 9px;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .title-category{
    font-size: 11px;
  }
  .wrapper-logo{
    width: 140px;
    margin-top: 10px;
    margin-right: 10px;
  }
  .bg-orange{
    padding-top: 10px;
  }
  .wrapper-link-category{
    height: 30px;
  }
  .name-business-outlet{
    font-size: 16px;
  }
  .wrap-input > input{
    border: .5px solid #623863;
    padding: 1px 5px;
    padding-right: 20px;
    border-radius: 10px;
    font-size: 12px;
  }
  .wrapper-icon{
    right: 8px;
    top: 0;
    width: 16px;
    height: 16px;
  }
  .wrapper-promo{
    background-color: #c4b8c4;
    overflow-x: auto;
    padding: 0 30px;
    padding-bottom: 30px;
  }
  .wrapper-image-promo{
    margin: 5px 0;
    margin-right: 15px;
    width: 160px;
    height: 90px;
    object-fit: cover;
  }
  .wrapper-image-promo > img{
    width: 100%;
    border-radius: 10px;
    height: 100%;
  }
  .available-promo{
    font-size: 13px;
  }
}
</style>
