<template>
  <div>
    <p>whatstrack/api/v1/qr/hanifdevice</p>
        <img :src="dataQr" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TestWhatsapp',
  data: () => {
    return {
      dataQr: ''
    }
  },
  mounted () {
    this.handleQrWhatsapp()
  },
  methods: {
    async handleQrWhatsapp () {
      try {
        console.log("URI", encodeURI('http://139.59.244.237:3001/api/v1/qr/backoffice_test3'))
        const resultGenerate = await axios.get('https://cors-anywhere.herokuapp.com/http://139.59.244.237:3001/api/v1/qr/backoffice_test3', {
          headers: {
            "x-api-key" : "EalYHzTieQVwZ83XnrPv"
          }
        })
        console.log('resultGenerate', resultGenerate)
        // this.dataQr = data.data.qr
      } catch (error) {
        console.log('errornya', error)
      }
    }
  }
}
</script>

<style scoped>

</style>
