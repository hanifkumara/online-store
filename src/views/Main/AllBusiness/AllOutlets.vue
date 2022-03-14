<template>
  <div>
    <div class="top-title d-flex justify-content-between align-items-end">
      <div class="all-merchant">
        All Merchant
      </div>
      <div class="wrapper-beetstore-logo">
        <!-- <div class="wrapper-logo">
          <img src="@/assets/images/Beet Store.png" alt="Logo BeetPOS">
        </div>
        <div class="store">STORE</div> -->
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center mt-2">
            <div class="badge badge-info mr-2" v-if="this.data_table" @click="pushToMenuScan">
              {{dataBusiness.businessName}} - {{dataBusiness.outletName}}
            </div>
            <div v-else></div>
            <div class="d-flex">
              <div class="wrapper-dropdown">
                <div class="wrapper-icon-back" @click="showDropdown = !showDropdown" tabindex="0" @blur="handleBlur">
                  <img src="@/assets/images/user.png" alt="User">
                </div>
                <transition name="list">
                  <div class="dropdown" v-show="showDropdown">
                    <!-- <div class="d-flex align-items-start hover-dropdown" @click="pushToProfile">
                      <div class="wrapper-icon-dropdown">
                        <img src="@/assets/images/icons8-settings-208.png" alt="">
                      </div>
                      <div class="setting ml-3">
                        Settings
                      </div>
                    </div>
                    <div class="d-flex align-items-start mt-2 hover-dropdown" @click="pushToHistory">
                      <div class="wrapper-icon-dropdown">
                        <img src="@/assets/images/icons8-activity-history-96.png" alt="">
                      </div>
                      <div class="history ml-3">
                        History
                      </div>
                    </div> -->
                    <div class="d-flex align-items-start mt-2 hover-dropdown"  @click="handleLogout">
                      <div class="wrapper-icon-dropdown">
                        <img src="@/assets/images/icons8-sign-out-52.png" alt="Logout">
                      </div>
                      <div class="logout ml-3">
                        Logout
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div class="wrap-input mb-4">
            <input type="text" v-model="search" placeholder="Search . . ." >
            <div class="wrapper-icon">
              <img src="@/assets/images/icons8-search-480.png" alt="Search">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <Loading v-show="enableLoading"/>
            <div class="wrapper-list-outlet">
              <div class="list-outlet" v-for="(data, index) in allOutlet" :key="index">
                <!-- <div class="outlet-closed" v-show="data.statusOutlet === 'close' || data.statusOutlet === 'vacation'">
                  <div class="text-danger text-closed">Closed</div>
                </div> -->
                <div @click="pushToMenu(data)">
                  <div class="top">
                    <div class="container-image">
                      <div class="wrapper-image" v-if="data.imageOutlet">
                        <img :src="data.imageOutlet" alt="Image Outlet" @error="handlePlaceholderImg">
                      </div>
                      <div class="wrapper-image" v-else>
                        <img src="@/assets/images/websiteplanet-dummy-outlet-noimage-540X400.png" alt="No Image">
                      </div>
                    </div>
                    <div class="desc-outlet">
                      <div class="d-flex">
                        <div class="name-business-outlet">
                          {{data.businessName}} - {{data.outletName}}
                        </div>
                      </div>
                      <div class="no-hp">
                        {{data.phoneNumber}}
                      </div>
                      <div class="address">
                        {{data.address}}
                      </div>
                    </div>
                  </div>
                  <div class="total-transaction">
                    <!-- Total Transaction <span class="ml-1 font-weight-bold">{{data.count | numFormat}}</span> -->
                  </div>
                </div>
              </div>
              <!-- <div v-if="allOutlet.length" v-observe-visibility="handleScroll" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../../../components/Loading.vue'
import dayjs from 'dayjs'

