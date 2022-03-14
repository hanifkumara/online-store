<template>
  <div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'GetDataTable',
  mounted () {
    this.loginGuest()
  },
  methods: {
    async loginGuest () {
      if (!localStorage.getItem('token')) {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/auth/guest/login`)
        localStorage.setItem('token', data.data)
      }
      const dataTable = {
        tableId: this.$route.params.tableId,
        businessId: this.$route.params.businessId
      }
      localStorage.setItem('data_table', JSON.stringify(dataTable))
      this.$router.push({ name: 'Menu', params: { tableId: this.$route.params.tableId } })
    }
  }
}
</script>

<style scoped>

</style>
