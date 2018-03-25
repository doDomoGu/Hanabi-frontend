// import axios from 'axios';

import { MessageBox } from 'mint-ui'

export default {
  name: 'RegisterForm',
  data () {
    return {
      form: {
        username: '',
        password: '',
        password2: ''
      },
      errormsg: ''
    }
  },
  mounted: function () {
    this.$store.dispatch('common/SetTitle2', '注册')
  },
  methods: {
    onSubmit () {
      if (this.form.username === '' || this.form.password === '' || this.form.password2 === '') {
        MessageBox.alert('用户名/密码必须填写！')
      } else if (this.form.password !== this.form.password2) {
        MessageBox.alert('两次密码不一致！')
      } else {
        this.$store.dispatch('auth/Register', [this.form.username.trim(), this.form.password.trim()]).then((res) => {
          if (res.data.success) {
            // this.$store.dispatch('auth/SetStore', res.data);

            /* this.$store.dispatch('auth/GenerateRoutes', {roles: this.$store.getters['auth/roles'], router: this.$router}).then(() => { // 生成可访问的路由表

              this.$router.addRoutes(this.$store.getters.auth_add_routes) // 动态添加可访问路由表

              this.$router.push({ path: '/' }); //登录成功之后重定向到首页

            });*/

            const redirectUrl = this.$route.query.redirectUrl
            if (redirectUrl) {
              this.$router.push({ path: redirectUrl })
            } else {
              this.$router.push({ path: '/' })
            }
          } else {
            // console.log('submit login failure');
            // this.errormsg = res.data.errormsg;

            MessageBox.alert(res.data.error_msg) // 登录失败提示错误
          }
        }).catch(err => {
          // console.log('submit login error');
          // console.log(err);
          MessageBox.alert(err) // 注册失败提示错误
        })
      }
    }
  }
}
