import { MessageBox } from 'mint-ui'
export default {
  name: 'index',
  data () {
    return {
    }
  },
  mounted: function () {
  },
  created: function () {
    this.$store.dispatch('common/SetTitle2', 'Hanabi')
    if (this.isLogin) {
      this.$store.dispatch('common/SetTitle2', '(' + this.$store.getters['auth/userId'] + ')')
      this.$store.dispatch('room/List')
      this.$store.dispatch('myRoom/GetInfo', { mode: 'simple', force: true })
      this.$store.dispatch('myGame/GetInfo', { mode: 'simple', force: true })
    }
  },
  computed: {
    roomList: function () {
      const list = this.$store.getters['room/list']
      for (const l of list) {
        l._title = '<mt-badge size="small">' + l.id + '</mt-badge>' + ' ' + l.title
        l._title = (l.id < 100 ? l.id < 10 ? '00' + l.id : '0' + l.id : l.id) + ' ' + l.title

        if (l.password !== '') {
          l._title += '[lock]'
        }
      }
      return list
    },
    isInRoom () {
      return this.$store.getters['myRoom/roomId'] > 0
    },
    isInGame () {
      return this.$store.getters['myGame/isPlaying'] === true
    },
    isNotInRoom () {
      return this.$store.getters['myRoom/roomId'] === 0
    },
    isNotInGame () {
      return this.$store.getters['myGame/isPlaying'] === false
    },
    isLogin () {
      return this.$store.getters['auth/isLogin'] === true
    },
  },
  methods: {
    toLogin () {
      this.$router.push({ path: '/login' })
    },
    /* toRegister(){

    },*/
    enterRoom (roomId) {
      const that = this
      this.$store.dispatch('myRoom/Enter', roomId).then((res) => {
        if (res.success) {
          that.$router.push('/room')
        } else {
          MessageBox.alert(res.msg + '(' + roomId + ')')
        }
      })
    }
  }
}
