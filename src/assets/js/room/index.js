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
    this.player_area_bg_color   = "#5fc0f3"; //玩家区域的背景色
    this.player_info_bg_color   = "#ccf0f1"; //玩家信息的背景色
    this.player_info_text_color = "#283085"; //玩家信息的文本色

    this.player_button_bg_color           = "#f18d98"; //玩家按钮的背景色
    this.player_button_text_color         = "#e7f1ef"; //玩家按钮的文本色
    this.player_button_disable_bg_color   = "#e7f1ef"; //玩家按钮(禁用)的背景色
    this.player_button_disable_text_color = "#626262"; //玩家按钮(禁用)的文本色

    this.exit_btn_color    = "#dc0c22"   //退出按钮颜色

    this.radius = 10 * this.ratio;            //矩形圆角半径

    this.top_left_pad = 10 * this.ratio;      //左侧pad
    this.top_width    = this.canvas.width - this.top_left_pad * 2; //去除左右pad后的宽度

    this.player_area_x        = this.top_left_pad; //玩家区域x偏移量(相对整个画布)
    this.player_area_host_y   = 10  * this.ratio;  //房主玩家区域y偏移量(相对整个画布)
    this.player_area_guest_y  = 160 * this.ratio;  //访客玩家区域y偏移量(相对整个画布)
    this.player_area_height   = 140 * this.ratio;  //玩家区域的高度
    this.player_area_width    = this.top_width;    //玩家区域的宽度

    this.player_button_x_offset = 20  * this.ratio; //玩家区域内按钮x偏移量(相对玩家区域)
    this.player_button_y_offset = 80  * this.ratio; //玩家区域内按钮y偏移量(相对玩家区域)
    this.player_button_width    = 100 * this.ratio; //玩家区域内按钮宽度
    this.player_button_height   = 30  * this.ratio; //玩家区域内按钮高度

    this.player_button_text_x_offset = 20 * this.ratio;   //玩家区域内按钮内文字x偏移量(相对按钮区域)
    this.player_button_text_y_offset = 20 * this.ratio;   //玩家区域内按钮内文字y偏移量(相对按钮区域)

    this.exit_btn_x      = this.top_left_pad; //退出按钮x偏移量(相对整个画布)
    this.exit_btn_y      = 320 * this.ratio;  //退出按钮y偏移量(相对整个画布)
    this.exit_btn_height = 30 * this.ratio;   //退出按钮高度
    this.exit_btn_width  = this.top_width;    //退出按钮宽度

    //this.exit_btn_text_x  = 20 * this.ratio;    //退出按钮内文字x偏移量(相对按钮区域)
    this.exit_btn_text_y  = 20 * this.ratio;    //退出按钮内文字y偏移量(相对按钮区域)




    /* 绘图 */

    //绘制玩家1和玩家2区域
    this.ctx.fillStyle = this.player_area_bg_color;
    this.drawRoundedRect(
      {
        x:  this.player_area_x,
        y:  this.player_area_host_y,
        w:  this.player_area_width,
        h: this.player_area_height
      },
      this.radius,
      this.ctx
    );
    this.drawRoundedRect(
      {
        x:  this.player_area_x,
        y:  this.player_area_guest_y,
        w:  this.player_area_width,
        h: this.player_area_height
      },
      this.radius,
      this.ctx
    );

    //绘制退出按钮
    this.ctx.fillStyle = this.exit_btn_color;
    this.drawRoundedRect(
      {
        x:this.exit_btn_x,
        y:this.exit_btn_y,
        w: this.exit_btn_width,
        h:this.exit_btn_height
      },
      this.radius,
      this.ctx
    );
    this.ctx.font = '40px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign="center";
    this.ctx.fillText('退出房间',this.canvas.width / 2, this.exit_btn_y + this.exit_btn_text_y);


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
      message += '('+that.top_left_pad+','+that.top_width+','+that.exit_btn_y_offset+','+(that.exit_btn_y_offset + that.btn_height)+')';
      writeMessage(message);

       if(mousePos.x >= that.top_left_pad &&
         mousePos.x <= that.top_width &&
         mousePos.y >= that.exit_btn_y_offset &&
         mousePos.y <= (that.exit_btn_y_offset + that.btn_height)){
         that.exit();
       }else if(mousePos.x >= that.top_left_pad &&
         mousePos.x <= that.top_width &&
         mousePos.y >= that.exit_btn_y_offset &&
         mousePos.y <= (that.exit_btn_y_offset + that.btn_height)){
         that.re();
       }
    },false);


    let writeMessage = function(message) {
      that.ctx.clearRect(that.top_left_pad, 400 * that.ratio, that.top_width, 40 * that.ratio);
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
        if(val.is_ready!==oldVal.is_ready){
          this.drawPlayerButton(val.is_ready)
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
      let ptB = point(rect.x + rect.w, rect.y);
      let ptC = point(rect.x + rect.w, rect.y + rect.h);
      let ptD = point(rect.x, rect.y + rect.h);
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
        rect_y_offset = this.player_area_host_y + 20 * this.ratio;
        text_y_offset = this.player_area_host_y + 46 * this.ratio;
      }else{
        rect_y_offset = this.player_area_guest_y + 20 * this.ratio;
        text_y_offset = this.player_area_guest_y + 46 * this.ratio;
      }
      let rect = {
        x:this.player_area_x + 20 * this.ratio,
        y:rect_y_offset,
        w:this.player_area_width - 40 * this.ratio,
        h:40 * this.ratio
      };
      this.ctx.fillStyle = this.player_info_bg_color;

      this.drawRoundedRect(rect,this.radius, this.ctx);
      this.ctx.font = "36px Microsoft JhengHei";
      this.ctx.fillStyle = this.player_info_text_color;
      this.ctx.textAlign="left";
      this.ctx.fillText((is_host?'房主':'玩家')+' : '+info.name+(this.is_host===is_host?' (你)':''), this.player_area_x + 40 * this.ratio, text_y_offset);
    },
    drawPlayerButton(is_ready){
      let button_width = this.player_button_width;   //按钮宽度
      let button_height = this.player_button_height;   //按钮高度
      let button_x_offset = this.player_button_x_offset; //按钮横轴偏移量
      let button_y_offset = this.player_button_y_offset; //按钮纵轴偏移量
      let radius = this.radius;          //圆角半径

      let text_x_offset = this.player_button_text_x_offset;   //按钮内文字横轴偏移量
      let text_y_offset = this.player_button_text_y_offset;   //按钮内文字纵轴偏移量


      let rect_host = {
        x:this.player_area_x + button_x_offset,
        y:this.player_area_host_y + button_y_offset,
        w: button_width,
        h: button_height
      };
      let rect_guest = {
        x:this.player_area_x + button_x_offset,
        y:this.player_area_guest_y + button_y_offset,
        w: button_width,
        h: button_height
      };

      this.ctx.font = "30px Microsoft JhengHei";
      this.ctx.textAlign="left";

      if(this.is_host){
        if(is_ready){
          this.ctx.fillStyle = this.player_button_bg_color;
          this.drawRoundedRect(rect_host, radius, this.ctx);
          this.ctx.fillStyle = this.player_button_text_color;
          this.ctx.fillText('开始游戏！', rect_host.x + text_x_offset, rect_host.y + text_y_offset);
        }else{
          this.ctx.fillStyle = this.player_button_disable_bg_color;
          this.drawRoundedRect(rect_host, radius, this.ctx);
          this.ctx.fillStyle = this.player_button_disable_text_color;
          this.ctx.fillText('开始游戏！', rect_host.x + text_x_offset, rect_host.y + text_y_offset);
        }
      }else{
        this.ctx.fillStyle = this.player_button_bg_color;
        this.drawRoundedRect(rect_guest, radius, this.ctx);
        this.ctx.fillStyle = this.player_button_text_color;
        if(is_ready){
          this.ctx.fillText('取消准备', rect_guest.x + text_x_offset, rect_guest.y + text_y_offset);
        }else{
          this.ctx.fillText('准备！', rect_guest.x + text_x_offset, rect_guest.y + text_y_offset);
        }
      }
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