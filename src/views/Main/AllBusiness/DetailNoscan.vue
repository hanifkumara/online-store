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
    <div class="container list-menu">
      <div class="row">
        <div class="col-md-12 d-flex -items-center">
          <div class="image-product mr-4">
            <div class="wrapper-image" v-if="product.image">
              <img :src="product.image" alt="Product Image" @error="handlePlaceholderImg">
            </div>
            <div class="wrapper-image" v-else>
              <img src="@/assets/images/websiteplanet-dummy-540X400.png" alt="Product Image">
            </div>
          </div>
          <div>
            <div class="text-name">Name: {{product.name}}</div>
            <div v-if="product.productCategoryId">
              <div class="text-category">Category: {{product.ProductCategory.name}}</div>
            </div>
            <div v-else>
              <div class="text-category">Category: no category</div>
            </div>
            <div class="text-price">Price: Rp. {{product.price | numFormat}}</div>
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-12">
          <div v-if="product.description == null">
            <h5 class="description">Description</h5>
          </div>
          <div v-else class="description-product">
            <h5 class="description">Description :</h5>
            <p class="content-description">{{product.description}}</p>
          </div>
        </div>
      </div>
      <hr />
      <div class="row mt-2">
        <div class="col-md-12">
          <h4>Notes <span class="text-muted">(optional)</span></h4>
          <textarea name="notes" id="notes" v-model="notes" rows="3"></textarea>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center">
            <div class="total-item">
              <div class="icon-minus" @click="decrement">-</div>
              {{totalItem}}
              <div class="icon-plus" @click="increment">+</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-12">
            <div class="button-add-cart" @click="addCart">
              Add Cart
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: 'DetailNoscan',
  data: () => {
    return {
      paymentAvailable: false,
      product: {},
      isActive: false,
      handleSelect: [],
      allSelectAddOns: [],
      selectedSize: 1,
      selectedTopping: 1,
      allAddons: [],
      totalItem: 1,
      customerAccountId: localStorage.getItem('customer_account_id'),
      notes: '',
      size: [
        {
          id: 1,
          name: 'Standart',
          price: 0
        },
        {
          id: 2,
          name: 'Large',
          price: 2000
        },
        {
          id: 3,
          name: 'Extra Large',
          price: 4000
        }
      ],
      topping: [
        {
          id: 1,
          name: 'Bobba',
          price: 3000
        },
        {
          id: 2,
          name: 'Jelly',
          price: 3000
        }
      ],
      dataBusiness: {}
    }
  },
  mounted () {
    this.handleGetProduct()
    this.handleDataBusiness()
    console.log('allSelectAddOns', this.allSelectAddOns)
  },
  methods: {
    ...mapMutations(['SET_INCREMENT_CART']),
    async handleDataBusiness () {
      const data = JSON.parse(localStorage.getItem('main_data'))
      const resultOutlet = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/outlet-noverify/${data.idOutlet}`)
      const resultBusiness = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/business-noverify/${data.idBusiness}`)
      const resDataBusiness = {
        businessName: resultBusiness.data.data.name,
        outletName: resultOutlet.data.data.name
      }
      this.dataBusiness = resDataBusiness
      this.handlePaymentMethod(resultBusiness.data.data)
    },
    async handlePaymentMethod (business) {
      try {
        console.log('businessnye', business)
        if (business.cz_entity_id || business.doku_client_id) {
          this.paymentAvailable = true
        } else {
          this.paymentAvailable = false
        }
      } catch (error) {
        this.paymentAvailable = false
      }
    },
    async handleGetProduct () {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/product-noverify/find-product/${this.$route.params.id}`)
      console.log('data.data', data.data)
      if (data.data.image) {
        data.data.image = `${process.env.VUE_APP_API_URL}/upload/${data.data.image}`
      } else {
        data.data.image = ''
      }
      console.log('data ===>', data.data)
      this.product = data.data
    },
    handlePlaceholderImg (e) {
      e.target.src = 'https://via.placeholder.com/250'
    },

    handleSelectAllAddons (data2, index, dataGroup) {
      const data2_temp = data2
      data2_temp.group_id = dataGroup.id
      if (this.allSelectAddOns.length == 0) {
        console.log('first Time')
        this.$set(this.handleSelect, index, `${index},${data2_temp.id}`)
        this.allSelectAddOns.push(data2_temp)
      } else {
        let sameIndex = 0
        let same_group = false

        this.allSelectAddOns.map((value, i) => {
          if (value.group_id === data2_temp.group_id) {
            same_group = true
            sameIndex = i

            console.log('value group id', value.group_id)
            console.log('data2 group id', data2_temp.group_id)
            console.log('i', i)
            // delete
          } else {

          }
        })

        if (same_group) {
          this.allSelectAddOns.splice(sameIndex, 1)
          this.$set(this.handleSelect, index, `${index},${data2_temp.id}`)
          this.allSelectAddOns.push(data2_temp)
        } else { // handle if not same group
          this.$set(this.handleSelect, index, `${index},${data2_temp.id}`)
          this.allSelectAddOns.push(data2_temp)
        }
      }
    },
    myFilter: function () {
      this.isActive = !this.isActive
      console.log('hello myFilter')
    },
    goBack () {
      this.$router.go(-1)
    },
    decrement () {
      console.log('decrement')
      if (this.totalItem > 0) {
        this.totalItem = this.totalItem - 1
      } else {

      }
    },
    increment () {
      console.log('increment')
      this.totalItem = this.totalItem + 1
    },
    addCart () {
      // if (this.customerAccountId) {
      if (this.totalItem > 0) {
        const addons = []
        const priceAddons = []
        let totalPriceAddons = null
        this.allSelectAddOns.map(val => addons.push(val))
        this.allSelectAddOns.map(val => priceAddons.push(val.price))
        if (priceAddons.length > 0) {
          const result = priceAddons.reduce((acc, curr) => {
            return acc + curr
          })
          totalPriceAddons = result
        }
        const amount = totalPriceAddons + this.product.price
        const dataCart = {
          idItem: this.product.id,
          nameItem: this.product.name,
          priceItem: amount,
          descriptionItem: this.product.description ? this.product.description : null,
          imageItem: this.product.image ? this.product.image : null,
          totalItem: this.totalItem,
          updateAddons: this.handleSelect,
          fullDataAddons: addons,
          fullDataProduct: this.product,
          allAddons: this.allAddons,
          totalAmount: amount * this.totalItem,
          notes: this.notes,
          salesTypeId: this.getSalesType
        }

        const tempGetCart = this.getCart

        const tempFinalCart = tempGetCart
        let has_allSame = false
        let totalQuantity = this.totalItem
        let totalPrice = amount * this.totalItem

        tempGetCart.map((value, index) => {
          let sameProduct = false
          let sameNote = false
          let sameAddons = false
          let sameSalesType = false
          let loop_fullDataAddonsLength = 0
          if (value.fullDataAddons) {
            if (value.fullDataAddons.length > 0) {
              loop_fullDataAddonsLength = value.fullDataAddons.length
            }
          }

          let dataCart_fullDataAddonsLength = 0
          if (dataCart.fullDataAddons) {
            if (dataCart.fullDataAddons.length > 0) {
              dataCart_fullDataAddonsLength = dataCart.fullDataAddons.length
            }
          }

          if (loop_fullDataAddonsLength == dataCart_fullDataAddonsLength) {
            if (dataCart_fullDataAddonsLength == 0) {
              sameAddons = true
            } else {
              let correct_match = 0
              dataCart.fullDataAddons.map((v1, i1) => {
                value.fullDataAddons.map((v2, i2) => {
                  if (v1.id == v2.id) {
                    correct_match = correct_match + 1
                  }
                })

                if (correct_match == dataCart_fullDataAddonsLength) {
                  sameAddons = true
                }
              })
            }
          }

          if (value.idItem == dataCart.idItem) {
            sameProduct = true
            if (value.notes == dataCart.notes) {
              sameNote = true
            }
            console.log('same product')
            if (value.salesTypeId == dataCart.salesTypeId) {
              sameSalesType = true
              console.log('same sales type id')
            }
          }

          if (sameProduct && sameNote && sameAddons && sameSalesType) {
            has_allSame = true
            totalQuantity = totalQuantity + value.totalItem
            totalPrice = totalPrice + value.totalAmount

            const tempdataCart = dataCart

            const dataCartTemp = {
              idItem: this.product.id,
              nameItem: this.product.name,
              priceItem: amount,
              descriptionItem: this.product.description ? this.product.description : null,
              imageItem: this.product.image ? this.product.image : null,
              totalItem: totalQuantity,
              updateAddons: this.handleSelect,
              fullDataAddons: addons,
              fullDataProduct: this.product,
              allAddons: this.allAddons,
              totalAmount: totalPrice,
              notes: this.notes,
              salesTypeId: this.getSalesType
            }
            tempFinalCart[index] = dataCartTemp
          }
        })
        console.log('data added to cart', dataCart)
        if (!has_allSame) {
          this.$store.commit('SET_CART', dataCart)
          this.goBack()
        } else {
          this.$store.commit('UPDATE_CART', tempFinalCart)
          this.goBack()
        }
      } else {
        console.log('owalahh')
      }
    },
    handleSelectAllAddonsMulti (data2, index, dataGroup) {
      const data2_temp = data2
      data2_temp.group_id = dataGroup.id
      const tempSelectAddOns = this.handleSelect
      if (this.allSelectAddOns.length == 0) {
        console.log('first Time')
        this.$set(this.handleSelect, index, `${index},${data2_temp.id}`)
        this.allSelectAddOns.push(data2_temp)
      } else {
        let same = false
        let sameIndex = 0
        this.allSelectAddOns.map((value, i) => {
          if (value.id === data2_temp.id) {
            same = true
            sameIndex = i
          } else {
          }
        })
        if (!same) {
          this.$set(this.handleSelect, index, `${index},${data2_temp.id}`)
          this.allSelectAddOns.push(data2_temp)
        } else {
          this.allSelectAddOns.splice(sameIndex, 1)
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getTotalItem', 'getCart'])
  }
}
</script>

<style scoped>
.list-menu{
  height: 525px;
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
/* Style Cart Button */
.total-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #623863;
  height: 35px;
  width: 100%;
  color: white;
  padding: 0 25px;
  padding-bottom: 3px;
  border-radius: 8px;
}
.wrap-icon-plus {
  background-color: #623863;
  width: 35px;
  height: 35px;
  padding: 3px;
  object-fit: contain;
}
.wrap-icon-plus > img {
  width: 100%;
  height: 100%;
}
.button-add-cart{
  width: 100%;
  height: 35px;
  background-color: #623863;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  border-radius: 8px;
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
/* End Style Cart Button */
textarea {
 width: 100%;
 font-size: 12px;
}
p{
  margin: 0
}
.wrapper-image{
  width: 200px;
  height: 160px;
  object-fit: contain;
}
.wrapper-image > img {
  width: 100%;
  border-radius: 20px;
  height: 100%;
}
.text-name{
  font-size: 19px;
  font-weight: 600;
}
.text-category{
  margin: 10px 0;
  font-size: 13px;
}
.text-price{
  font-size: 16px;
  font-weight: 600;
}
.description-product{
  margin-top: 20px;
  margin-bottom: 10px;
}
.wrapper-icon-back{
  width: 20px;
  cursor: pointer;
  height: 20px;
  object-fit: contain;
  margin-bottom: 30px;
}
.wrapper-icon-back:hover{
  transform: scale(1.05);
}
.wrapper-icon-back > img{
  width: 100%;
  height: 100%;
}
.choose-size{
  width: 40%;
  padding: 6px 15px;
  border: 1px solid #763877;;
  color: black;
  border-radius: 8px;
  cursor: pointer;
}
.selected{
  color: white;
  background-color: #623863;
}
.icon-minus{
  cursor: pointer;
}
.icon-plus{
  cursor: pointer;
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
@media only screen and (max-width: 495px) {
  .wrapper-beetstore-logo{
    margin-right: 20px;
  }
  .store{
    font-size: 1.8rem;
    margin-bottom: -13px;
  }
  .wrapper-logo{
    width: 80px;
    margin-top: 10px;
  }
  .wrapper-image{
    width: 110px;
    height: 80px;
  }
  .choose-size{
    width: 100%;
    font-size: 10px;
  }
  .text-name{
    font-size: 13px;
    font-weight: 600;
  }
  .text-category{
    font-size: 9px;
  }
  .text-price{
    font-size: 12px;
  }
  .description-product{
    margin-top: 11px;
  }
  .available-addon{
    font-size: 13px
  }
  .description{
    font-weight: 700;
    font-size: 15px;
  }
  .content-description{
    font-size: 11px;
  }
  .size{
    font-size: 15px;
  }
  .topping{
    font-size: 15px;
  }
  /* Style Cart Button */
  .total-item{
    height: 25px;
  }
  .wrap-icon-plus {
    width: 32px;
    height: 32px;
  }

  .button-add-cart{
    height: 30px;
    border-radius: 10px;
  }
  h4{
    font-size: 14px;
    font-weight: 600;
  }
  /* End Style Cart Button */
}
</style>
