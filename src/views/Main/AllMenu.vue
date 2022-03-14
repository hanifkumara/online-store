<template>
  <div>
    <div class="container list-menu">
      <div class="row">
        <div class="col-md-6" v-for="data in resultProduct" :key="data.id" @click="handleDetail(data.id)">
          <div class="wrapper-product">
            <div class="wrapper-image" v-if="data.image">
              <img :src="data.image" alt="Image Product" @error="handlePlaceholderImg">
            </div>
            <div class="wrapper-image" v-else>
              <img src="@/assets/images/websiteplanet-dummy-540X400.png" alt="No Image">
            </div>
            <div class="content-product d-flex flex-column justify-content-between">
              <div class="content-top">
                <h6 class="title-product">{{data.name}}</h6>
                <div v-if="data.product_category_id">
                  <p class="category-product">{{data.Product_Category.name}}</p>
                </div>
                <div v-else>
                  <p class="category-product">no category</p>
                </div>
              </div>
              <div class="price-category" style="font-size: 13px">
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
  name: 'AllMenu',
  props: {
    resultProduct: Array
  },
  methods: {
    handlePlaceholderImg (e) {
      e.target.src = 'https://via.placeholder.com/250'
    },
    handleDetail (id) {
      this.$router.push({ name: 'Detail', params: { id } })
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
@media only screen and (max-width: 495px) {
  .title-product{
    font-size: 13px;
  }
  .category-product{
    font-size: 10px;
  }
  .price-product{
    font-size: 12px;
  }
}
</style>
