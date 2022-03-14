<template>
  <div>
    <div class="wrapper-profile">
      <div class="text-center title">Profile Customer</div>
      <div class="name-email">
        <div class="field-value name" v-show="!showField('name')" @click="focusField('name')">{{dataCustomer.name}}</div>
        <input v-model="dataCustomer.name" v-show="showField('name')" id="user-name" type="text" class="field-value name" @focus="focusField('name', dataCustomer.name)" @blur="blurField">
        <!-- <div class="name">{{dataCustomer.name}}</div> -->
        <div class="field-value email" v-show="!showField('email')" @click="focusField('email')">{{dataCustomer.email}}</div>
        <input v-model="dataCustomer.email" v-show="showField('email')" id="user-email" type="text" class="field-value email" @focus="focusField('email', dataCustomer.email)" @blur="blurField">
      </div>
      <div class="profile">
        <label for="upload-image">
          <div class="wrapper-image-customer" v-if="dataCustomer.image">
            <img :src="dataCustomer.image" alt="Picture">
          </div>
          <div class="wrapper-image-customer" v-else>
            <img src="@/assets/images/websiteplanet-dummy-540X400.png" alt="Product Image">
          </div>
        </label>
        <input type="file" name="image" id="upload-image" @change="uploadImage"/>
        <div class="d-flex flex-column">
          <label for="phone_number">Phone Number :</label>
          <div class="phone_number" v-show="!showField('phone_number')" @click="focusField('phone_number')">{{dataCustomer.phone_number}}</div>
          <input v-model="dataCustomer.phone_number" v-show="showField('phone_number')" id="phone_number" type="text" class="phone_number" @focus="focusField('phone_number', dataCustomer.phone_number)" @blur="blurField">
        </div>
        <div class="d-flex flex-column mt-4">
          <label for="primary_address">Address :</label>
          <div class="primary_address" v-show="!showField('primary_address')" @click="focusField('primary_address')">{{dataCustomer.primary_address}}</div>
          <input v-model="dataCustomer.primary_address" v-show="showField('primary_address')" id="primary_address" type="text" class="primary_address" @focus="focusField('primary_address', dataCustomer.primary_address)" @blur="blurField">
        </div>
      </div>
      <div class="text-muted double-click mt-3">
        *double click to edit
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Account',
  data: () => {
    return {
      customerAccountId: localStorage.getItem('customer_account_id'),
      dataCustomer: {},
      image: '',
      editField: ''
    }
  },
  mounted () {
    this.getAccount()
  },
  methods: {
    async uploadImage (e) {
      const image = e.target.files[0]
      this.image = image
      const formData = new FormData()

      if (this.image) {
        formData.append('image', this.image)
      }
      const { data } = await axios.put(`${process.env.VUE_APP_API_URL}/api/v1/customer-account/${this.customerAccountId}`, formData)
      this.getAccount()

      console.log('data', data)
    },
    async getAccount () {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/customer-account/${this.customerAccountId}`)

      if (!data.data.name) { data.data.name = 'Please insert your name' }

      if (!data.data.email) { data.data.email = 'Please insert your email' }

      if (!data.data.phone_number) { data.data.phone_number = 'Please insert your phone number' }

      if (!data.data.primary_address) { data.data.primary_address = 'Please insert your primary address' }

      if (data.data.image) {
        data.data.image = `${process.env.VUE_APP_API_URL}/${data.data.image}`
      }

      this.dataCustomer = data.data

      // this.dataCustomer.name = data.data.name
      // this.dataCustomer.email = data.data.email
      // this.dataCustomer.phone_number = data.data.phone_number
      // this.dataCustomer.primary_address = data.data.primary_address
      // this.dataCustomer.image = data.data.image

      console.log('data.data', data.data)
      console.log('customerAccountId', this.customerAccountId)
    },
    focusField (params, params2) {
      this.editField = params
      if (params2) {
        if (params2.includes('Please insert')) {
          this.dataCustomer[params] = ''
        }
      }
    },
    async blurField () {
      this.editField = ''
      console.log('ketika klik luar')
      console.log('data akhir', this.dataCustomer)
      const formData = new FormData()
      formData.append('name', this.dataCustomer.name)
      formData.append('email', this.dataCustomer.email)
      formData.append('phone_number', this.dataCustomer.phone_number)
      formData.append('primary_address', this.dataCustomer.primary_address)
      // if (this.image) {
      //   formData.append("image", this.image)
      // }
      const { data } = await axios.put(`${process.env.VUE_APP_API_URL}/api/v1/customer-account/${this.customerAccountId}`, formData)

      console.log('data', data)
      this.getAccount()
    },
    showField (params) {
      return (this.dataCustomer[params] == '' || this.editField == params)
    }
  }
}
</script>

<style scoped>
.wrapper-profile{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title{
  font-size: 28px;
  font-weight: 700;
}
input.field-value {
  border: none;
}
input.field-value:focus {
  outline: none;
}
.d-flex > input{
  border: none;
  border-bottom: 1px solid #623863;
  padding: 5px 10px;
  font-size: 14px;
}
.d-flex > input:focus{
  outline: none;
  border-bottom: 4px solid #623863;
}
hr{
  color: #623863;
  background-color: #623863;
}
#upload-image {
   opacity: 0;
   position: absolute;
   z-index: -1;
}
.profile{
  padding: 20px 30px;
  padding-top: 30px;
  width: 100%;
  height: 42%;
  position: relative;
  box-shadow: 0 0 5px 2px #623863;
}
.wrapper-image-customer{
  width: 95px;
  height: 95px;
  border-radius: 50%;
  object-fit: contain;
  position: absolute;
  right: 30px;
  top: -50px;
  box-shadow: 0px 0px 6px 2px rgb(61, 61, 61);
}
.wrapper-image-customer > img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
.name-email{
  margin: 0 20px;
  margin-top: 30px;
  margin-bottom: 40px;
}
.name {
  font-size: 24px;
  font-weight: 600;
}
.email {
  font-size: 17px;
}
.phone_number, .primary_address {
  font-size: 17px;
}
label {
  font-size: 18px;
  font-weight: 700;
}
.double-click{
  font-size: 14px;
}
@media screen and (max-width: 495px) {
  .double-click{
    font-size: 12px;
  }
  .profile{
    padding: 20px 30px;
    padding-top: 30px;
    border: 1px solid;
    width: 100%;
    height: 42%;
    position: relative;
    box-shadow: 0 0 5px 2px #623863;
  }
  .wrapper-image-customer{
    width: 95px;
    height: 95px;
    border-radius: 50%;
    object-fit: contain;
    position: absolute;
    right: 30px;
    top: -50px;
    box-shadow: 0px 0px 6px 2px rgb(61, 61, 61);
  }
  .wrapper-image-customer > img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
  .name-email{
    margin: 0 20px;
    margin-top: 30px;
    margin-bottom: 40px;
  }
  .name {
    font-size: 19px;
    font-weight: 600;
  }
  .email {
    font-size: 15px;
  }
  .phone_number, .primary_address {
    font-size: 15px;
  }
  label {
    font-size: 14px;
    font-weight: 700;
  }
  .title{
    font-size: 21px;
    font-weight: 700;
  }
}
</style>
