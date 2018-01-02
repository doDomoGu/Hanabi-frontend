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
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
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

    this.ratio = getPixelRatio(this.ctx);
    //console.log(ratio);

    /* 设置canvas宽度高度，铺满全屏 */
    this.canvas.width = window.innerWidth * this.ratio ;
    this.canvas.height = (window.innerHeight - 40) * this.ratio;
    this.ctx.fillStyle = "#dedede"; //屏幕背景色
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

    /* 常量 */
    this.player_area_color = "#7baadc"; //玩家区域的背景色

    this.left_pad = 10 * this.ratio; //左侧pad
    this.right_pad = this.canvas.width - 20 * this.ratio; //右侧pad

    this.player_height = 140 * this.ratio; //玩家区域的高度
    this.btn_height = 30 * this.ratio; //按钮高度

    this.player_1_y_offset = 10  * this.ratio; //玩家1区域的上下位置偏移量
    this.player_2_y_offset = 160 * this.ratio; //玩家2区域的上下位置偏移量
    this.exit_btn_y_offset = 320 * this.ratio; //退出按钮区域的上下位置偏移量

    this.exit_btn_color    = "#dc0c22"

    /* 绘图 */

    //绘制玩家1和玩家2区域
    this.ctx.fillStyle = this.player_area_color;
    this.drawRoundedRect({x:this.left_pad, y:this.player_1_y_offset, width: this.right_pad, height:this.player_height}, 10 * this.ratio, this.ctx);
    this.drawRoundedRect({x:this.left_pad, y:this.player_2_y_offset, width: this.right_pad, height:this.player_height}, 10 * this.ratio, this.ctx);

    //绘制退出按钮
    this.ctx.fillStyle = this.exit_btn_color;
    this.drawRoundedRect({x:this.left_pad, y:this.exit_btn_y_offset, width: this.right_pad, height:this.btn_height}, 10 * this.ratio, this.ctx);
    this.ctx.font = '40px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign="center";
    this.ctx.fillText('退出房间',this.canvas.width / 2, 340 * this.ratio);


    //let that = this;
    /* 点击事件 */
    this.canvas.addEventListener("click", function(evt){
      // 获得点击位置
      let getMousePos = function(evt) {
        let rect = that.canvas.getBoundingClientRect();
        return {
          x: (evt.clientX - rect.left) * that.ratio,
          y: (evt.clientY - rect.top) * that.ratio
        };
      }
      let mousePos = getMousePos(evt);
      let message = "鼠标指针坐标：" + mousePos.x + "," + mousePos.y;
      message += '('+that.left_pad+','+that.right_pad+','+that.exit_btn_y_offset+','+(that.exit_btn_y_offset + that.btn_height)+')';
      writeMessage(message);

       if(mousePos.x >= that.left_pad &&
         mousePos.x <= that.right_pad &&
         mousePos.y >= that.exit_btn_y_offset &&
         mousePos.y <= (that.exit_btn_y_offset + that.btn_height)){
         that.exit();
       }
    },false);


    let writeMessage = function(message) {
      that.ctx.clearRect(that.left_pad, 400 * that.ratio, that.right_pad, 40 * that.ratio);
      that.ctx.font = "20px Microsoft JhengHei";
      that.ctx.fillStyle = "tomato";
      that.ctx.textAlign="left";
      that.ctx.fillText(message, 20 * that.ratio, 420 * that.ratio);
    };

  },
  created: function(){

    this.$store.dispatch('my_room/IsInRoom').then(()=>{

      this.$store.dispatch('common/SetTitle2','房间'+this.$store.getters['my_room/room_id']);
      this.$store.dispatch('my_room/GetRoomInfo');

      this.intervalid1 = setInterval(()=>{
        this.$store.dispatch('my_room/GetRoomInfo');
        this.$store.dispatch('my_game/IsInGame').then(()=>{
          if(this.$store.getters['my_game/is_playing']){
            this.$router.push('/game');
          }
        });
      },500);

    });
  },
  watch:{
    'host_player':{
      handler:function(val,oldVal){
        if(val.name!==oldVal.name){
          this.drawPlayerInfo(val,true);
        }
      }
    },
    'guest_player':{
      handler:function(val,oldVal){
        if(val.name!==oldVal.name){
          this.drawPlayerInfo(val,false);
        }
      }
    },
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
    //函数：绘制圆角矩形
    drawRoundedRect(rect, r, ctx) {
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

      //ctx.stroke();  //边框绘制 根据笔触样式(strokeStyle)
      ctx.fill();
    },
    drawPlayerInfo(info,is_host){
      let rect_y_offset,text_y_offset;
      if(is_host){
        rect_y_offset = this.player_1_y_offset + 20 * this.ratio;
        text_y_offset = this.player_1_y_offset + 46 * this.ratio;
      }else{
        rect_y_offset = this.player_2_y_offset + 20 * this.ratio;
        text_y_offset = this.player_2_y_offset + 46 * this.ratio;
      }

      this.ctx.clearRect(this.left_pad + 20 * this.ratio, rect_y_offset, this.right_pad - 40 * this.ratio, 40 * this.ratio);
      this.ctx.font = "36px Microsoft JhengHei";
      this.ctx.fillStyle = "tomato";
      this.ctx.textAlign="left";
      this.ctx.fillText((is_host?'房主':'玩家')+' : '+info.name, this.left_pad + 40 * this.ratio, text_y_offset);
    },
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