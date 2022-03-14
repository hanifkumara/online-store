<template>
  <div>
    <div class="top-color" />
    <div class="wrapper-card-login">
      <div class="form-auth">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Auth'
}
</script>

<style scoped>
.top-color{
  top: 0;
  position: absolute;
  background-color: #623863;
  width: 100%;
  height: 10px;
}
.wrapper-card-login{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-auth{
  position: relative;
  width: 25%;
  box-shadow: 0 0 5px 4px #623863;
  border-radius: 10px;
  padding: 10px 20px;
  padding-bottom: 20px;
}
@media screen and (max-width: 768px) {
  .form-auth{
    width: 65%;
  }
}
@media screen and (max-width: 495px) {
  .form-auth{
    width: 85%;
  }
}
</style>
