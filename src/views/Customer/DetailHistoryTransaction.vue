<template>
  <div class="mb-4">
    <div class="d-flex justify-content-between align-items-center">
      <div class="title text-center">Detail History Transaction</div>
      <div class="badge badge-primary" @click="handleDownloadPdf">
        export PDF
      </div>
    </div>
    <div class="mt-3 d-flex justify-content-between ">
      <div class="business-outlet">{{businessName}} - {{outletName}}</div>
      <div class="date-time">{{dateTime}}</div>
    </div>
    <div class="bank-invoice d-flex">{{bank ? bank.desc : "Bank Not Defined"}} - {{invoice}}</div>
    <div v-if="status == 'pending' && paymentCode" >
      <span class="paymentcode text-title">Payment Code:</span> <span>{{paymentCode}}</span>
    </div>
    <hr />
    <div class="wrapper-detail-history" v-for="(data, index) in transactionItems" :key="index">
      <div class="item-to">Item {{index+1}}</div>
      <hr />
      <div class="d-flex justify-content-between">
        <div class="product-name text-title">Product Name</div>
        <div class="content">
          {{data.productName}}
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <div class="quantity text-title">Quantity</div>
        <div class="quantity content">{{data.quantity}}</div>
      </div>
      <div class="d-flex justify-content-between">
        <div class="price-addons text-title">Price Addons</div>
        <div v-if="data.priceAddons > 0" class="price-addons content">Rp. {{data.priceAddons | numFormat}}</div>
        <div v-else class="price-addons content">-</div>
      </div>
      <div class="d-flex justify-content-between">
        <div class="price-addons text-title">Price Total</div>
        <div class="price-addons content">Rp. {{data.priceTotal | numFormat}}</div>
      </div>
      <div class="d-flex justify-content-between">
        <div class="price-addons text-title">Notes</div>
        <div class="price-addons content">{{data.notes}}</div>
      </div>
    </div>

    <div class="total-amount">Total Amount <span class="ml-4 font-weight-bold">Rp. {{$route.query.totalAmount | numFormat}}</span></div>

    <div style="display: none">
      <table class="table" id="my-table">
        <thead class="thead-light">
          <tr>
            <th scope="col">Product Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price Addons</th>
            <th scope="col">Price Total</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="(data, index) in transactionItems" :key="index">
            <td>{{data.productName}}</td>
            <td>{{data.quantity}}</td>
            <td>Rp. {{data.priceAddons | numFormat}}</td>
            <td>Rp. {{data.priceTotal | numFormat}}</td>
            <td>{{data.notes}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import axios from 'axios'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { mapGetters } from 'vuex'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'DetailHistoryTransaction',
  data: () => {
    return {
      object: {
        name: 'Hanif Kumara',
        age: 20
      },
      dateTime: '',
      outletName: '',
      businessName: '',
      bank: '',
      invoice: '',
      paymentCode: '',
      status: '',
      transactionItems: [],
      dummyData: [
        {
          productName: 'Bakso Bakar - Spesial',
          quantity: 89,
          priceAddons: 12000.00,
          priceTotal: 50000.00,
          notes: 'Sambalnya sedikit saja ya'
        },
        {
          productName: 'Bakso Bakar - Spesial',
          quantity: 89,
          priceAddons: 12000.00,
          priceTotal: 50000.00,
          notes: 'Sambalnya sedikit saja ya'
        },
        {
          productName: 'Bakso Bakar - Spesial',
          quantity: 89,
          priceAddons: 12000.00,
          priceTotal: 50000.00,
          notes: 'Sambalnya sedikit saja ya'
        }
      ]
    }
  },
  mounted () {
    this.handleDetailTransaction()
  },
  methods: {
    handleDownloadPdf () {
      const totalAmount = this.$route.query.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      console.log('totalAmount', totalAmount)

      const doc = new jsPDF()
      doc.setFontSize(11)
      doc.text('Detail History Transaction', 15, 20)
      doc.text(`${this.businessName} - ${this.outletName}`, 15, 25)
      doc.text(this.dateTime, 150, 25)
      doc.text(this.bank ? `${this.bank.desc} - ${this.invoice}` : 'Bank Not Defined', 15, 35)
      doc.text(`Total: Rp. ${totalAmount}`, 150, 35)
      doc.autoTable({ html: '#my-table', startY: 40 })
      // Incoming-Stock_Coba Hanif_Outlet 1_06-04-2021_11-03-09
      const date = new Date()
      doc.save(`Detail-Transaction_${this.businessName}_${this.outletName}_${dayjs(date).format('DD-MM-YYYY_HH-mm-ss')}`)
    },
    async handleDetailTransaction () {
      const idHistory = this.$route.params.id

      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/customer-app/transaction/emenu?id=${idHistory}`)
      const detailTransaction = data.data[0]
      console.log('datanye', detailTransaction.Transaction_Items)

      this.outletName = detailTransaction.Outlet.name
      this.businessName = detailTransaction.Outlet.Business.name
      this.invoice = detailTransaction.invoice
      this.status = detailTransaction.status
      this.bank = this.getCodeChannel.find(value => {
        return value.code == detailTransaction.paymentchannel
      })
      detailTransaction.Transaction_Items.map(value => {
        this.transactionItems.push(
          {
            productName: value.Product.name,
            quantity: value.quantity,
            priceAddons: value.price_addons_total,
            priceTotal: value.price_total,
            notes: value.notes ? value.notes : '-'
          }
        )
      })
      console.log(this.transactionItems)

      // this.transactionItems.push(
      //   {
      //     productName: "Bakso Bakar - Spesial",
      //     quantity: 89,
      //     priceAddons: 12000.00,
      //     priceTotal: 50000.00,
      //     notes: "Sambalnya sedikit saja ya"
      //   }
      // )

      if (detailTransaction.paymentcode) {
        this.paymentCode = detailTransaction.paymentcode
      }

      dayjs.extend(LocalizedFormat)

      const coba = dayjs(detailTransaction.createdAt).format('LL LT')
      this.dateTime = coba
    }
  },
  computed: {
    ...mapGetters(['getCodeChannel'])
  }
}
</script>

<style scoped>
.badge{
  cursor: pointer;
}
.badge:hover{
  transform: scale(1.05);
}
.title{
  font-size: 28px;
  font-weight: 700;
}
.item-to{
  margin-top: 10px;
}
.wrapper-detail-history{
  box-shadow: 0 0 3px 1px #623863;
  padding: 5px 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}
.total-amount{
  text-align: end;
}
@media screen and (max-width: 495px) {
  .business-outlet, .bank-invoice{
    font-size: 14px;
    font-weight: 700;
  }
  .date-time{
    font-size: 12px;
    font-weight: 700;
  }
  .col.name, .col.quantity, .col.price-addons, .col.total-price, .col.notes {
    font-size: 11px;
  }
  td{
    font-size: 10px;
  }
  .title{
    font-size: 21px;
    font-weight: 700;
  }
  .text-title{
    font-size: 14px;
    font-weight: 700;
  }
  .content{
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
