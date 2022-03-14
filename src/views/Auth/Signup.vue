<template>
  <div>
    <div class="title">Signup</div>
    <hr />
    <div class="form-username d-flex flex-column mb-3">
      <label for="username">Username</label>
      <input id="username" type="text" name="username" v-model="username" placeholder="please input your username">
    </div>
    <div class="form-phone-number d-flex flex-column mb-3">
      <label for="phone-number">Phone Number</label>
      <input id="phone-number" type="text" name="phone-number" v-model="phoneNumber" placeholder="please input your phone number">
    </div>
    <div class="form-password d-flex flex-column mb-3">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" v-model="password" placeholder="please input your password">
    </div>
    <b-modal modal-footer id="modal-1" title="Please insert code verification">
      <div v-if="awaitState">
        <div v-if="!statusWhatsapp" class="verify-code-title">Verify code : <span class="verify-code">{{dataCustomerSignup.verification_code}}</span></div>
        <div v-else class="check-whatsapp">
          <div>Check your whatsapp</div>
          <div v-if="messageNotSent">
            <div class="text-muted">
              didn't receive the message? <span class="text-primary" style="cursor: pointer" @click="showVerifyCode = true">show here</span>
            </div>
            <div v-if="showVerifyCode">
              {{verifyCode}}
            </div>
          </div>
        </div>
        <div class="mt-3">
          <input type="text" placeholder="please input verify code" v-model="inputVerify">
        </div>
      </div>
      <template #modal-footer>
        <div v-if="username && password && phoneNumber">
          <div class="w-100">
            <b-button
              variant="primary"
              size="sm"
              class="float-right"
              @click="handleSignup"
            >
              Submit
            </b-button>
          </div>
        </div>
        <div v-else>
          <div class="w-100">
            <b-button
              variant="primary"
              size="sm"
              class="float-right"
              disabled
            >
              Submit
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
    <div class="button disabled" v-if="username == '' || password == '' || phoneNumber == ''" >Signup</div>
    <div class="button" v-else @click="sendVerifyCode">Signup</div>
    <div class="to-login text-muted">already have an account? please <span @click="pushToLogin" class="signup">Login</span></div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'Signup',
  data: () => {
    return {
      username: '',
      password: '',
      phoneNumber: '',
      inputVerify: '',
      dataCustomerSignup: {},
      statusWhatsapp: false,
      verifyCode: '',
      messageNotSent: false,
      showVerifyCode: false,
      awaitState: false
    }
  },
  methods: {
    async sendVerifyCode () {
      try {
        if (!this.username && !this.password && !this.phoneNumber) {
          Swal.fire('Try again!', 'form must be filled', 'warning')
        } else {
          const result = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/customer/register`, { username: this.username, password: this.password, phoneNumber: this.phoneNumber })
          this.dataCustomerSignup = result.data.data
          this.verifyCode = result.data.data.verification_code
          Swal.fire('Register Successfully', 'please try to login', 'success')
        }
      } catch (error) {
        Swal.fire("Something wen't wrong", error.response.data.err.message, 'error')
        console.log("error", error)
      }
    },
    async handleSendWhatsapp (verifyCode) {
      try {
        const tempSplit = this.phoneNumber.toString().split('')
        console.log('tempSplit', tempSplit)
        if (tempSplit[0] == 0 || tempSplit[0].length == 0) {
          tempSplit[0] = '62'
        } else if (tempSplit[0] == 8) {
          tempSplit.unshift(62)
        }
        const resultPhone = tempSplit.join('')
        console.log('resultPhone', resultPhone)
        const dataSend = {
          message: `
            Verify Code = ${verifyCode}\nPowered By Beetpos
          `,
          phone: resultPhone,
          device: 'backoffice_test3'
        }
        const sendMessage = await axios.post('https://cors-anywhere.herokuapp.com/http://139.59.244.237:3001/api/v1/messaging/sendText', dataSend, {
          headers: {
            'x-api-key': 'EalYHzTieQVwZ83XnrPv'
          }
        })
        console.log('sendMessage', sendMessage)
        setTimeout(() => {
          this.messageNotSent = true
        }, 3000)
        this.$toasted.show('Verify code sent', {
          theme: 'bubble',
          position: 'top-right',
          duration: 5000
        })
        console.log('TIDAK masuk statement error')
        this.statusWhatsapp = true
      } catch (error) {
        this.statusWhatsapp = false
        console.log('masuk statement error')
        console.log('error', error)
        this.$toasted.show('Verify code not sent', {
          theme: 'bubble',
          position: 'top-right',
          duration: 3000
        })
      }
    },
    goBack () {
      this.$router.go(-1)
      localStorage.removeItem('temp_signup')
    },
    async handleSignup () {
      try {
        if (this.dataCustomerSignup.verification_code === this.inputVerify) {
          const result = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/auth/customer/login`, { username: this.username, password: this.password })
          console.log('Waduhh', result.data.data)

          // for verification account
          await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/auth/verify-account-customer?customerId=${result.data.data.payload.customer_account_id}`, {
            headers: {
              Authorization: `Bearer ${result.data.data.token}}`
            }
          })

          localStorage.setItem('token', result.data.data.token)
          localStorage.setItem('customer_account_id', result.data.data.payload.customer_account_id)
          this.$router.push({ name: 'MainAllbusiness' })
          Swal.fire('Register successful', '', 'success')
        } else {
          Swal.fire('Verification failed', 'please try again', 'error')
        }
      } catch (error) {
        Swal.fire('Register failed', 'Something went wrong, please try again', 'error')
        console.log('error nya', error.response.data.status)
      }
    },
    pushToLogin () {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
.signup{
  text-decoration-line: underline;
  cursor: pointer;
  color: #623863;
}
.title{
  font-size: 40px;
  font-weight: 700;
  text-align: center;
}
input{
  border: none;
  border-bottom: 1px solid #623863;
  padding: 5px 10px;
}
input:focus{
  outline: none;
  border-bottom: 4px solid #623863;
}
.button{
  width: 100%;
  padding: 4px 0;
  border-radius: 20px;
  background-color: #623863;
  color: white;
  text-align: center;
  cursor: pointer;
}
.to-login{
  margin-top: 20px;
  font-size: 15px;
}
.verify-code-title{
  font-size: 20;
  font-weight: 400;
}
.verify-code{
  font-size: 20px;
  font-weight: 700;
}
.wrapper-icon-back{
  cursor: pointer;
  position: absolute;
  left: 17px;
  top: 10px;
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-bottom: 30px;
}
.wrapper-icon-back:hover{
  transform: scale(1.05);
}
.wrapper-icon-back > img{
  width: 100%;
  height: 100%;
}
@media screen and (max-width: 495px) {
  .title{
    font-size: 24px;
    font-weight: 600;
  }
  .form-username, .form-password, .form-phone-number,  .button, .to-login{
    font-size: 14px;
  }
  .verify-code-title{
    font-size: 13px;
    font-weight: 400;
  }
  .verify-code{
    font-size: 14px;
    font-weight: 700;
  }
}
</style>
