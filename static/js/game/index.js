import { MessageBox, Toast } from 'mint-ui'
import XDialog from 'vux/src/components/x-dialog'
import MyCanvas from '../MyCanvas'

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
    const that = this
    // console.log(window)
    /* 获得canvas */
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.ratio = MyCanvas.getPixelRatio(this.ctx)

    /* 设置canvas宽度高度，铺满全屏 */
    this.canvas.width = window.innerWidth * this.ratio
    this.canvas.height = (window.innerHeight - 40) * this.ratio
    this.ctx.fillStyle = '#dedede' // 屏幕背景色
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    /* 常量 */
    // 玩家区域 player_area
    // 玩家信息 player_info (在player_area内部)
    // 玩家信息文字  player_info_text
    // 桌面区域 table_area

    const playerAreaXPad = 20 * this.ratio // 玩家区域内的左右留白
    const playerAreaYPad = 10 * this.ratio // 玩家区域内的上留白
    const playerInfoPad = 20 * this.ratio // 玩家信息文字相对玩家信息的留白

    const tableAreaXPad = 20 * this.ratio // 桌面区域内的左右留白
    const tableAreaYPad = 10 * this.ratio // 桌面区域内的上留白

    this.radius = 4 * this.ratio // 矩形圆角半径

    // 区块的宽高(尺寸)
    this.playerAreaW = this.canvas.width // 玩家区域的宽度
    this.playerAreaH = 150 * this.ratio // 玩家区域的高度

    this.playerInfoW = this.playerAreaW - playerAreaXPad * 2 // 玩家信息的宽度
    this.playerInfoH = 30 * this.ratio // 玩家信息的高度

    const cardW = 50 * this.ratio
    const cardH = 80 * this.ratio

    this.playerHandsW = 50 * this.ratio // 手牌宽度
    this.playerHandsH = 80 * this.ratio // 手牌高度

    this.tableAreaW = this.canvas.width // 桌面区域的宽度
    this.tableAreaH = 100 * this.ratio // 桌面区域的高度

    this.tableLibraryW = cardW // 桌面牌库的宽度
    this.tableLibraryH = cardH // 桌面牌库的高度

    this.tableSuccessCardsW = 20 * this.ratio // 桌面成功的卡牌的宽度
    this.tableSuccessCardsH = 40 * this.ratio // 桌面成功的卡牌的高度

    this.tableDiscardW = cardW // 桌面弃牌堆的宽度
    this.tableDiscardH = cardH // 桌面弃牌堆的高度

    this.historyAreaW = this.canvas.width // 游戏历史区域的高度
    this.historyAreaH = 100 * this.ratio // 游戏历史区域的高度

    /* 颜色 */
    this.playerAreaBgColor = '#5fc0f3' // 玩家区域的背景色
    this.playerInfoBgColor = '#ccf0f1' // 玩家信息的背景色
    this.playerInfoTextColor = '#283085' // 玩家信息的文本色
    this.playerHandsColors = [ // 手牌牌面背景色
      '#f2f2f2', // 白
      '#4f82c3', // 蓝
      '#c3c30d', // 黄
      '#c33b00', // 红
      '#3ac34b' // 绿
    ]
    this.playerHandsBackColor = '#8f8f8b' // 手牌背景背景色
    this.playerHandsStrokeColor = '#111111' // 手牌边框颜色

    this.tableAreaBgColor = '#f3ca90' // 桌面区域的背景色
    this.tableLibraryBgColor = this.playerHandsBackColor // 桌面牌库的背景色
    this.tableDiscardBgColor = this.playerHandsBackColor // 桌面弃牌堆的背景色

    this.historyAreaBgColor = '#b55170' // 游戏历史区域的背景色

    /* xy位置偏移量 */
    this.playerAreaX = 0 // 玩家区域x偏移量
    this.playerAreaHostY = 0 // (房主)玩家区域y偏移量
    this.playerAreaGuestY = this.playerAreaH + this.tableAreaH + this.historyAreaH // (访客)玩家区域y偏移量

    this.playerInfoX = this.playerAreaX + playerAreaXPad // 玩家信息x偏移量
    this.playerInfoHostY = this.playerAreaHostY + playerAreaYPad // (房主)玩家信息y偏移量
    this.playerInfoGuestY = this.playerAreaGuestY + playerAreaYPad // (访客)玩家信息y偏移量
    // 玩家信息的高度

    this.playerInfoTextX = this.playerInfoX + playerInfoPad // 玩家信息内文字x偏移量
    this.playerInfoTextHostY = this.playerInfoHostY + playerInfoPad // (房主)玩家信息内文字y偏移量
    this.playerInfoTextGuestY = this.playerInfoGuestY + playerInfoPad // (访客)玩家信息内文字y偏移量

    this.playerHandsFirstX = 20 * this.ratio // 玩家手牌第一张x偏移量(相对玩家区域)
    this.playerHandsHostY = this.playerInfoHostY + this.playerInfoH + 20 * this.ratio // (房主)玩家手牌y偏移量
    this.playerHandsGuestY = this.playerInfoGuestY + this.playerInfoH + 20 * this.ratio // (访客)玩家手牌y偏移量

    this.playerHandsPad = 16 * this.ratio // 手牌之间的留白距离

    this.playerHandsHostRects = [] // (房主)玩家的全部手牌路径信息
    for (let n = 0; n < 5; n++) {
      this.playerHandsHostRects.push(
        {
          x: this.playerHandsFirstX + (this.playerHandsW + this.playerHandsPad) * n,
          y: this.playerHandsHostY,
          w: this.playerHandsW,
          h: this.playerHandsH
        }
      )
    }

    this.playerHandsGuestRects = [] // (访客)玩家的全部手牌路径信息
    for (let n = 0; n < 5; n++) {
      this.playerHandsGuestRects.push(
        {
          x: this.playerHandsFirstX + (this.playerHandsW + this.playerHandsPad) * n,
          y: this.playerHandsGuestY,
          w: this.playerHandsW,
          h: this.playerHandsH
        }
      )
    }

    this.tableAreaX = 0 // 桌面区域x偏移量
    this.tableAreaY = this.playerAreaH // 桌面区域y偏移量

    this.tableLibraryX = this.tableAreaX + tableAreaXPad // 牌库区域x偏移量
    this.tableLibraryY = this.tableAreaY + tableAreaYPad // 牌库区域y偏移量

    this.tableNumX = this.tableLibraryX + this.tableLibraryW + 10 * this.ratio // 牌库区域x偏移量
    this.tableNumY = this.tableAreaY + tableAreaYPad // 牌库区域y偏移量

    this.tableSuccessCardsX = this.tableNumX + 50 * this.ratio // 成功的卡牌区域x偏移量
    this.tableSuccessCardsY = this.tableAreaY + tableAreaYPad // 成功的卡牌区域y偏移量
    this.tableSuccessCardsPad = 6 * this.ratio // 成功的卡牌区域之间的留白

    this.tableDiscardX = this.tableAreaX + this.tableAreaW - this.tableDiscardW - 10 * this.ratio // 弃牌堆x偏移量
    this.tableDiscardY = this.tableAreaY + tableAreaYPad // 弃牌堆y偏移量

    this.historyAreaX = 0 // 游戏历史区域x偏移量
    this.historyAreaY = this.playerAreaH + this.tableAreaH // 游戏历史区域y偏移量

    /* 绘图 */

    // 绘制玩家1和玩家2区域
    this.ctx.fillStyle = this.playerAreaBgColor
    this.ctx.fillRect(this.playerAreaX, this.playerAreaHostY, this.playerAreaW, this.playerAreaH)
    this.ctx.fillRect(this.playerAreaX, this.playerAreaGuestY, this.playerAreaW, this.playerAreaH)

    // 绘制桌面
    this.ctx.fillStyle = this.tableAreaBgColor
    this.ctx.fillRect(this.tableAreaX, this.tableAreaY, this.tableAreaW, this.tableAreaH)

    // 牌库
    this.ctx.fillStyle = this.tableLibraryBgColor
    MyCanvas.drawRoundedRect(
      {
        x: this.tableLibraryX,
        y: this.tableLibraryY,
        w: this.tableLibraryW,
        h: this.tableLibraryH
      },
      this.radius,
      this.ctx
    )
    this.ctx.stroke()

    // 弃牌堆
    this.ctx.fillStyle = this.tableDiscardBgColor
    MyCanvas.drawRoundedRect(
      {
        x: this.tableDiscardX,
        y: this.tableDiscardY,
        w: this.tableDiscardW,
        h: this.tableDiscardH
      },
      this.radius,
      this.ctx
    )
    this.ctx.stroke()

    // 绘制游戏历史区域
    this.ctx.fillStyle = this.historyAreaBgColor
    this.ctx.fillRect(this.historyAreaX, this.historyAreaY, this.historyAreaW, this.historyAreaH)

    /* 点击事件 */
    this.canvas.addEventListener('click', function (evt) {
      // console.log(evt) return true
      // evt = evt.changedTouches[0] //touchend
      // evt = evt.touches[0]   //touchstart
      const mousePos = MyCanvas.getMousePos(that.canvas, evt, that.ratio)
      // writeMessage("鼠标指针坐标：" + mousePos.x + "," + mousePos.y)
      const hostHandsOrd = that.isHostHandsPath(mousePos)
      const guestHandsOrd = that.isGuestHandsPath(mousePos)

      if (hostHandsOrd > -1) {
        that.showCardOperation(that.hostHands, that.hostHands[hostHandsOrd], that.isHost ? 0 : 1)
      } else if (guestHandsOrd > -1) {
        that.showCardOperation(that.guestHands, that.guestHands[guestHandsOrd], that.isHost ? 1 : 0)
      } else {
        console.log(1111)
      }
    }, false)
  },
  created: function () {
    this.$store.dispatch('myGame/GetInfo', { mode: 'simple', force: true }).then(() => {
      this.$store.dispatch(
        'common/SetTitle',
        this.$store.getters['common/titleSuffix'] + ' - ' + (this.$store.getters['myGame/isPlaying'] > 0 ? '游戏中' : '错误') + ' _ (' + this.$store.getters['auth/userId'] + ')'
      )
      this.$store.dispatch('myRoom/GetInfo', { force: true })

      this.$store.dispatch('myGame/GetInfo', { force: true })

      this.intervalid1 = setInterval(() => {
        const _score = this.$store.getters['myGame/score'] + ''
        this.$store.dispatch('myGame/GetInfo').then(() => {
          if (!this.$store.getters['myGame/isPlaying']) {
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
    console.log(this)
    clearInterval(this.intervalid1)
  },
  computed: {
    isHost: function () {
      return this.$store.getters['myRoom/isHost']
    },
    hostPlayer: function () {
      return this.$store.getters['myRoom/hostPlayer']
    },
    guestPlayer: function () {
      return this.$store.getters['myRoom/guestPlayer']
    },
    hostHands: function () {
      return this.$store.getters['myGame/hostHands']
    },
    guestHands: function () {
      return this.$store.getters['myGame/guestHands']
    },
    libraryCardsNum: function () {
      return this.$store.getters['myGame/libraryCardsNum']
    },
    cueNum: function () {
      return this.$store.getters['myGame/cueNum']
    },
    chanceNum: function () {
      return this.$store.getters['myGame/chanceNum']
    },
    score: function () {
      return this.$store.getters['myGame/score']
    },
    discardCardsNum: function () {
      return this.$store.getters['myGame/discardCardsNum']
    },
    successCards: function () {
      return this.$store.getters['myGame/successCards']
    },
    roundPlayerIsHost: function () {
      return this.$store.getters['myGame/roundPlayerIsHost']
    },
    logList: function () {
      return this.$store.getters['myGame/logist2']
    }
  },
  watch: {
    'hostPlayer': {
      handler: function (val, oldVal) {
        if (val.name !== oldVal.name) {
          this.drawPlayerInfo(val, true)
        }
      }
    },
    'guestPlayer': {
      handler: function (val, oldVal) {
        if (val.name !== oldVal.name) {
          this.drawPlayerInfo(val, false)
        }
      }
    },
    'hostHands': {
      handler: function (val, oldVal) {
        // TODO
        if (val.length !== oldVal.length) {
          this.drawHands(val, true)
        }
      }
    },
    'guestHands': {
      handler: function (val, oldVal) {
        if (val.length !== oldVal.length) {
          this.drawHands(val, false)
        }
      }
    },
    'libraryCardsNum': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.drawLibraryCardsNum(val)
        }
      }
    },
    'discardCardsNum': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.drawDiscardCardsNum(val)
        }
      }
    },
    'cueNum': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.drawCueNum(val)
        }
      }
    },
    'chanceNum': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.drawChanceNum(val)
        }
      }
    },
    'score': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.drawScore(val)
        }
      }
    },
    'successCards': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.drawSuccessCards(val)
        }
      }
    },
    'roundPlayerIsHost': function (val, oldVal) {
      if (val !== oldVal) {
        this.drawRoundPlayerIsHost(val)
      }
    }
  },
  methods: {
    drawPlayerInfo (info, isHost) {
      let rectYOffset, textYOffset
      if (isHost) {
        rectYOffset = this.playerInfoHostY
        textYOffset = this.playerInfoTextHostY
      } else {
        rectYOffset = this.playerInfoGuestY
        textYOffset = this.playerInfoTextGuestY
      }
      const rect = {
        x: this.playerInfoX,
        y: rectYOffset,
        w: this.playerInfoW,
        h: this.playerInfoH
      }
      this.ctx.fillStyle = this.playerInfoBgColor

      MyCanvas.drawRoundedRect(rect, this.radius, this.ctx)
      this.ctx.font = '36px Microsoft JhengHei'
      this.ctx.fillStyle = this.playerInfoTextColor
      this.ctx.textAlign = 'left'
      this.ctx.fillText((isHost ? '房主' : '玩家') + ' : ' + info.name + (this.isHost === isHost ? ' (你)' : ''), this.playerInfoTextX, textYOffset)
    },
    drawHands (cards, isHost) {
      const that = this
      const drawHandOne = function (rect, isVisible, color = false, num = false) {
        if (isVisible) {
          that.ctx.fillStyle = that.playerHandsColors[color]
        } else {
          that.ctx.fillStyle = that.playerHandsBackColor
        }
        MyCanvas.drawRoundedRect(rect, that.radius, that.ctx)
        // that.ctx.lineWidth = 1 * that.ratio
        that.ctx.strokeStyle = that.playerHandsStrokeColor
        that.ctx.stroke()

        if (isVisible) {
          that.ctx.font = '60px Microsoft JhengHei'
          that.ctx.fillStyle = that.playerInfoTextColor
          that.ctx.textAlign = 'left'
          that.ctx.fillText(that.numbers[num], rect.x + 16 * that.ratio, rect.y + 50 * that.ratio)
        } else {
          that.ctx.font = '60px Microsoft JhengHei'
          that.ctx.fillStyle = that.playerInfoTextColor
          that.ctx.textAlign = 'left'
          that.ctx.fillText(num, rect.x + 16 * that.ratio, rect.y + 50 * that.ratio)
        }
      }
      let rects
      if (isHost) {
        rects = this.playerHandsHostRects
      } else {
        rects = this.playerHandsGuestRects
      }
      for (const c in cards) {
        // isVisible //是你的牌  牌面不可见
        if (this.isHost !== isHost) {
          drawHandOne(rects[c], true, cards[c].color, cards[c].num)
        } else {
          drawHandOne(rects[c], false, cards[c].color, parseInt(c) + 1)
        }
      }
    },
    drawLibraryCardsNum (num) {
      const that = this
      that.ctx.font = '40px Microsoft JhengHei'
      that.ctx.fillStyle = that.playerInfoTextColor
      that.ctx.textAlign = 'left'
      that.ctx.fillText('剩余', that.tableLibraryX + 6 * that.ratio, that.tableLibraryY + 40 * that.ratio)
      that.ctx.fillText(num + '张', that.tableLibraryX + 4 * that.ratio, that.tableLibraryY + 60 * that.ratio)
    },
    drawDiscardCardsNum (num) {
      const that = this
      that.ctx.font = '40px Microsoft JhengHei'
      that.ctx.fillStyle = that.playerInfoTextColor
      that.ctx.textAlign = 'left'
      that.ctx.fillText('弃牌', that.tableDiscardX + 6 * that.ratio, that.tableDiscardY + 40 * that.ratio)
      that.ctx.fillText(num + '张', that.tableDiscardX + 4 * that.ratio, that.tableDiscardY + 60 * that.ratio)
    },
    drawCueNum (num) {
      const that = this
      that.ctx.font = '30px Microsoft JhengHei'
      that.ctx.fillStyle = that.playerInfoTextColor
      that.ctx.textAlign = 'left'
      that.ctx.fillText('提示:' + num, that.tableNumX, that.tableNumY + 30 * that.ratio)
    },
    drawChanceNum (num) {
      const that = this
      that.ctx.font = '30px Microsoft JhengHei'
      that.ctx.fillStyle = that.playerInfoTextColor
      that.ctx.textAlign = 'left'
      that.ctx.fillText('机会:' + num, that.tableNumX, that.tableNumY + 50 * that.ratio)
    },
    drawScore (score) {
      const that = this
      that.ctx.font = '30px Microsoft JhengHei'
      that.ctx.fillStyle = that.playerInfoTextColor
      that.ctx.textAlign = 'left'
      that.ctx.fillText('分数:' + score, that.tableNumX, that.tableNumY + 70 * that.ratio)
    },
    drawSuccessCards (cards) {
      const that = this
      for (const c in cards) {
        const rect = {
          x: this.tableSuccessCardsX + (this.tableSuccessCardsW + this.tableSuccessCardsPad) * c,
          y: this.tableSuccessCardsY,
          w: this.tableSuccessCardsW,
          h: this.tableSuccessCardsH
        }

        that.ctx.fillStyle = that.playerHandsColors[c]
        MyCanvas.drawRoundedRect(rect, that.radius, that.ctx)
        // that.ctx.lineWidth = 1 * that.ratio
        that.ctx.strokeStyle = that.playerHandsStrokeColor
        that.ctx.stroke()

        that.ctx.font = '30px Microsoft JhengHei'
        that.ctx.fillStyle = that.playerInfoTextColor
        that.ctx.textAlign = 'left'
        that.ctx.fillText(cards[c], rect.x + 6 * that.ratio, rect.y + 20 * that.ratio)
      }
    },
    drawRoundPlayerIsHost (isHost) {
      const x = this.playerInfoX + this.playerInfoW - 120 * this.ratio
      const w = 120 * this.ratio
      const h = this.playerInfoH

      const rectHost = {
        x: x,
        y: this.playerInfoHostY,
        w: w,
        h: h
      }

      const rectGuest = {
        x: x,
        y: this.playerInfoGuestY,
        w: w,
        h: h
      }

      let rect
      if (isHost) {
        rect = rectHost
      } else {
        rect = rectGuest
      }

      this.ctx.fillStyle = this.playerInfoBgColor
      MyCanvas.drawRoundedRect(rectHost, this.radius, this.ctx)
      MyCanvas.drawRoundedRect(rectGuest, this.radius, this.ctx)

      this.ctx.font = '26px Microsoft JhengHei'
      this.ctx.fillStyle = this.playerInfoTextColor
      this.ctx.textAlign = 'left'
      this.ctx.fillText('(当前回合玩家)', rect.x, rect.y + 20 * this.ratio)
    },
    isHostHandsPath (mousePos) {
      let ord = -1
      for (let i = 0; i < 5; i++) {
        if (ord === -1 && this.isInPath(mousePos, this.playerHandsHostRects[i])) {
          ord = i
        }
      }
      return ord
    },
    isGuestHandsPath (mousePos) {
      let ord = -1
      for (let i = 0; i < 5; i++) {
        if (ord === -1 && this.isInPath(mousePos, this.playerHandsGuestRects[i])) {
          ord = i
        }
      }
      return ord
    },
    isInPath (mousePos, rect) {
      return mousePos.x >= rect.x &&
        mousePos.x <= (rect.x + rect.w) &&
        mousePos.y >= rect.y &&
        mousePos.y <= (rect.y + rect.h)
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
