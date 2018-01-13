import { MessageBox, Toast } from 'mint-ui'
import XDialog from 'vux/src/components/x-dialog'
export default {
  name: 'game',
  components: {
    XDialog
  },
  data () {
    return {
      colors: ['white', 'blue', 'yellow', 'red', 'green'],
      numbers: [1, 1, 1, 2, 2, 3, 3, 4, 4, 5],
      cardOperationShow: false,
      cardOperationType: -1,
      cardSelectOrd: -1,
      cardSelectColor: -1,
      cardSelectNum: -1
    }
  },
  mounted: function () {

  },
  created: function () {
    this.$store.dispatch('myGame/IsInGame2').then(() => {
      this.$store.dispatch(
        'common/SetTitle',
        this.$store.getters['common/title_suffix'] + ' - ' + (this.$store.getters['myGame/is_playing'] > 0 ? '游戏中' : '错误')
      )
      this.$store.dispatch('myRoom/IsInRoom')

      this.$store.dispatch('myRoom/GetRoomInfo2')

      this.getGameInfo()

      this.intervalid1 = setInterval(() => {
        const _score = this.$store.getters['myGame/score'] + ''
        this.getGameInfo()
        this.$store.dispatch('myGame/IsInGame2').then(() => {
          if (!this.$store.getters['myGame/is_playing']) {
            clearInterval(this.intervalid1)
            MessageBox('提示', '游戏得分[' + _score + ']，结束').then(action => {
              if (action === 'confirm') {
                this.$router.push('/room')
              }
            })
          }
        })
      }, 300)
    })
  },
  beforeDestroy () {
    clearInterval(this.intervalid1)
  },
  computed: {
    isHost: function () {
      return this.$store.getters['myRoom/is_host']
    },
    hostPlayer: function () {
      return this.$store.getters['myRoom/host_player']
    },
    guestPlayer: function () {
      return this.$store.getters['myRoom/guest_player']
    },
    hostHands: function () {
      return this.$store.getters['myGame/host_hands']
    },
    guestHands: function () {
      return this.$store.getters['myGame/guest_hands']
    },
    libraryCardsNum: function () {
      return this.$store.getters['myGame/library_cards_num']
    },
    cueNum: function () {
      return this.$store.getters['myGame/cue_num']
    },
    chanceNum: function () {
      return this.$store.getters['myGame/chance_num']
    },
    score: function () {
      return this.$store.getters['myGame/score']
    },
    discardCardsNum: function () {
      return this.$store.getters['myGame/discard_cards_num']
    },
    successCards: function () {
      return this.$store.getters['myGame/success_cards']
    },
    roundPlayerIsHost: function () {
      return this.$store.getters['myGame/round_player_is_host']
    },
    logList: function () {
      return this.$store.getters['myGame/log_list2']
    }
  },
  /* watch:{
    log_list () {
      document.getElementById('log-list').scrollTop(document.getElementById('log-list').clientHeight)
    }
  },*/
  methods: {
    getGameInfo () {
      this.$store.dispatch('myGame/GetGameInfo')
    },
    endGame () {
      this.$store.dispatch('myGame/End')
    },
    showCardOperation (cards, card, type) {
      this.clearSelect()
      // cards所有手牌
      // card选中的手牌
      // type 0:自己的手牌 1:对手的手牌
      // let index = cards.indexOf(card) //序号 从左至右 0-4

      if (type === 0) {
        this.cardSelectOrd = card.ord
      } else if (type === 1) {
        this.cardSelectColor = card.color
        this.cardSelectNum = card.num
        this.cardSelectOrd = card.ord
      }

      this.cardOperationType = type
      this.cardOperationShow = true
    },
    clearSelect () {
      this.cardSelectColor = -1
      this.cardSelectNum = -1
      this.cardSelectOrd = -1
      this.cardOperationType = -1
    },
    doDiscard () {
      this.$store.dispatch('myGame/DoDiscard', this.cardSelectOrd).then((res) => {
        if (res.success) {
          this.cardOperationShow = false
        } else {
          this.cardOperationShow = false
          Toast(res.msg)
        }
      })
    },
    doPlay () {
      this.$store.dispatch('myGame/DoPlay', this.cardSelectOrd).then((res) => {
        if (res.success) {
          this.cardOperationShow = false
        } else {
          this.cardOperationShow = false
          Toast(res.msg)
        }
      })
    },
    doCue (cueType) {
      this.$store.dispatch('myGame/DoCue', [this.cardSelectOrd, cueType]).then((res) => {
        if (res.success) {
          this.cardOperationShow = false
        } else {
          this.cardOperationShow = false
          Toast(res.msg)
        }
      })
    }
  }
}
