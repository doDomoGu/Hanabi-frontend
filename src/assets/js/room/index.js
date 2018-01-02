import { MessageBox } from 'mint-ui'

export default {
  name: 'room',
  data () {
    return {
    }
  },
  mounted: function(){
    let that = this;

    //console.log(window);

    /* 获得canvas */
    let canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d');
    //console.log(canvas);

    /* 获得屏幕像素缩放比例 */
    let getPixelRatio = function(context) {
      let backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

      return (window.devicePixelRatio || 1) / backingStore;
    };

    let ratio = getPixelRatio(ctx);
    //console.log(ratio);

    /* 设置canvas宽度高度，铺满全屏 */
    canvas.width = window.innerWidth * ratio ;
    canvas.height = (window.innerHeight - 40) *ratio;
    ctx.fillStyle = "#cececa"; //屏幕背景色
    ctx.fillRect(0,0,canvas.width,canvas.height);

    /* 常量 */


    const player_area_color = "#7baadc"; //玩家区域的背景色
    
    const left_pad = 10 * ratio; //左侧pad
    const right_pad = canvas.width - 20 * ratio; //右侧pad
    
    const player_height = 140 * ratio; //玩家区域的高度
    const btn_height = 30 * ratio; //按钮高度

    const player_1_y_offset = 10  * ratio; //玩家1区域的上下位置偏移量
    const player_2_y_offset = 160 * ratio; //玩家2区域的上下位置偏移量
    const exit_btn_y_offset = 320 * ratio; //退出按钮区域的上下位置偏移量

    const exit_btn_color    = "#dc0c22"

    /* 绘图 */


    //绘制圆角矩形
    let drawRoundedRect = function (rect, r, ctx) {
      let point = function(x, y) {
        return {x:x, y:y};
      }
      let ptA = point(rect.x + r, rect.y);
      let ptB = point(rect.x + rect.width, rect.y);
      let ptC = point(rect.x + rect.width, rect.y + rect.height);
      let ptD = point(rect.x, rect.y + rect.height);
      let ptE = point(rect.x, rect.y);

      ctx.beginPath();

      ctx.moveTo(ptA.x, ptA.y);
      ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
      ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
      ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
      ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

      ctx.stroke();
      ctx.fill();
    }


    ctx.fillStyle = player_area_color;
    ctx.strokeStyle = player_area_color;
    drawRoundedRect({x:left_pad, y:player_1_y_offset, width: right_pad, height:player_height}, 10 * ratio, ctx);
    drawRoundedRect({x:left_pad, y:player_2_y_offset, width: right_pad, height:player_height}, 10 * ratio, ctx);

    ctx.fillStyle = exit_btn_color;
    drawRoundedRect({x:left_pad, y:exit_btn_y_offset, width: right_pad, height:btn_height}, 10 * ratio, ctx);

    ctx.font = '40px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign="center";
    ctx.fillText('退出房间',canvas.width / 2, 340 * ratio);





    /* 点击事件 */
    canvas.addEventListener("click", function(evt){
      // 获得点击位置
      let getMousePos = function(evt) {
        let rect = canvas.getBoundingClientRect();
        return {
          x: (evt.clientX - rect.left)*ratio,
          y: (evt.clientY - rect.top)*ratio
        };
      }
      let mousePos = getMousePos(evt);
      let message = "鼠标指针坐标：" + mousePos.x + "," + mousePos.y;
      message += '('+left_pad+','+right_pad+','+exit_btn_y_offset+','+(exit_btn_y_offset+btn_height)+')';
      writeMessage(canvas, message);

       if(mousePos.x >= left_pad && mousePos.x <= right_pad && mousePos.y >= exit_btn_y_offset &&  mousePos.y <= (exit_btn_y_offset+btn_height)){
         that.exit();
       }
    },false);


    let writeMessage = function(canvas,message) {
      ctx.clearRect(left_pad, 400 * ratio, right_pad, 40 * ratio);
      ctx.font = "20pt Microsoft JhengHei";
      ctx.fillStyle = "tomato";
      ctx.textAlign="left";
      ctx.fillText(message, 20 * ratio, 420 * ratio);
    };

  },
  created: function(){

    this.$store.dispatch('my_room/IsInRoom').then(()=>{

      this.$store.dispatch('common/SetTitle2','房间'+this.$store.getters['my_room/room_id']);
      this.getRoomInfo();

      this.intervalid1 = setInterval(()=>{
        this.getRoomInfo();
        this.$store.dispatch('my_game/IsInGame').then(()=>{
          if(this.$store.getters['my_game/is_playing']){
            this.$router.push('/game');
          }
        });
      },500);

    });
  },
  beforeDestroy () {
    clearInterval(this.intervalid1)
  },
  computed : {
    is_host:function() {
      return this.$store.getters['my_room/is_host'];
    },
    host_player:function(){
      return this.$store.getters['my_room/host_player'];
    },
    guest_player:function(){
      return this.$store.getters['my_room/guest_player'];
    }
  },
  methods: {
    exit(){
      MessageBox.confirm('确定要退出房间?').then(action => {
        if(action==='confirm'){
          this.$store.dispatch('my_room/Exit').then(()=>{
            this.$router.push('/');
          });
        }else{
          return false;
        }
      });
    },
    getRoomInfo(){
      this.$store.dispatch('my_room/GetRoomInfo');
    },
    doReady(){
      this.$store.dispatch('my_room/DoReady');
    },
    startGame(){
      this.$store.dispatch('my_game/Start').then((res)=>{
        if(res.success){
          this.$router.push('/game');
        }
      })
    }
  }
}