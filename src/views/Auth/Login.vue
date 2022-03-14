<template>
  <div>
    <div class="title">Login</div>
    <hr />
    <form @submit.prevent="handleLogin">
      <div class="form-username d-flex flex-column">
        <label for="username">Username</label>
        <input id="username" type="text" name="username" v-model="username" placeholder="please input your username">
      </div>
      <div class="form-password d-flex flex-column">
        <label for="password">Password</label>
        <input id="password" type="password" name="password" v-model="password" placeholder="please input your password">
      </div>
      <button type="submit" class="button">Login</button>
    </form>
    <div class="to-signup text-muted">don't have an account? please <span @click="pushToSignup" class="signup">Signup</span></div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'Login',
  data: () => {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    goBack () {
      const dataTable = JSON.parse(localStorage.getItem('data_table'))
      this.$router.push({ name: 'Menu', params: { tableId: dataTable.tableId } })
      localStorage.removeItem('temp_signup')
    },
    async handleLogin () {
      try {
        if (!this.username && !this.password) {
          Swal.fire('Try again!', 'form must be filled', 'warning')
        } else {
          const result = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/customer/login`, { username: this.username, password: this.password })
          localStorage.setItem('token', result.data.data.token)
          localStorage.setItem('customerId', result.data.data.id)
          this.$router.push({ name: 'MainAllbusiness' })
          Swal.fire('Login successful', '', 'success')
        }
      } catch (error) {
        Swal.fire('Login failed', 'username or password wrong, please try again', 'error')
        console.log('error nya', error.response.data.status)
      }
    },
    pushToSignup () {
      this.$router.push({ name: 'Signup' })
    }
  }
}
</script>

<style scoped>
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
button{
  outline: none;
  border: none;
}
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
.form-username, .form-password{
  margin: 20px 0 ;
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
.to-signup{
  margin-top: 20px;
  font-size: 15px;
}
@media screen and (max-width: 495px) {
  .title{
    font-size: 24px;
    font-weight: 600;
  }
  .form-username, .form-password, .button, .to-signup{
    font-size: 14px;
  }
}
</style>
