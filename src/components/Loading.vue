<template v-if="enableLoading">
  <div class="wrapper-loading">
    <img src="@/assets/images/Double Ring-1s-224px.svg" />
  </div>
</template>

<script>  
  export default {
    name: 'Loading'
  }
</script>

<style scoped>
.wrapper-loading{
  display: flex;
  width: 100%;
  height: 40vh;
  margin-top: 10%;
  justify-content: center;
  align-items: center;
}
.wrapper-loading > img {
  width: 160px;
}
@media screen and (max-width: 495px) {
  .wrapper-loading > img {
    width: 80px;
  }
}
</style>