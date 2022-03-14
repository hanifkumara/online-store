<template>
  <div id="main">
    <div class="wrapper-content">
      <div class="top">
        <div class="back-emenu" @click="pushToEmenu">
          <img src="@/assets/images/back.png" alt="Back">
        </div>
        <div class="image-wrapper-pending" v-if="handleGetQuery.STATUSCODE == 'Pending'">
          <img src="@/assets/images/pending.png" alt="Pending">
        </div>
        <div class="image-wrapper" v-if="handleGetQuery.STATUSCODE == 'Payment Successful!'">
          <img src="@/assets/images/output-onlinepngtools (3).png" alt="Success">
        </div>
        <div class="image-wrapper-pending" v-if="handleGetQuery.STATUSCODE == 'Something went wrong!'">
          <img src="@/assets/images/sa.png" alt="Wrong">
        </div>
        <div v-if="handleGetQuery.STATUSCODE == 'Something went wrong!'" class="status-code" :class="{wrong: handleGetQuery.STATUSCODE == 'Something went wrong!'}">
          {{handleGetQuery.STATUSCODE}}
        </div>
        <div v-if="handleGetQuery.STATUSCODE == 'Payment Successful!'" class="status-code" :class="{success: handleGetQuery.STATUSCODE == 'Payment Successful!'}">
          {{handleGetQuery.STATUSCODE}}
        </div>
        <div v-if="handleGetQuery.STATUSCODE == 'Pending'" class="status-code" :class="{pending: handleGetQuery.STATUSCODE == 'Pending'}">
          {{handleGetQuery.STATUSCODE}}
        </div>
        <div class="transaction-number text-muted">
          Transaction Number : {{handleGetQuery.TRANSIDMERCHANT}}
        </div>
        <hr />
      </div>
      <div class="bottom px-5">
        <div class="d-flex justify-content-between text-muted">
          <div class="amount-text">Amount paid : </div>
          <div class="amount-value">Rp. {{handleGetQuery.AMOUNT | numFormat}}</div>
        </div>
        <div class="d-flex justify-content-between text-muted mt-2">
          <div class="bank-text">Bank :</div>
          <div class="bank-value">{{handleGetQuery.PAYMENTCHANNEL}}</div>
        </div>
      </div>
      <!-- <router-link :to="{name: 'Main'}">
        <div class="btn btn-primary">
          Back to E-Menu
        </div>
      </router-link> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'RedirectDoku',
  data: () => {
    return {
    }
  },
  mounted () {
  },
  methods: {
    pushToEmenu () {
      if (localStorage.getItem('data_table')) {
        if (localStorage.getItem('data_table').length > 5) {
          const dataTable = JSON.parse(localStorage.getItem('data_table'))
          console.log('dataTable', dataTable)
          this.$router.push({ name: 'Menu', params: { tableId: dataTable.tableId, businessId: dataTable.businessId } })
        }
      } else {
        this.$router.push({ name: 'Main' })
      }
    }
  },
  computed: {
    ...mapGetters(['getCodeChannel']),
    handleGetQuery () {
      const result = {
        AMOUNT: this.$route.query.AMOUNT,
        TRANSIDMERCHANT: this.$route.query.TRANSIDMERCHANT,
        WORDS: this.$route.query.WORDS,
        SESSIONID: this.$route.query.SESSIONID,
        PAYMENTCODE: this.$route.query.PAYMENTCODE,
        CURRENCY: this.$route.query.CURRENCY,
        PURCHASECURRENCY: this.$route.query.PURCHASECURRENCY
      }
      console.log(this.$route.query.STATUSCODE)
      if (this.$route.query.STATUSCODE == '5511') {
        result.STATUSCODE = 'Pending'
      } else if (this.$route.query.STATUSCODE == '0000') {
        result.STATUSCODE = 'Payment Successful!'
      } else {
        result.STATUSCODE = 'Something went wrong!'
      }
      this.getCodeChannel.find(value => {
        if (value.code == this.$route.query.PAYMENTCHANNEL) {
          result.PAYMENTCHANNEL = value.desc
        }
      })
      console.log('this.$route.query.statuscode', this.$route.query.STATUSCODE)
      console.log('this.$route.query.paymentchannel', this.$route.query.PAYMENTCHANNEL)
      console.log('result', result)
      return result
    }
  }
}
</script>

<style scoped>
#main{
  padding: 0 32%;
  border: 1px solid;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.wrapper-content{
  position: relative;
  padding: 20px 0;
  border-radius: 10px;
  box-shadow: 0 0 7px 2px #623863;
}
hr {
  border:none;
  border-top: 2px dashed grey;
  color:#fff;
  background-color:#fff;
  height:3px;
  width:100%;
  margin: 10px 5px;
}
.top{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wrong{
  color: red;
}
.success{
  color: rgb(63, 160, 63);
}
.pending{
  color: orange;
}
.back-emenu{
  position: absolute;
  left: 20px;
  top: 20px;
}
.back-emenu{
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.back-emenu > img {
  width: 100%;
  height: 100%;
}
.image-wrapper{
  width: 90px;
  height: 50px;
  object-fit: contain;
}
.image-wrapper > img {
  width: 100%;
  height: 100%;
}
.image-wrapper-pending{
  width: 90px;
  height: 90px;
  object-fit: contain;
}
.image-wrapper-pending > img {
  width: 100%;
  height: 100%;
}
@media screen and (max-width: 495px) {
  #main{
    padding: 0 20px;
  }
  .back-emenu{
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
  .back-emenu > img {
    width: 100%;
    height: 100%;
  }
  .top{
    padding: 0 5px;
  }
  .image-wrapper{
    width: 90px;
    height: 50px;
    object-fit: contain;
  }
  .image-wrapper > img {
    width: 100%;
    height: 100%;
  }
  .image-wrapper-pending{
    width: 90px;
    height: 90px;
    object-fit: contain;
  }
  .image-wrapper-pending > img {
    width: 100%;
    height: 100%;
  }
  .amount{
    font-size: 17px;
  }
  .status-code{
    font-size: 21px;
    font-weight: 700;
  }
  .transaction-number{
    font-size: 14px;
  }
}
</style>
