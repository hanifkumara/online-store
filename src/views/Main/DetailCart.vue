<template>
  <div>
    <div class="container">
      <div class="wrapper-icon-back" @click="goBack">
        <img src="@/assets/images/back-arrow.png" alt="Back">
      </div>
      <div class="row">
        <div class="col-md-12 d-flex justify-content-center">
          <div class="image-product mr-4">
            <div class="wrapper-image" v-if="dataDetailCart.imageItem">
              <img :src="dataDetailCart.imageItem" alt="Product Image">
            </div>
            <div class="wrapper-image" v-else>
              <img src="@/assets/images/websiteplanet-dummy-540X400.png" alt="Product Image">
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-md-12">
          <div>
            <div class="d-flex justify-content-between">
              <div class="text-name">{{dataDetailCart.nameItem}}</div>
              <div class="text-price">Rp. {{dataDetailCart.priceItem | numFormat}}</div>
            </div>
          </div>
          <hr />
          <div class="total-item">
              <div class="icon-minus" @click="decrement">-</div>
              {{totalItem}}
              <div class="icon-plus" @click="increment">+</div>
          </div>
          <hr />
          <h5 class="addons">Addons</h5>
          <div v-if="addons">
            <h5 class="available-addon">Available Add-On</h5>
            <hr />
            <!-- <div v-for="(data, index) in dataDetailCart.allAddons" :key="index">
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
            </div> -->
            <div v-if="dataDetailCart.fullDataAddons">
              <div class="wrapper-addons d-flex justify-content-between" v-for="(data, index) in dataDetailCart.fullDataAddons" :key="index">
                <h6 class="name-addons">{{data.name}}</h6>
                <h6 class="price-addons">Rp. {{data.price | numFormat}}</h6>
              </div>
            </div>
          </div>
          <div v-else>
            <h5 class="available-addon">Add-On Not Available</h5>
          </div>
        </div>
      </div>
      <hr />
      <div class="text-notes mt-1 mb-2">Notes <span class="text-muted">(optional)</span></div>
      <textarea name="notes" v-model="dataDetailCart.notes" id="notes" rows="3"></textarea>
      <div class="row mt-2">
        <!-- <div class="col-md-12 d-flex">
          <h4>Total Amount:</h4>
          <h4>{{dataDetailCart.totalAmount | numFormat}}</h4>
        </div> -->
        <div class="save-changes" @click="updateCart">Save Changes</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DetailCart',
  data () {
    return {
      dataDetailCart: {},
      handleSelect: [],
      totalItem: null,
      addons: null
    }
  },
  mounted () {
    this.getDetailCart()
  },
  methods: {
    handleSelectAllAddons (data2, index) {
      this.$set(this.handleSelect, index, `${index},${data2.id}`)
      console.log('this.handleSelect', this.handleSelect)
    },
    getDetailCart () {
      const tempData = this.getCart[this.$route.params.idCart]
      this.dataDetailCart = tempData
      this.totalItem = tempData.totalItem
      console.log('tempData', tempData)
      if (tempData.allAddons.length > 0) {
        this.addons = true
      } else {
        this.addons = false
      }
      const finalData = JSON.parse(JSON.stringify(tempData.updateAddons))
      finalData.map(value => {
        this.$set(this.handleSelect, value.split(',')[0], `${value.split(',')[0]},${value.split(',')[1]}`)
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    updateCart () {
      const tempData = this.getCart[this.$route.params.idCart]
      tempData.notes = this.dataDetailCart.notes
      tempData.totalItem = this.totalItem
      this.goBack()
    },
    decrement () {
      console.log('decrement')
      if (this.totalItem > 1) {
        this.totalItem = this.totalItem - 1
      } else {
      }
    },
    increment () {
      console.log('increment')
      this.totalItem = this.totalItem + 1
    }
  },
  computed: {
    ...mapGetters(['getCart'])
  }
}
</script>

<style scoped>
.total-item{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 2px 10px;
  background-color: #763877;
  color: white;
  border-radius: 5px;
}
textarea {
  width: 100%;
}
.wrapper-image{
  width: 180px;
  height: 160px;
  object-fit: contain;
}
.wrapper-image > img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
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
.text-name{
  font-size: 19px;
  font-weight: 600;
}
.icon-minus, .icon-plus{
  cursor: pointer;
}
.text-price{
  font-size: 16px;
  font-weight: 600;
}
.notes{
  font-size: 16px;
  font-weight: 600;
}
.wrapper-addons{
  width: 50%;
}
.name-addons{
  font-size: 16px;
  font-weight: 600;
}
.price-addons{
  font-size: 16px;
  font-weight: 600;
}
.addons{
  font-size: 16px;
  font-weight: 600;
}
.choose-size{
  width: 40%;
  padding: 6px 15px;
  border: 1px solid #763877;;
  color: black;
  border-radius: 8px;
}
.save-changes{
  width: 100%;
  padding: 6px 0;
  background-color: #763877;
  border-radius: 40px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
@media only screen and (max-width: 495px) {
  .available-addon{
    font-size: 13px
  }
  .choose-size{
    width: 100%;
    font-size: 10px;
  }
  .wrapper-image{
    width: 190px;
    height: 130px;
  }
  .text-name{
    font-size: 15px;
    font-weight: 600;
  }
  .text-price{
    font-size: 12px;
  }
  .notes{
    font-size: 10px;
    height: 75px;
    overflow-y: scroll;
  }
  .name-addons{
    font-size: 12px;
    font-weight: 400;
  }
  .price-addons{
    font-size: 12px;
    font-weight: 400;
  }
  .addons{
    font-size: 15px;
    font-weight: 600;
  }
  .save-changes{
    margin: auto;
    padding: 2px 0;
    font-size: 12px;
    width: 92%;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  textarea {
    font-size: 12px;
  }
}
</style>