export default {
  name: 'AllOutlets',
  components: {
    Loading
  },
  data: () => {
    return {
      enableLoading: false,
      search: '',
      allOutlet: [],
      customerAccountId: localStorage.getItem('customer_account_id'),
      data_table: localStorage.getItem('data_table'),
      showDropdown: false,
      dataBusiness: {},
      pages: 1,
      lastPage: 1
    }
  },
  mounted () {
    this.handleAllBusiness()
    this.handleBackMenuScan()
  },
  methods: {
    handleScroll (isVisibility) {
      if (!isVisibility) { return }
      if (this.pages >= this.lastPage) { return }

      this.pages++

      this.handleAllBusiness()
    },
    async handleBackMenuScan () {
      if (localStorage.getItem('data_table')) {
        const dataTable = JSON.parse(this.data_table)
        console.log('dataTable', dataTable)

        // result table hanya mendapatkan outlet id nya saja
        const resultTable = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/table-management/table-guest/${dataTable.tableId}/${dataTable.businessId}`)

        const resultBusiness = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/business/${dataTable.businessId}`)
        const outletId = resultTable.data.data.outlet_id
        const resultOutlet = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/outlet/${outletId}`)
        this.dataBusiness = {
          businessName: resultBusiness.data.data.name,
          outletName: resultOutlet.data.data.name
        }
      }
    },
    async handleAllBusiness () {
      try {
        this.enableLoading = true
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/business-noverify/all-outlets`)

        const resultAllBusiness = response.data.data.data

        resultAllBusiness.map(value => {
          value.imageOutlet = value.imageOutlet ? `${process.env.VUE_APP_API_URL}/upload/${value.imageOutlet}` : null
        })

        console.log("resultAllBusiness", resultAllBusiness)

        this.allOutlet.push(...resultAllBusiness)
        this.enableLoading = false
      } catch (error) {
        this.enableLoading = false
        console.log('error', error)
      }
    },
    handleBlur () {
      this.showDropdown = !this.showDropdown
    },
    pushToMenuScan () {
      const dataTable = JSON.parse(localStorage.getItem('data_table'))
      this.$router.push({ name: 'Menu', params: { tableId: dataTable.tableId } })
    },
    handlePlaceholderImg (e) {
      e.target.src = 'https://via.placeholder.com/250'
    },
    pushToMenu (data) {
      console.log('datanya', data)
      this.$router.push({ name: 'ProductOutlet', params: { idBusiness: data.businessId, idOutlet: data.outletId } })
    },
    goBack () {
      this.$router.go(-1)
    },
    handleLogout () {
      localStorage.clear()
      this.$router.push({ name: 'Auth' })
      Swal.fire('Logout success', 'please come back', 'success')
    },
    pushToSignup () {
      // do nothing
    },
    pushToProfile () {
      this.$router.push({ name: 'Account' })
    },
    pushToHistory () {
      this.$router.push({ name: 'HistoryTransaction' })
    }
  },
  watch: {
    search (val) {
      if (val) {
        console.log(val)
        const searchName = []
        this.allOutlet.map(value => {
          if (value.outletName.toLowerCase().includes(val.toLowerCase())) {
            searchName.push(value)
          }
        })
        this.allOutlet = []
        searchName.map(value => this.allOutlet.push(value))
      } else {
        this.allOutlet = []
        return this.handleAllBusiness()
      }
    }
  }
}
</script>

<style scoped>
.badge{
  cursor: pointer;
}
.badge:hover{
  transform: scale(1.05);
}
.top-title{
  padding: 0 10%;
}
.all-merchant{
  font-size: 34px;
  font-weight: 600;
  color: #623863;
}
.content{
  height: 525px;
  overflow-y: scroll;
}
.wrapper-beetstore-logo{
  display: flex;
  justify-content: center;
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
.wrapper-list-outlet{
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.list-outlet{
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 31%;
  background-color: white;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px 1px #d4cece;
}
.list-outlet > .outlet-closed {
  background-color: rgba(150, 145, 145, 0.521);
  border-radius: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
}
.text-closed{
  margin-top: 10px;
  margin-left: 10px;
}
.list-outlet:hover{
  box-shadow: 0 0 12px 6px #d4cece;;
}
.bg-white{
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 15px;
}
.wrapper-icon-back{
  cursor: pointer;
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-bottom: 30px;
}
.wrapper-icon-back > img:hover{
  transform: scale(1.06);
}
.wrapper-icon-back > img{
  width: 100%;
  height: 100%;
}
.wrapper-image{
  width: 100%;
  height: 220px;
  border-radius: 10px 10px 0 0;
}
.wrapper-image > img {
  width: 100%;
  border-radius: 10px 10px 0 0;
  height: 100%;
  object-fit: cover;
}
.desc-outlet{
  width: 100%;
  padding: 10px;
}
.total-transaction{
  display: flex;
  font-size: 19px;
  padding: 0 10px 10px 10px;
}

.name-business-outlet{
  font-size: 21px;
  font-weight: 700;
}
.wrapper-dropdown{
  position: relative;
}
.dropdown{
  position: absolute;
  top: 25px;
  right: 0;
  background-color: #623863;
  color: white;
  z-index: 999;
  padding: 10px 20px;
  border-radius: 10px;
  width: 200;
}
.list-enter,
.list-leave-to {
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}
.wrapper-icon-dropdown{
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.wrapper-icon-dropdown > img{
  width: 100%;
  height: 100%;
}
.setting, .history, .logout {
  font-size: 17px;
}
.hover-dropdown:hover{
  cursor: pointer;
}
@media screen and (max-width: 1125px) {
  .list-outlet{
    width: 48%;
    margin-bottom: 10px;
  }
}
@media screen and (max-width: 495px) {
  .top-title{
    padding: 0 2%;
  }
  .all-merchant{
    margin-left: 3%;
    font-size: 19px;
    font-weight: 600;
    color: #623863;
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
  .wrapper-icon{
    right: 14px;
    top: 0;
    width: 15px;
    height: 15px;
  }
  .wrapper-list-outlet{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .container-image{
   width: 100%;
  }
  .wrapper-image{
    height: 120px;
  }
  .desc-outlet{
    padding: 10px;
  }
  .name-business-outlet{
    font-size: 12px;
  }
  .no-hp{
    font-size: 12px;
    font-weight: 400;
  }
  .address{
    font-size: 10px;
    font-weight: 400;
  }
  .total-transaction{
    display: flex;
    font-size: 11px;
    padding: 0 10px 10px 10px;
  }
  .dropdown{
    right: 0;
    padding: 15px 20px;
    border-radius: 10px;
    width: auto;
  }
  .wrapper-icon-dropdown{
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
  .setting, .history, .logout {
    font-size: 15px;
  }
}
</style>
