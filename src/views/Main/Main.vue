<template>
  <div class="container">
    <!-- <div class="row mt-2">
      <div class="col-md-6">
        <h5 class="font-weight-bold">Menu Utama</h5>
      </div>
      <div class="col-md-6 d-flex justify-content-end">
        <div class="wrapper-icon">
          <img src="@/assets/images/logout.png" alt="Logout">
        </div>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col-md-12">
        <h6 class="font-weight-bold">Halo, Hanif Staff</h6>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <p>Staff ID :</p>
        <p>hanif00</p>
        <p class="mt-2">Waktu Check In :</p>
        <p>00:00</p>
        <p class="mt-2">Status Kas :</p>
        <p>Open</p>
      </div>
      <div class="col-md-6">
        <p>Role :</p>
        <p>Superadmin</p>
        <p class="mt-2">Waktu Check Out :</p>
        <p>00:00</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h6 class="font-weight-bold">Adila - Outlet 1</h6>
      </div>
    </div>
    <hr>
    <div class="row mt-2">
      <div class="col-md-12">
        <p class="text-muted">Point of Sale</p>
      </div>
    </div>
    <div class="container-icon-pos mt-1">
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Pesanan Baru</p>
      </div>
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Meja</p>
      </div>
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Pelanggan</p>
      </div>
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Riwayat</p>
      </div>
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Kas</p>
      </div>
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Produk</p>
      </div>
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Booking</p>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-12">
        <h6 class="font-weight-bold">Pengaturan & Lainnya</h6>
      </div>
    </div>
    <div class="container-icon-pos mb-2">
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Pengaturan</p>
      </div>
      <div class="wrapper-icon-pos">
        <div class="icon-pos"></div>
        <p>Absensi</p>
      </div>
    </div> -->
    <div class="row">
      <div class="col-md-12">
        Hello World
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Main',
  mounted () {
    this.firstRender()
  },
  methods: {
    async firstRender () {
      if (localStorage.getItem('data_table')) {
        const dataTable = JSON.parse(localStorage.getItem('data_table'))
        console.log('dataTable', dataTable)
        if (localStorage.getItem('data_table').length > 5) {
          this.$router.push({ name: 'Menu', params: { tableId: dataTable.tableId, businessId: dataTable.businessId } })
        } else if (localStorage.getItem('menu_method') === 'Login') {
          this.$router.push({ name: 'MainAllbusiness' })
        } else if (localStorage.getItem('menu_method') === 'Scan') {
          this.$router.push({ name: 'Menu', params: { tableId: dataTable.tableId, businessId: dataTable.businessId } })
        }
      } else {
        this.$router.push({ name: 'Auth' })
      }
    }
  }
}
</script>

<style scoped>
hr{
  margin: 0;
  margin-bottom: 10px;
}
.wrapper-icon{
  width: 20px;
  height: 20px;
}
.wrapper-icon > img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
p{
  margin: 0;
}
.container-icon-pos{
  display: flex;
  flex-wrap: wrap;
}
.wrapper-icon-pos{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33%;
}
.icon-pos{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: grey;
}
</style>
