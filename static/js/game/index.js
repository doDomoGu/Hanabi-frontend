import { MessageBox,Toast } from 'mint-ui'
import XDialog from 'vux/src/components/x-dialog'
import MyCanvas from '../MyCanvas'

export default {
  name: 'game',
  components: {
    XDialog
  },
  data () {
    return {
      colors:['white','blue','yellow','red','green'],
      numbers:[1,1,1,2,2,3,3,4,4,5],
      cardOperationShow:false,
      cardOperationType:-1,
      cardSelectOrd:-1,
      cardSelectColor:-1,
      cardSelectNum:-1,
    }
  },
  mounted: function(){
    let that = this;
    //console.log(window);
    /* 获得canvas */
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.ratio = MyCanvas.getPixelRatio(this.ctx);

    /* 设置canvas宽度高度，铺满全屏 */
    this.canvas.width = window.innerWidth * this.ratio ;
    this.canvas.height = (window.innerHeight - 40) * this.ratio;
    this.ctx.fillStyle = "#dedede"; //屏幕背景色
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);


    /* 常量 */
    //玩家区域 player_area
    //玩家信息 player_info (在player_area内部)
    //玩家信息文字  player_info_text
    //桌面区域 table_area


    let player_info_x_pad    = 20 * this.ratio; //玩家信息相对玩家区域的左右留白
    let player_info_y_pad    = 10 * this.ratio; //玩家信息相对玩家区域的上留白
    let player_info_text_pad = 20 * this.ratio; //玩家信息文字相对玩家信息的留白


    this.radius = 4 * this.ratio;               //矩形圆角半径

    //区块的宽高(尺寸)
    this.player_area_w    = this.canvas.width;  //玩家区域的宽度
    this.player_area_h    = 150 * this.ratio;   //玩家区域的高度

    this.player_info_w    = this.player_area_w - player_info_x_pad * 2; //玩家信息的宽度
    this.player_info_h    = 30 * this.ratio;    //玩家信息的高度

    this.player_hands_w   = 50 * this.ratio;    //手牌宽度
    this.player_hands_h   = 80 * this.ratio;    //手牌高度

    this.table_area_h    = 170 * this.ratio;    //桌面区域的高度
    this.table_area_w    = this.canvas.width;   //桌面区域的宽度

    //颜色
    this.player_area_bg_color   = "#5fc0f3";    //玩家区域的背景色
    this.player_info_bg_color   = "#ccf0f1";    //玩家信息的背景色
    this.player_info_text_color = "#283085";    //玩家信息的文本色
    this.player_hands_colors    = [             //手牌牌面背景色
      '#f2f2f2',  //白
      '#4f82c3',  //蓝
      '#c3c30d',  //黄
      '#c33b00',  //红
      '#3ac34b'   //绿
    ];
    this.player_hands_back_color   = "#8f8f8b";     //手牌背景背景色
    this.player_hands_stroke_color = "#111111";     //手牌边框颜色
    this.table_area_bg_color       = "#f3ca90";     //桌面区域的背景色

    //xy位置偏移量
    this.player_area_x        = 0;                  //玩家区域x偏移量
    this.player_area_host_y   = 0;                  //(房主)玩家区域y偏移量
    this.player_area_guest_y  = this.player_area_h + this.table_area_h;   //(访客)玩家区域y偏移量

    this.player_info_x        = this.player_area_x       + player_info_x_pad; //玩家信息x偏移量
    this.player_info_host_y   = this.player_area_host_y  + player_info_y_pad; //(房主)玩家信息y偏移量
    this.player_info_guest_y  = this.player_area_guest_y + player_info_y_pad; //(访客)玩家信息y偏移量
                         //玩家信息的高度

    this.player_info_text_x        = this.player_info_x       + player_info_text_pad; //玩家信息内文字x偏移量
    this.player_info_text_host_y   = this.player_info_host_y  + player_info_text_pad; //(房主)玩家信息内文字y偏移量
    this.player_info_text_guest_y  = this.player_info_guest_y + player_info_text_pad; //(访客)玩家信息内文字y偏移量

    this.player_hands_first_x   = 20 * this.ratio;                              //玩家手牌第一张x偏移量(相对玩家区域)
    this.player_hands_host_y    = this.player_info_host_y  + this.player_info_h + 20 * this.ratio;   //(房主)玩家手牌y偏移量
    this.player_hands_guest_y   = this.player_info_guest_y + this.player_info_h + 20 * this.ratio;   //(访客)玩家手牌y偏移量

    this.player_hands_pad       = 16 * this.ratio;     //手牌之间的留白距离

    this.player_hands_host_rects = [];  //(房主)玩家的全部手牌路径信息
    for(let n=0;n<5;n++){
       this.player_hands_host_rects.push(
         {
           x:this.player_hands_first_x + (this.player_hands_w + this.player_hands_pad) * n,
           y:this.player_hands_host_y,
           w:this.player_hands_w,
           h:this.player_hands_h
         }
       )
    }

    this.player_hands_guest_rects = [];  //(访客)玩家的全部手牌路径信息
    for(let n=0;n<5;n++){
      this.player_hands_guest_rects.push(
        {
          x:this.player_hands_first_x + (this.player_hands_w + this.player_hands_pad) * n,
          y:this.player_hands_guest_y,
          w:this.player_hands_w,
          h:this.player_hands_h
        }
      )
    }

    //桌面区域
    this.table_area_x   = 0;  //玩家区域x偏移量(相对整个画布)
    this.table_area_y   = this.player_area_h;  //房主玩家区域y偏移量(相对整个画布)






    /* 绘图 */

    //绘制玩家1和玩家2区域
    this.ctx.fillStyle = this.player_area_bg_color;
    this.ctx.fillRect(this.player_area_x,this.player_area_host_y,this.player_area_w,this.player_area_h);
    this.ctx.fillRect(this.player_area_x,this.player_area_guest_y,this.player_area_w,this.player_area_h);


    //绘制桌面
    this.ctx.fillStyle = this.table_area_bg_color;
    this.ctx.fillRect(this.table_area_x,this.table_area_y,this.table_area_w,this.table_area_h);

    //牌库
    this.ctx.fillStyle = this.table_area_bg_color;
    this.ctx.fillRect(this.table_area_x,this.table_area_y,this.table_area_w,this.table_area_h);




    /* 点击事件 */
    this.canvas.addEventListener("click", function(evt){
      //console.log(evt); return true;
      //evt = evt.changedTouches[0]; //touchend
      //evt = evt.touches[0];   //touchstart
      let mousePos = MyCanvas.getMousePos(that.canvas,evt,that.ratio);
      //writeMessage("鼠标指针坐标：" + mousePos.x + "," + mousePos.y);
      let host_hands_ord = that.isHostHandsPath(mousePos) ;
      let guest_hands_ord = that.isGuestHandsPath(mousePos) ;

      if(host_hands_ord >-1){
        that.showCardOperation(that.host_hands,that.host_hands[host_hands_ord],that.is_host?0:1)
      }else if(guest_hands_ord >-1){
        that.showCardOperation(that.guest_hands,that.guest_hands[guest_hands_ord],that.is_host?1:0)
      }else{
        console.log(1111);
      }
    },false);
  },
  created: function(){
    this.$store.dispatch('my_game/IsInGame').then(()=>{

      this.$store.dispatch(
        'common/SetTitle',
        this.$store.getters['common/title_suffix']+' - '+(this.$store.getters['my_game/is_playing']>0?'游戏中':'错误')
      );
      this.$store.dispatch('my_room/IsInRoom');

      this.$store.dispatch('my_room/GetRoomInfo');

      this.getGameInfo();

      this.intervalid1 = setInterval(()=>{
        let _score = this.$store.getters['my_game/score']+'';
        this.getGameInfo();

        this.$store.dispatch('my_game/IsInGame').then(()=>{
          if(!this.$store.getters['my_game/is_playing']){
            clearInterval(this.intervalid1)

            MessageBox('提示', '游戏得分['+_score+']，结束').then(action => {
              if(action ==='confirm'){
                this.$router.push('/room');
              }
            });
          }
        });
      },300);
    });
  },
  beforeDestroy () {
    clearInterval(this.intervalid1)
  },
  computed : {
    is_host:function(){
      return this.$store.getters['my_room/is_host'];
    },
    host_player:function(){
      return this.$store.getters['my_room/host_player'];
    },
    guest_player:function(){
      return this.$store.getters['my_room/guest_player'];
    },
    host_hands:function(){
      return this.$store.getters['my_game/host_hands'];
    },
    guest_hands:function(){
      return this.$store.getters['my_game/guest_hands'];
    },
    library_cards_num:function(){
      return this.$store.getters['my_game/library_cards_num'];
    },
    cue_num:function(){
      return this.$store.getters['my_game/cue_num'];
    },
    chance_num:function(){
      return this.$store.getters['my_game/chance_num'];
    },
    score:function(){
      return this.$store.getters['my_game/score'];
    },
    discard_cards_num:function(){
      return this.$store.getters['my_game/discard_cards_num'];
    },
    success_cards:function(){
      return this.$store.getters['my_game/success_cards'];
    },
    round_player_is_host:function(){
      return this.$store.getters['my_game/round_player_is_host'];
    },
    log_list:function(){
      return this.$store.getters['my_game/log_list2'];
    }
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
    'host_hands':{
      handler:function(val,oldVal){
        //TODO
        if(val.length!==oldVal.length){
          this.drawHands(val,true);
        }
      }
    },
    'guest_hands':{
      handler:function(val,oldVal){
        if(val.length!==oldVal.length){
          this.drawHands(val,false);
        }
      }
    },
  },
  methods: {
    drawPlayerInfo(info,is_host){
      let rect_y_offset,text_y_offset;
      if(is_host){
        rect_y_offset = this.player_info_host_y;
        text_y_offset = this.player_info_text_host_y;
      }else{
        rect_y_offset = this.player_info_guest_y;
        text_y_offset = this.player_info_text_guest_y;
      }
      let rect = {
        x: this.player_info_x,
        y: rect_y_offset,
        w: this.player_info_w,
        h: this.player_info_h
      };
      this.ctx.fillStyle = this.player_info_bg_color;

      MyCanvas.drawRoundedRect(rect,this.radius, this.ctx);
      this.ctx.font = "36px Microsoft JhengHei";
      this.ctx.fillStyle = this.player_info_text_color;
      this.ctx.textAlign="left";
      this.ctx.fillText((is_host?'房主':'玩家')+' : '+info.name+(this.is_host===is_host?' (你)':''), this.player_info_text_x, text_y_offset);
    },
    drawHands(cards,is_host){
      let that = this;
      let drawHandOne = function(rect, is_visible, color=false, num=false){
        if(is_visible){
          that.ctx.fillStyle = that.player_hands_colors[color];
        }else{
          that.ctx.fillStyle = that.player_hands_back_color;
        }
        MyCanvas.drawRoundedRect(rect, that.radius, that.ctx);
        //that.ctx.lineWidth = 1 * that.ratio;
        that.ctx.strokeStyle = that.player_hands_stroke_color;
        that.ctx.stroke();

        if(is_visible){
          that.ctx.font = "60px Microsoft JhengHei";
          that.ctx.fillStyle = that.player_info_text_color;
          that.ctx.textAlign="left";
          that.ctx.fillText(num, rect.x + 16 * that.ratio,rect.y + 50 * that.ratio);
        }else{
          that.ctx.font = "60px Microsoft JhengHei";
          that.ctx.fillStyle = that.player_info_text_color;
          that.ctx.textAlign="left";
          that.ctx.fillText(num, rect.x + 16 * that.ratio,rect.y + 50 * that.ratio);
        }
      }
      let rects;
      if(is_host){
        rects = this.player_hands_host_rects;
      }else{
        rects = this.player_hands_guest_rects;
      }
      for(let c in cards){
        //is_visible //是你的牌  牌面不可见
        if(this.is_host !== is_host){
          drawHandOne(rects[c],true,cards[c].color,cards[c].num);
        }else{
          drawHandOne(rects[c],false,cards[c].color,parseInt(c)+1);
        }

      }
    },
    isHostHandsPath(mousePos){
      let ord = -1;
      for(let i = 0; i < 5; i++){
        if(ord === -1 && this.isInPath(mousePos,this.player_hands_host_rects[i])){
          ord = i;
        }
      }
      return ord;
    },
    isGuestHandsPath(mousePos){
      let ord = -1;
      for(let i = 0; i < 5; i++){
        if(ord === -1 && this.isInPath(mousePos,this.player_hands_guest_rects[i])){
          ord = i;
        }
      }
      return ord;
    },
    isInPath(mousePos,rect){
      return  mousePos.x >= rect.x &&
        mousePos.x <= (rect.x + rect.w) &&
        mousePos.y >= rect.y &&
        mousePos.y <= (rect.y + rect.h);
    },
    getGameInfo(){
      this.$store.dispatch('my_game/GetGameInfo');
    },
    endGame(){
      this.$store.dispatch('my_game/End');
    },
    showCardOperation(cards,card,type){
      this.clearSelect();
      console.log(cards);
      console.log(card);
      console.log(type);
      //cards所有手牌
      //card选中的手牌
      //type 0:自己的手牌 1:对手的手牌
      //let index = cards.indexOf(card); //序号 从左至右 0-4

      if(type===0){
        this.cardSelectOrd = card.ord;
      }else if(type===1){
        this.cardSelectColor = card.color;
        this.cardSelectNum = card.num;
        this.cardSelectOrd = card.ord;
      }

      this.cardOperationType = type;
      this.cardOperationShow = true;
    },
    clearSelect(){
      this.cardSelectColor = -1;
      this.cardSelectNum = -1;
      this.cardSelectOrd = -1;
      this.cardOperationType = -1;
    },
    doDiscard(){
      this.$store.dispatch('my_game/DoDiscard',this.cardSelectOrd).then((res)=>{
        if(res.success){
          this.cardOperationShow = false;
        }else{
          this.cardOperationShow = false;
          Toast(res.msg);
        }
      })
    },
    doPlay(){
      this.$store.dispatch('my_game/DoPlay',this.cardSelectOrd).then((res)=>{
        if(res.success){
          this.cardOperationShow = false;
        }else{
          this.cardOperationShow = false;
          Toast(res.msg);
        }
      })
    },
    doCue(cue_type){
      this.$store.dispatch('my_game/DoCue',[this.cardSelectOrd,cue_type]).then((res)=>{
        if(res.success){
          this.cardOperationShow = false;
        }else{
          this.cardOperationShow = false;
          Toast(res.msg);
        }
      })
    },


  }
}