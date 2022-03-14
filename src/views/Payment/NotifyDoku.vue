<template>
  <div>
    <h3>
      Payment Gateway - Notify Doku
    </h3>
    <router-link :to="{name: 'Main'}">
      <div class="btn btn-primary">
        Back to E-Menu
      </div>
    </router-link>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NotifyDoku',
  mounted () {
    axios.post(`${process.env.VUE_APP_API_URL}/api/v1/payment-doku/redirect-doku`, { MALLID: '9867' })
  }
}
</script>

<style>

</style>
