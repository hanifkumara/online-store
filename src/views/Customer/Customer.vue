<template>
  <div>
    <div class="top-color" />
    <div class="top-title d-flex justify-content-end">
      <div class="wrapper-beetstore-logo">
        <div class="wrapper-logo">
          <img src="@/assets/images/Beet Store.png" alt="Logo BeetPOS">
        </div>
        <div class="store">STORE</div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="wrapper-icon-back" @click="goBack">
            <img src="@/assets/images/back-arrow.png" alt="Back">
          </div>
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Customer',
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.top-title{
  margin-top: 30px;
  padding: 0;
  padding: 0 10%;
}
.top-color{
  top: 0;
  position: absolute;
  background-color: #623863;
  width: 100%;
  height: 10px;
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
.wrapper-logo > img{
  width: 100%;
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
@media screen and (max-width: 495px) {
  .store{
    font-size: 1.8rem;
    margin-bottom: -13px;
  }
  .wrapper-logo{
    width: 80px;
    margin-top: 10px;
  }
  .top-title{
    padding: 0 2%;
  }
}
</style>
