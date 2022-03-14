<template>
  <div>
      <vue-qrcode id="qrcode"  @click="handleDownload" :value="janganJangan"/>
  </div>
</template>

<script>
import VueQrcode from 'vue-qrcode'
export default {
  name: 'TestQRIS',
  data: () => {
    return {
      janganJangan: '00020101021226530012COM.DOKU.WWW0118936008990000003254020432540303UME51440014ID.CO.QRIS.WWW0215ID10210754832540303UME52045814530336054071200.005502015802ID5908Lifetech6008DENPASAR61059999962470703A01503632546fed4196699c43648a1339bb47746f27630433A8'
    }
  },
  components: {
    VueQrcode
  },
  methods: {
    handleDownload () {
      console.log('salto')
      const canvas = document.getElementById('qrcode')
      console.log('canvas', canvas)
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = 'qrcode-outlet-beetpos.png'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }
}
</script>

<style scoped>

</style>
