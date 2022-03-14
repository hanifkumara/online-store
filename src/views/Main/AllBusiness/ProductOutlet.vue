<template>
  <div>
    <div class="top-title d-flex justify-content-end">
      <!-- <div class="wrapper-beetstore-logo">
        <div class="wrapper-logo">
          <img src="@/assets/images/Beet Store.png" alt="Logo BeetPOS">
        </div>
        <div class="store">STORE</div>
      </div> -->
    </div>
    <div v-if="enableLoading">
      <Loading />
    </div>
    <div v-else>
      <div v-if="resultProduct.length > 0">
        <div class="container">
          <div class="row mt-4">
            <div class="col-md-12">
              <div class="d-flex justify-content-between align-items-end">
                <div>
                  <h4 class="name-business-outlet" v-if="titleOutlet.businessName || titleOutlet.outletName">{{titleOutlet.businessName}} - {{titleOutlet.outletName}}</h4>
                  <div class="wrapper-icon-back" @click="goBack">
                    <img src="@/assets/images/back-arrow.png" alt="Back">
                  </div>
                </div>
                <router-link :to="{name: 'CartNoscan'}">
                    <div class="wrapper-icon-cart">
                      <!-- <div v-if="getTotalItem > 0">
                        <div class="count-notif">
                          {{getTotalItem}}
                        </div>
                      </div> -->
                      <img src="@/assets/images/shopping-cart.png" alt="Cart">
                    </div>
                  </router-link>
              </div>
              <hr />
              <div class="wrap-input mb-1">
                <input type="text" v-model="search" placeholder="Search . . ." >
                <div class="wrapper-icon">
                  <img src="@/assets/images/icons8-search-480.png" alt="Search">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container list-menu">
          <div class="row my-2">
            <div class="col-md-12">
              <div class="wrapper-link-category">
                <router-link :to="{name: 'AllMenuNoscan'}" >
                  <div class="title-category">All</div>
                </router-link>
                <router-link v-for="(data, i) in allCategory" :key="i" :to="{name: 'CategoryNoscan', params: {categoryName: data.toLowerCase()}}" class="ml-2">
                  <div class="title-category">{{data}}</div>
                </router-link>
              </div>
            </div>
          </div>
          <hr />
          <router-view :resultProduct="resultProduct"/>
        </div>
      </div>
      <div v-else >
        <div class="wrapper-icon-back ml-4" @click="goBack">
          <img src="@/assets/images/back-arrow.png" alt="Back">
        </div>
        <div class="dont-have-product">
          <div class="text-muted">Merchant don't have a Product</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import Loading from '../../../components/Loading.vue'

export default {
  name: 'ProductOutlet',
  components: {
    Loading
  },
  data: () => {
    return {
      enableLoading: true,
      titleOutlet: {},
      resultProduct: [],
      search: '',
      allCategory: [],
      totalItem: null
    }
  },
  mounted () {
    this.handleAllProduct()
  },
  methods: {
    handlePlaceholderImg (e) {
      e.target.src = 'https://via.placeholder.com/250'
    },
    async handleAllProduct () {
      try {
        this.enableLoading = true
        const idBusiness = this.$route.params.idBusiness
        const idOutlet = this.$route.params.idOutlet
        localStorage.setItem('main_data', JSON.stringify({ idBusiness, idOutlet }))

        console.log(`${idBusiness}, ${idOutlet}`)
        const dataBusiness = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/business-noverify/${idBusiness}`)
        const dataOutlet = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/outlet-noverify/${idOutlet}`)
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/product-noverify/online-store?businessId=${idBusiness}&outletId=${idOutlet}`)
        this.titleOutlet = {
          businessName: dataBusiness.data.data.name,
          outletName: dataOutlet.data.data.name
        }
        const resProduct = data.data.result
        resProduct.map(value => {
          value.image = `${process.env.VUE_APP_API_URL}/upload/${value.image}`
        })
        const result = resProduct.filter(
          (val) => {
            console.log(val.outletId == idOutlet)
            return val.outletId == idOutlet
          }
        )
        console.log('result', result)
        const containerCategory = []
        const uniqueArray = []
        result.map(value => {
          console.log('result value category', value)
          if (value.productCategoryId && value.ProductCategory.status) {
            containerCategory.push(value.ProductCategory.name)
          }
        })
        containerCategory.map(value => {
          if (uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value)
          }
        })
        uniqueArray.map((val) => this.allCategory.push(val))

        const handleHiddenCategory = resProduct.filter(value => {
          if (value.ProductCategory) {
            if (value.ProductCategory.status) {
              return value
            }
          } else {
            return value
          }
        })
        handleHiddenCategory.map(value => this.resultProduct.push(value))
        this.enableLoading = false
      } catch (error) {
        this.enableLoading = false
        console.log('error =>', error)
      }
    },
    goBack () {
      if (this.getTotalItem > 0) {
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
    ...mapGetters(['getCart', 'getTotalItem'])
  },
  watch: {
    search (val) {
      if (val) {
        console.log(val)
        const searchName = []
        this.resultProduct.map(value => {
          if (value.name.toLowerCase().includes(val.toLowerCase())) {
            searchName.push(value)
          }
        })
        this.resultProduct = []
        searchName.map(value => this.resultProduct.push(value))
      } else {
        this.resultProduct = []
        return this.handleAllProduct()
      }
    }
  }
}
</script>

<style scoped>
.top-title{
  padding: 0 10%;
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
.list-menu{
  height: 525px;
  overflow-y: scroll;
}
.wrapper-link-category{
  display: flex;
  align-items: start;
  flex-wrap: nowrap;
  width: 100%;
  height: 50px;
  overflow: auto;
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
.dont-have-product{
  height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrapper-beetstore-logo{
  display: flex;
  align-items: center;
  /* d-flex align-items-center */
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
.wrapper-icon{
  position: absolute;
  right: 14px;
  top: 4px;
  width: 25px;
  height: 25px;
}
.wrapper-icon-back{
  cursor: pointer;
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.wrapper-icon-back:hover{
  transform: scale(1.05);
}
.wrapper-icon-back > img{
  width: 100%;
  height: 100%;
}
.wrapper-icon > img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.title-category{
  display: flex;
  justify-content: start;
  white-space: nowrap
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
.wrapper-logo > img{
  width: 100%;
}
@media only screen and (max-width: 495px) {
  .top-title{
    padding: 0 2%;
  }
  .wrapper-link-category{
    height: 30px;
  }
  .title-category{
    font-size: 11px;
  }
  .wrapper-icon{
    right: 14px;
    top: 0;
    width: 15px;
    height: 15px;
  }
  .price-product{
    font-size: 12px;
  }
  .dont-have-product{
    font-size: 19px;
    font-weight: 700;
  }
  .name-business-outlet{
    font-size: 16px;
  }
  .store{
    font-size: 1.8rem;
    margin-bottom: -13px;
  }
  .wrapper-logo{
    width: 80px;
    margin-top: 10px;
  }
  .wrap-input > input{
    padding: 2px 12px;
    font-size: 12px;
  }
}
</style>
