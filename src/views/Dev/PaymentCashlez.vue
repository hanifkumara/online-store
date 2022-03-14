<template>
  <div>
    <div>
      <b-modal ref="vuemodal" modal-footer id="modal-1" hide-footer title="Please select payment method">
        Lalalala
      </b-modal>
    </div>
    <div v-if="stateModal" class="custom-modal">
      <div class="modal-box">
        <div class="d-flex justify-content-end">
          <div class="wrapper-icon-close" @click="handleCloseModal">
            <img src="@/assets/images/icons8-macos-close-90.png" alt="Close">
          </div>
        </div>
          <iframe class="iframe-cz" src="https://link.cashlez.com/czlink/GR23271Test-Beetpos-SP-1012" frameborder="0"></iframe>
      </div>
    </div>
    <div class="btn btn-primary" @click="stateModal = true">
      Proceed to Payment
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import $ from "jquery"

export default {
  name: 'PaymentCashlez',
  data: () => {
    return {
      stateModal: false
    }
  },
  mounted() {
    $('#modal-1').on('hidden.bs.modal', function (e) {
      console.log("e ne", e)
    });
    $(this.$refs.vuemodal).on("hidden.bs.modal", this.doSomethingOnHidden)
  },
  methods: {
    doSomethingOnHidden(){
      console.log("bismillah")
    },
    handleCloseModal () {
      this.stateModal = false
      console.log("ya Allah")
    }
  }
}
</script>

<style scoped>
iframe{
  width: 100%;
  height: 100vh;
}

.custom-modal{
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
  z-index: 999;
}
.modal-box{
  border: 1px solid;
  background-color: white;
}
.wrapper-icon-close{
  margin: 10px 25px;
  width: 35px;
  height: 35px;
  object-fit: contain;
}
.wrapper-icon-close>img{
  width: 100%;
  height: 100%;
}
@media screen and (max-width: 786px) {
  .modal-box{
    border: 1px solid;
    width: 85%;
  }
}
@media screen and (max-width: 495px) {
  .modal-box{
    border: 1px solid;
    width: 95%;
  }
}
</style>
