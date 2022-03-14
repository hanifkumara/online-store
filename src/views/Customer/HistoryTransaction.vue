<template>
  <div>
    <div class="title text-center mb-2">History Transaction</div>
    <div v-if="dataHistory.length > 0" class="wrapper-list mt-3">
      <div class="item-list d-flex justify-content-between" v-for="(data, index) in dataHistory" :key="index">
        <div class="color-status" :class="data.status"/>
        <div class="item-list-left d-flex align-items-center" @click="detailHistoryTransaction(data.idHistory, data.amount)">
          <div class="wrapper-date d-flex flex-column justify-content-center align-items-center">
            <div class="date">{{data.date}}</div>
            <div class="month">{{data.month}}</div>
          </div>
          <div class="desc">
            <div v-if="data.status == 'pending'">
              <div class="payment-code" v-if="data.paymentCode">
                VA: {{data.paymentCode}}
              </div>
            </div>
            <div class="invoice" v-else>
              {{data.invoice}}
            </div>
            <div class="bank" v-if="data.bank">
              {{data.bank.desc}}
            </div>
            <div class="bank" v-else>
            </div>
          </div>
        </div>
        <div class="item-list-right d-flex flex-column align-items-end justify-content-between">
          <div class="amount">
            Rp. {{data.amount | numFormat}}
          </div>
          <div class="badge badge-danger" @click="handleDelete(data.idHistory)">delete</div>
        </div>
      </div>
      <!-- <div v-if="dataHistory.length > 7" v-observe-visibility="handleScroll" /> -->
    </div>
    <div v-else class="text-muted text-center mt-5">
      No Transactions
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'

export default {
  name: 'HistoryTransaction',
  data: () => {
    return {
      dataHistory: [],
      customerAccountId: localStorage.getItem('customer_account_id'),
      pages: 1,
      lastPage: 1
    }
  },
  mounted () {
    this.handleHistoryTransaction()
  },
  methods: {
    handleScroll (isVisibility) {
      console.log('TRIGGERED handleScroll')
      if (!isVisibility) {
        console.log('TRIGGERED isVisibility')
        return
      }
      if (this.pages >= this.lastPage) {
        console.log('TRIGGERED this.pages >= this.lastPage')
        return
      }

      this.pages++

      this.handleHistoryTransaction()
      console.log('panggil handleHistoryTransaction')
    },
    async handleDelete (id) {
      try {
        const { data } = await axios.delete(`${process.env.VUE_APP_API_URL}/api/v1/transaction-customer/${id}`)
        if (data.statusCode === 200) {
          this.handleHistoryTransaction()
          this.$toasted.show('Deleted success', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 4000
          })
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    async handleHistoryTransaction () {
      try {
        // const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/customer-app/transaction/emenu?customer_account_id=${this.customerAccountId}&order=newest&per_page=8&page=${this.pages}`)
  
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/customer-app/transaction/emenu?customer_account_id=${this.customerAccountId}&order=newest`)

        // const codeChannel =

        const tempHistory = []
        data.data.map(value => {
          const getDate = dayjs(value.createdAt).format('DD') // '25/01/2019'
          const getMonth = dayjs(value.createdAt).format('MMM') // '25/01/2019'
          console.log('getDate', getDate)
          console.log('getMonth', getMonth)
          tempHistory.push(
            {
              idHistory: value.id,
              date: getDate,
              month: getMonth,
              invoice: value.invoice,
              chName: value.ch_name,
              amount: value.amount,
              status: value.status,
              paymentCode: value.paymentcode,
              bank: this.getCodeChannel.find(value2 => {
                return value.paymentchannel == value2.code
              })
            }
          )
        })
        console.log('tempHistory', tempHistory)
        // this.dataHistory.push(...tempHistory)
        this.lastPage = data.pagination.total_page
        this.dataHistory = []
        tempHistory.map(value => {
          return this.dataHistory.push(value)
        })
      } catch (error) {
        this.dataHistory = []
        console.log(error)
      }
    },
    detailHistoryTransaction (id, totalAmount) {
      this.$router.push({ name: 'DetailHistoryTransaction', params: { id }, query: { totalAmount } })
      console.log('salto', id)
    }
  },
  computed: {
    ...mapGetters(['getCodeChannel'])
  }
}
</script>

<style scoped>
.item-list-left{
  flex: 4;
}
.item-list-rigth{
  flex: 2;
}
.wrapper-list{
  width: 100%;
  height: 530px;
  overflow-y: scroll;
  padding: 5px 2px;
}
.item-list{
  cursor: pointer;
  margin-bottom: 14px;
  position: relative;
  width: 100%;
  padding: 10px 15px;
  box-shadow: 0 0 3px 1px rgb(153, 152, 152);
}
.item-list:hover{
  box-shadow: 0 0 5px 2px rgb(153, 152, 152);
}
.wrapper-date{
  box-shadow: 0 0 6px 0.2px rgb(133, 131, 131);
  padding: 0 10px;
  border-radius: 10px;
  margin-right: 10px;
  height: 50px;
}
.color-status{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
}
.done{
  color: #42ba96;
  background-color: #42ba96;
}
.pending{
  color: #F29339;
  background-color: #F29339;
}
.failed{
  color: #FA113D;
  background-color: #FA113D;
}
.color-status.failed{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
}
.title{
  font-size: 28px;
  font-weight: 700;
}
.wrapper-date > .month {
  font-size: 13px;
  font-weight: 700;
}
.wrapper-date > .date {
  font-size: 17px;
  font-weight: 400;
}
.payment-code, .invoice{
  font-size: 18px;
  font-weight: 600;
}
.bank{
  font-size: 15px;
  font-weight: 600;
}
@media screen and (max-width: 495px) {
  .title{
    font-size: 21px;
    font-weight: 700;
  }
  .wrapper-date > .month {
    font-size: 13px;
    font-weight: 700;
  }
  .wrapper-date > .date {
    font-size: 15px;
    font-weight: 400;
  }
  .payment-code, .invoice{
    font-size: 17px;
    font-weight: 600;
  }
  .bank{
    font-size: 14px;
  }
  .item-list{
    margin-bottom: 10px;
  }
}
</style>
