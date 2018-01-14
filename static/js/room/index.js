import { MessageBox } from 'mint-ui'
import MyCanvas from '../MyCanvas'

export default {
  name: 'room',
  data () {
    return {
    }
  },
  mounted: function () {
    /* document.addEventListener("touchmove", function(e){   //禁用触摸移动
      e.preventDefault()    //阻止默认行为
    });*/

    const that = this
    // console.log(window);
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
    this.playerAreaBgColor = '#5fc0f3' // 玩家区域的背景色
    this.playerInfoBgColor = '#ccf0f1' // 玩家信息的背景色
    this.playerInfoTextColor = '#283085' // 玩家信息的文本色

    this.playerButtonBgColor = '#f18d98' // 玩家按钮的背景色
    this.playerButtonTextColor = '#e7f1ef' // 玩家按钮的文本色
    this.playerButtonDisableBgColor = '#e7f1ef' // 玩家按钮(禁用)的背景色
    this.playerButtonDisableTextColor = '#626262' // 玩家按钮(禁用)的文本色

    this.exitButtonColor = '#dc0c22' // 退出按钮颜色
    this.exitButtonTouchColor = '#8d0917' // 退出按钮颜色(触摸时)

    this.radius = 10 * this.ratio // 矩形圆角半径

    this.topLeftPad = 10 * this.ratio // 左侧pad
    this.topWidth = this.canvas.width - this.topLeftPad * 2 // 去除左右pad后的宽度

    this.playerAreaX = this.topLeftPad // 玩家区域x偏移量(相对整个画布)
    this.playerAreaHostY = 10 * this.ratio // 房主玩家区域y偏移量(相对整个画布)
    this.playerAreaGuestY = 160 * this.ratio // 访客玩家区域y偏移量(相对整个画布)
    this.playerAreaHeight = 140 * this.ratio // 玩家区域的高度
    this.playerAreaWidth = this.topWidth // 玩家区域的宽度

    this.playerButtonXOffset = 20 * this.ratio // 玩家区域内按钮x偏移量(相对玩家区域)
    this.playerButtonYOffset = 80 * this.ratio // 玩家区域内按钮y偏移量(相对玩家区域)
    this.playerButtonWidth = 100 * this.ratio // 玩家区域内按钮宽度
    this.playerButtonHeight = 30 * this.ratio // 玩家区域内按钮高度

    this.playerButtonTextXOffset = 20 * this.ratio // 玩家区域内按钮内文字x偏移量(相对按钮区域)
    this.playerButtonTextYOffset = 20 * this.ratio // 玩家区域内按钮内文字y偏移量(相对按钮区域)

    this.playerButtonRectHost = {
      x: this.playerAreaX + this.playerButtonXOffset,
      y: this.playerAreaHostY + this.playerButtonYOffset,
      w: this.playerButtonWidth,
      h: this.playerButtonHeight
    }
    this.playerButtonRectGuest = {
      x: this.playerAreaX + this.playerButtonXOffset,
      y: this.playerAreaGuestY + this.playerButtonYOffset,
      w: this.playerButtonWidth,
      h: this.playerButtonHeight
    }

    this.exitBtnX = this.topLeftPad // 退出按钮x偏移量(相对整个画布)
    this.exitBtnY = 320 * this.ratio // 退出按钮y偏移量(相对整个画布)
    this.exitBtnH = 30 * this.ratio // 退出按钮高度
    this.exitBtnW = this.topWidth // 退出按钮宽度

    // this.exit_btn_text_x  = 20 * this.ratio;    //退出按钮内文字x偏移量(相对按钮区域)
    this.exitBtnTextY = 20 * this.ratio // 退出按钮内文字y偏移量(相对按钮区域)

    /* 绘图 */

    // 绘制玩家1和玩家2区域
    this.ctx.fillStyle = this.playerAreaBgColor
    MyCanvas.drawRoundedRect(
      {
        x: this.playerAreaX,
        y: this.playerAreaHostY,
        w: this.playerAreaWidth,
        h: this.playerAreaHeight
      },
      this.radius,
      this.ctx
    )
    MyCanvas.drawRoundedRect(
      {
        x: this.playerAreaX,
        y: this.playerAreaGuestY,
        w: this.playerAreaWidth,
        h: this.playerAreaHeight
      },
      this.radius,
      this.ctx
    )

    this.drawPlayerInfo({}, true)
    this.drawPlayerInfo({}, false)

    // 绘制退出按钮
    this.ctx.fillStyle = this.exitButtonColor
    MyCanvas.drawRoundedRect(
      {
        x: this.exitBtnX,
        y: this.exitBtnY,
        w: this.exitBtnW,
        h: this.exitBtnH
      },
      this.radius,
      this.ctx
    )
    this.ctx.font = '40px Arial'
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('退出房间', this.canvas.width / 2, this.exitBtnY + this.exitBtnTextY)

    /* 点击事件 */
    this.canvas.addEventListener('click', function (evt) {
      // console.log(evt); return true;
      // evt = evt.changedTouches[0]; //touchend
      // evt = evt.touches[0];   //touchstart
      const mousePos = MyCanvas.getMousePos(that.canvas, evt, that.ratio)
      // writeMessage("鼠标指针坐标：" + mousePos.x + "," + mousePos.y);
      if (that.isExitBtnPath(mousePos)) {
        that.ctx.fillStyle = that.exitButtonTouchColor
        MyCanvas.drawRoundedRect(
          {
            x: that.exitBtnX,
            y: that.exitBtnY,
            w: that.exitBtnW,
            h: that.exitBtnH
          },
          that.radius,
          that.ctx
        )
        that.ctx.font = '40px Arial'
        that.ctx.fillStyle = '#FFFFFF'
        that.ctx.textAlign = 'center'
        that.ctx.fillText('退出房间', that.canvas.width / 2, that.exitBtnY + that.exitBtnTextY)
        setTimeout(function () {
          that.exit()
        }, 200)

        // that.exit();
      } else if (that.isReadyBtnPath(mousePos) && !that.isHost) {
        that.doReady()
      } else if (that.isStartBtnPath(mousePos) && that.isHost && that.isReady) {
        that.startGame()
      }
    }, false)

    /* let writeMessage = function(message) {
      that.ctx.clearRect(that.topLeftPad, 400 * that.ratio, that.topWidth, 40 * that.ratio);
      that.ctx.font = "20px Microsoft JhengHei";
      that.ctx.fillStyle = "tomato";
      that.ctx.textAlign="left";
      that.ctx.fillText(message, 20 * that.ratio, 420 * that.ratio);
    };*/
  },
  created: function () {
    this.$store.dispatch('myRoom/GetInfo', { force: true }).then(() => {
      this.$store.dispatch('common/SetTitle2', '房间' + this.$store.getters['myRoom/roomId'])
      this.drawPlayerButton()
      this.intervalid1 = setInterval(() => {
        this.$store.dispatch('myRoom/GetInfo').then((res) => {
          if (res.success) {
            if (res.data.gameStart) {
              this.$router.push('/game')
            }
          }
        })
      }, 500)
    })
  },
  watch: {
    'hostPlayer': {
      handler: function (val, oldVal) {
        // console.log('host_player');
        // console.log(val);
        // console.log(oldVal);
        if (val.name !== oldVal.name) {
          this.drawPlayerInfo(val, true)
        }
      }
    },
    'guestPlayer': {
      handler: function (val, oldVal) {
        // console.log('guest_player');
        // console.log(val);
        // console.log(oldVal);
        if (val.name !== oldVal.name) {
          this.drawPlayerInfo(val, false)
        }
        /* if(val.is_ready!==oldVal.is_ready){
          this.drawPlayerButton(val.is_ready)
        }*/
      }
    },
    'isReady': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.drawPlayerButton(val)
        }
      }
    },
    'isHost': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.drawPlayerButton(this.isReady)
        }
      }
    }
  },
  beforeDestroy () {
    this.$store.commit('myRoom/ClearRoomId')
    this.$store.commit('myRoom/ClearIsHost')
    this.$store.commit('myRoom/ClearRoomPlayer')
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
    isReady: function () {
      return this.$store.getters['myRoom/isReady']
    }
  },
  methods: {
    drawPlayerInfo (info, isHost) {
      let rectYOffset, textYOffset
      if (isHost) {
        rectYOffset = this.playerAreaHostY + 20 * this.ratio
        textYOffset = this.playerAreaHostY + 46 * this.ratio
      } else {
        rectYOffset = this.playerAreaGuestY + 20 * this.ratio
        textYOffset = this.playerAreaGuestY + 46 * this.ratio
      }
      const rect = {
        x: this.playerAreaX + 20 * this.ratio,
        y: rectYOffset,
        w: this.playerAreaWidth - 40 * this.ratio,
        h: 40 * this.ratio
      }
      this.ctx.fillStyle = this.playerInfoBgColor

      MyCanvas.drawRoundedRect(rect, this.radius, this.ctx)
      this.ctx.font = '36px Microsoft JhengHei'
      this.ctx.fillStyle = this.playerInfoTextColor
      this.ctx.textAlign = 'left'

      const playerName = info.id > -1 ? info.name + (this.isHost === isHost ? ' (你)' : '') : '--'
      this.ctx.fillText((isHost ? '房主' : '玩家') + ' : ' + playerName, this.playerAreaX + 40 * this.ratio, textYOffset)
    },
    drawPlayerButton (isReady) {
      // TODO绘制按钮还需要优化
      if (this.isHost) {
        if (this.hostPlayer.id === -1) {
          return false
        }
      } else {
        if (this.guestPlayer.id === -1) {
          return false
        }
      }

      this.ctx.font = '30px Microsoft JhengHei'
      this.ctx.textAlign = 'left'
      this.ctx.fillStyle = this.playerAreaBgColor
      MyCanvas.drawRoundedRect(this.playerButtonRectHost, this.radius, this.ctx)
      MyCanvas.drawRoundedRect(this.playerButtonRectGuest, this.radius, this.ctx)

      if (this.isHost) {
        if (isReady) {
          this.ctx.fillStyle = this.playerButtonBgColor
          MyCanvas.drawRoundedRect(this.playerButtonRectHost, this.radius, this.ctx)
          this.ctx.fillStyle = this.playerButtonTextColor
          this.ctx.fillText('开始游戏！', this.playerButtonRectHost.x + this.playerButtonTextXOffset, this.playerButtonRectHost.y + this.playerButtonTextYOffset)
        } else {
          this.ctx.fillStyle = this.playerButtonDisableBgColor
          MyCanvas.drawRoundedRect(this.playerButtonRectHost, this.radius, this.ctx)
          this.ctx.fillStyle = this.playerButtonDisableTextColor
          this.ctx.fillText('开始游戏！', this.playerButtonRectHost.x + this.playerButtonTextXOffset, this.playerButtonRectHost.y + this.playerButtonTextYOffset)
        }
      } else {
        this.ctx.fillStyle = this.playerButtonBgColor
        MyCanvas.drawRoundedRect(this.playerButtonRectGuest, this.radius, this.ctx)
        this.ctx.fillStyle = this.playerButtonTextColor
        if (isReady) {
          this.ctx.fillText('取消准备', this.playerButtonRectGuest.x + this.playerButtonTextXOffset, this.playerButtonRectGuest.y + this.playerButtonTextYOffset)
        } else {
          this.ctx.fillText('准备！', this.playerButtonRectGuest.x + this.playerButtonTextXOffset, this.playerButtonRectGuest.y + this.playerButtonTextYOffset)
        }
      }
    },
    // 判断点击位置是否为"退出"按钮
    isExitBtnPath (mousePos) {
      return (mousePos.x >= this.topLeftPad &&
        mousePos.x <= (this.topLeftPad + this.topWidth) &&
        mousePos.y >= this.exitBtnY &&
        mousePos.y <= (this.exitBtnY + this.exitBtnH))
    },
    // 判断点击位置是否为"准备"按钮
    isReadyBtnPath (mousePos) {
      return (mousePos.x >= this.playerButtonRectGuest.x &&
        mousePos.x <= (this.playerButtonRectGuest.x + this.playerButtonRectGuest.w) &&
        mousePos.y >= this.playerButtonRectGuest.y &&
        mousePos.y <= (this.playerButtonRectGuest.y + this.playerButtonRectGuest.h))
    },
    // 判断点击位置是否为"开始游戏"按钮
    isStartBtnPath (mousePos) {
      return (mousePos.x >= this.playerButtonRectHost.x &&
        mousePos.x <= (this.playerButtonRectHost.x + this.playerButtonRectHost.w) &&
        mousePos.y >= this.playerButtonRectHost.y &&
        mousePos.y <= (this.playerButtonRectHost.y + this.playerButtonRectHost.h))
    },
    exit () {
      MessageBox.confirm('确定要退出房间?').then(action => {
        if (action === 'confirm') {
          this.$store.dispatch('myRoom/Exit').then(() => {
            this.$router.push('/')
          })
        } else {
          // 其他操作
        }
      }, () => {
        // "取消"
        // console.log('cancel')
      })
    },
    doReady () {
      this.$store.dispatch('myRoom/DoReady')
    },
    startGame () {
      this.$store.dispatch('myGame/Start')
    }
  }
}
