<template>
  <div>
    <div class="container list-menu">
      <div class="row">
        <div class="col-md-6" v-for="(data, i) in product" :key="`A-${i}`" @click="handleDetail(data.id)">
          <div class="wrapper-product">
            <div class="wrapper-image" v-if="data.image">
              <img :src="data.image" alt="Image Product" @error="handlePlaceholderImg">
            </div>
            <div class="wrapper-image" v-else>
              <img src="@/assets/images/websiteplanet-dummy-540X400.png" alt="No Image">
            </div>
            <!-- @/assets/images/Dummy image.png -->
            <div class="content-product d-flex flex-column justify-content-between">
              <div class="content-top">
                <h6>{{data.name}}</h6>
                <div v-if="data.product_category_id">
                  <p class="category-name">{{data.Product_Category.name}}</p>
                </div>
                <div v-else>
                  <p class="category-name">Tidak ada kategori nya</p>
                </div>
              </div>
              <div class="content-bottom">
                Rp. {{data.price | numFormat}}
              </div>
            </div>
          </div>
          <hr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Category',
  props: {
    resultProduct: Array,
    category: String
  },
  data () {
    return {
      product: [],
      categoryName: this.$route.params.categoryName
    }
  },
  mounted () {
    this.filterCategory()
  },
  methods: {
    async filterCategory () {
      this.resultProduct.map(value => {
        if (value.product_category_id) {
          if (value.Product_Category.name.toLowerCase() === this.categoryName) {
            this.product.push(value)
          }
        }
      })
    },
    handlePlaceholderImg (e) {
      e.target.src = 'https://via.placeholder.com/250'
    },
    handleDetail (id) {
      this.$router.push({ name: 'Detail', params: { id } })
    }
  },
  watch: {
    $route (to) {
      this.product = []
      this.categoryName = to.params.categoryName
      this.filterCategory()
    }
  }
}
</script>

<style scoped>
.list-menu{
  height: 525px;
}
.wrapper-product:hover{
  transform: scale(1.05);
}
.wrapper-product{
  padding: 0 20px;
  display: flex;
  cursor: pointer;
  align-items: center;
}
.wrapper-image{
  width: 120px;
  margin-right: 20px;
}
.wrapper-image > img{
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.category-name{
  font-size: 11px;
}
.content-bottom{
  font-size: 13px;
}
@media only screen and (max-width: 495px) {
  h6{
    font-size: 13px;
  }
  .category-name{
    font-size: 9px;
  }
  .content-bottom{
    font-size: 12px;
  }
}
</style>
