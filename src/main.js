import Vue from 'vue'
import App from './App'

import router from './router'
import store from './store'

import Mint from 'mint-ui';
Vue.use(Mint);
import 'mint-ui/lib/style.css'

/*import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);*/


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  //components: { App }
  render: h => h(App)
})
