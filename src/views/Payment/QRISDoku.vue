<template>
  <div class="content">
    <div class="wrapper-qris">
      <div class="wrapper-icon-qris">
        <img src="@/assets/images/iconQris.png" alt="Icon Qris">
      </div>
      <div class="polygon1" />
      <div class="polygon2" />
      <div class="d-flex flex-column align-items-center">
        <div class="merchant-name mb-2">{{$route.query.businessName}} - {{$route.query.outletName}}</div>
        <vue-qrcode id="qrcode" :value="$route.query.qrString"/>
      </div>
    </div>
  </div>
</template>

<script>
import VueQrcode from 'vue-qrcode'

export default {
  name: 'QRISDoku',
  mounted () {
    console.log('qr string =====>', this.$route.query.qrString)
  },
  components: {
    VueQrcode
  }
}
</script>

<style scoped>
.content{
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 30%;
}
.wrapper-qris{
  background-image: url('../../assets/images/grey-polygon-background_mirror.jpg');
  position: relative;
  box-shadow: 0 0 5px 1px #623863;
}
#qrcode{
  z-index: 2;
}
.wrapper-qris{
  padding-bottom: 20px;
}
.wrapper-icon-qris{
  width: 40%;
  object-fit: contain;
}
.wrapper-icon-qris > img {
  width: 100%;
}
.merchant-name{
  font-size: 19px;
  font-weight: 700;
}
.polygon1{
  position: absolute;
  top: 90px;
  background-color: #623863;
  width: 120px;
  height: 120px;
  clip-path: polygon(36% 34%, 36% 69%, 0 100%, 0 0);
}
.polygon2{
  position: absolute;
  background-color: #623863;
  width: 120px;
  height: 120px;
  clip-path: polygon(0 100%, 100% 100%, 100% 0);
  bottom: 0;
  right: 0;
}
@media screen and (max-width: 495px) {
  .wrapper-qris{
    padding-bottom: 20px;
  }
  .content{
    padding: 0 10%;
  }
  .wrapper-icon-qris{
    width: 60%;
    object-fit: contain;
  }
  .wrapper-icon-qris > img {
    width: 100%;
  }
  .merchant-name{
    font-size: 19px;
    font-weight: 700;
  }
  .polygon1{
    position: absolute;
    top: 90px;
    background-color: #623863;
    width: 120px;
    height: 120px;
    clip-path: polygon(36% 34%, 36% 69%, 0 100%, 0 0);
  }
  .polygon2{
    position: absolute;
    background-color: #623863;
    width: 120px;
    height: 120px;
    clip-path: polygon(0 100%, 100% 100%, 100% 0);
    bottom: 0;
    right: 0;
  }
}
</style>
