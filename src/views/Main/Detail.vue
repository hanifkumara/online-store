<template>
  <div>
    <div class="container list-menu">
      <div class="wrapper-icon-back" @click="goBack">
        <img src="@/assets/images/back-arrow.png" alt="Back">
      </div>
      <div class="row">
        <div class="col-md-12 d-flex -items-center">
          <div class="image-product mr-4">
            <div class="wrapper-image" v-if="product.image" @error="handlePlaceholderImg">
              <img :src="product.image" alt="Product Image">
            </div>
            <div class="wrapper-image" v-else>
              <img src="@/assets/images/websiteplanet-dummy-540X400.png" alt="Product Image">
            </div>
          </div>
          <div>
            <div class="text-name">Name: {{product.name}}</div>
            <div v-if="product.product_category_id">
              <div class="text-category">Category: {{product.Product_Category.name}}</div>
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
          <div v-if="allAddons.length > 0">
            <h5 class="available-addon">Available Add-On</h5>
            <hr />
            <div v-for="(data, index) in allAddons" :key="index">
              <h6 class="size mb-4">{{data.name}}</h6>
              <div class="wrapper-size-choose" v-for="(data2, index2) in data.Addons" :key="index2" @click="handleIndex = index">
                <div class="choose-size d-flex justify-content-between mb-3 " @click="handleSelectAllAddons(data2, index)" :class="{selected: handleSelect.some((element, index, array) => {
                  if(element == `${index},${data2.id}`) {
                    return true
                  }})}">
                  <p class="title-choose-size">
                    {{data2.name}}
                  </p>
                  <p class="price-choose-size">
                    Rp. {{data2.price | numFormat}}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <h5 class="available-addon">Add-On Not Available</h5>
          </div>
        </div>
      </div>
      <hr />
      <div class="row mt-2">
        <div class="col-xl-5 col-md-12">
          <h4>Notes <span class="text-muted">(optional)</span></h4>
          <textarea name="notes" id="notes" v-model="notes" rows="3"></textarea>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-xl-5 col-md-12">
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
        <div class="col-xl-5 col-md-12">
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
import { mapMutations, mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: 'Detail',
  props: {
    dataBusiness: Object
  },
  data: () => {
    return {
      paymentAvailable: false,
      costumerId: localStorage.getItem('customer_account_id'),
      product: {},
      isActive: false,
      handleSelect: [],
      allSelectAddOns: [],
      selectedSize: 1,
      selectedTopping: 1,
      allAddons: [],
      totalItem: 1,
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
      ]
    }
  },
  mounted () {
    this.handleGetProduct()
    this.handlePaymentMethod()
    console.log('allSelectAddOns', this.allSelectAddOns)
  },
  methods: {
    ...mapMutations(['SET_INCREMENT_CART']),
    async handleGetProduct () {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/product/find-product/${this.$route.params.id}`)
      console.log('data.data', data.data)
      const groupAddons = JSON.parse(JSON.stringify(data.data.Group_Addons))
      console.log('groupAddons', groupAddons)
      groupAddons.map(value => {
        this.allAddons.push(value)
      })
      if (data.data.image) {
        data.data.image = `${process.env.VUE_APP_API_URL}/${data.data.image}`
      } else {
        data.data.image = ''
      }
      console.log('data ===>', data.data)
      this.product = data.data
    },
    async handlePaymentMethod () {
      try {
        console.log('this.dataBusiness', this.dataBusiness)
        if (this.dataBusiness.czEntityId || this.dataBusiness.dokuClientId) {
          this.paymentAvailable = true
        } else {
          this.paymentAvailable = false
        }
      } catch (error) {
        console.log(error)
        this.paymentAvailable = false
      }
    },
    handlePlaceholderImg (e) {
      e.target.src = 'https://via.placeholder.com/250'
    },
    handleSelectAllAddons (data2, index) {
      this.$set(this.handleSelect, index, `${index},${data2.id}`)
      console.log('this.handleSelect', this.handleSelect)
      this.$set(this.allSelectAddOns, index, data2)
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
      // if (this.costumerId) {
      if (this.paymentAvailable) {
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
        }
        // if (this.totalItem > 0) {
        //   console.log('product akan di embeded', this.product)
        //   console.log('addons akan di embeded', this.allSelectAddOns)
        //   console.log('total item', this.totalItem)
        //   const addons = []
        //   const priceAddons = []
        //   let totalPriceAddons = null
        //   this.allSelectAddOns.map(val => addons.push(val))
        //   this.allSelectAddOns.map(val => priceAddons.push(val.price))
        //   console.log('addons', addons)
        //   console.log('priceAddons', priceAddons)
        //   if (priceAddons.length > 0) {
        //     const result = priceAddons.reduce((acc, curr) => {
        //       return acc + curr
        //     })
        //     totalPriceAddons = result
        //   }
        //   const amount = totalPriceAddons + this.product.price
        //   console.log('amount', amount)
        //   console.log('totalPriceAddons', totalPriceAddons)
        //   const dataCart = {
        //     idItem: this.product.id,
        //     nameItem: this.product.name,
        //     priceItem: amount,
        //     descriptionItem: this.product.description ? this.product.description : null,
        //     imageItem: this.product.image ? this.product.image : null,
        //     totalItem: this.totalItem,
        //     updateAddons: this.handleSelect,
        //     fullDataAddons: addons,
        //     fullDataProduct: this.product,
        //     allAddons: this.allAddons,
        //     totalAmount: amount * this.totalItem,
        //     notes: this.notes
        //   }
        //   console.log('bismillah', dataCart)
        //   this.$store.commit('SET_CART', dataCart)
        //   this.goBack()
        // }
        else {
          console.log('owalahh')
        }
      } else {
        Swal.fire("This merchant have't payment gateway", 'please choose another merchant', 'warning')
      }
      // } else {
      //   Swal.fire({
      //     title: 'You must login first',
      //     text: '',
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: '#3085d6',
      //     cancelButtonColor: '#d33',
      //     confirmButtonText: 'Yes!'
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       localStorage.setItem('temp_signup', 'YES')
      //       this.$router.push({ name: 'Auth' })
      //     }
      //   })
      // }
    }
  },
  computed: {
    ...mapGetters(['getCart', 'getSalesType'])
  }
}
</script>

<style scoped>
.list-menu{
  height: 525px;
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
  border-radius: 10px;
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
  cursor: pointer;
  width: 20px;
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
@media only screen and (max-width: 495px) {
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
