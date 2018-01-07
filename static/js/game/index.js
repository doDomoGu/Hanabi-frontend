import { MessageBox,Toast } from 'mint-ui'
import  XDialog from 'vux/src/components/x-dialog'
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
    this.radius = 10 * this.ratio;            //矩形圆角半径

    this.player_area_bg_color = "#5fc0f3"; //房主玩家区域的背景色
    this.player_area_x        = 0;  //玩家区域x偏移量(相对整个画布)
    this.player_area_host_y   = 0  * this.ratio;  //房主玩家区域y偏移量(相对整个画布)
    this.player_area_guest_y  = 320 * this.ratio;  //访客玩家区域y偏移量(相对整个画布)
    this.player_area_height   = 150 * this.ratio;  //玩家区域的高度
    this.player_area_width    = this.canvas.width;    //玩家区域的宽度

    this.player_info_bg_color   = "#ccf0f1"; //玩家信息的背景色
    this.player_info_text_color = "#283085"; //玩家信息的文本色

    this.player_hands_colors = [
      '#f2f2f2',
      '#4f82c3',
      '#c3c30d',
      '#c33b00',
      '#3ac34b'];  //手牌颜色



    this.table_area_bg_color = '';





    /* 绘图 */

    //绘制玩家1和玩家2区域
    this.ctx.fillStyle = this.player_area_bg_color;
    this.ctx.fillRect(this.player_area_x,this.player_area_host_y,this.player_area_width,this.player_area_height);
    this.ctx.fillRect(this.player_area_x,this.player_area_guest_y,this.player_area_width,this.player_area_height);



    //绘制桌面



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
        rect_y_offset = this.player_area_host_y + 20 * this.ratio;
        text_y_offset = this.player_area_host_y + 40 * this.ratio;
      }else{
        rect_y_offset = this.player_area_guest_y + 20 * this.ratio;
        text_y_offset = this.player_area_guest_y + 40 * this.ratio;
      }
      let rect = {
        x: this.player_area_x + 20 * this.ratio,
        y: rect_y_offset,
        w: this.player_area_width - 40 * this.ratio,
        h: 30 * this.ratio
      };
      this.ctx.fillStyle = this.player_info_bg_color;

      MyCanvas.drawRoundedRect(rect,this.radius, this.ctx);
      this.ctx.font = "36px Microsoft JhengHei";
      this.ctx.fillStyle = this.player_info_text_color;
      this.ctx.textAlign="left";
      this.ctx.fillText((is_host?'房主':'玩家')+' : '+info.name+(this.is_host===is_host?' (你)':''), this.player_area_x + 40 * this.ratio, text_y_offset);
    },
    drawHands(cards,is_host){
      let that = this;
      let drawHandOne = function(rect,is_visible,color=false,num=false){
        if(is_visible){
          that.ctx.fillStyle = that.player_hands_colors[color];
        }else{
          that.ctx.fillStyle = '#8f8f8b';
        }
        MyCanvas.drawRoundedRect(rect,5 * that.ratio,that.ctx);
        that.ctx.strokeColor = '#000';
        that.ctx.stroke();

        if(is_visible){
          that.ctx.font = "60px Microsoft JhengHei";
          that.ctx.fillStyle = that.player_info_text_color;
          that.ctx.textAlign="left";
          that.ctx.fillText(num, rect.x+16*that.ratio,rect.y+50*that.ratio);
        }
      }
      let x_offset = 20 * this.ratio;
      let y_offset;
      if(is_host){
        y_offset = this.player_area_host_y + 60 * this.ratio;
      }else{
        y_offset = this.player_area_guest_y + 60 * this.ratio;
      }
      let w = 50 * this.ratio;
      let h = 80 * this.ratio;
      let pad = 20 * this.ratio;


      for(let c in cards){
        let rect = {
          x:x_offset + (w+pad) * c,
          y:y_offset,
          w:w,
          h:h
        }
        //is_visible //是你的牌  牌面不可见
        drawHandOne(rect,this.is_host !== is_host,cards[c].color,cards[c].num);
      }


      return true;
      let rect_y_offset,text_y_offset;
      if(is_host){
        rect_y_offset = this.player_area_host_y + 20 * this.ratio;
        text_y_offset = this.player_area_host_y + 40 * this.ratio;
      }else{
        rect_y_offset = this.player_area_guest_y + 20 * this.ratio;
        text_y_offset = this.player_area_guest_y + 40 * this.ratio;
      }
      let rect = {
        x: this.player_area_x + 20 * this.ratio,
        y: rect_y_offset,
        w: this.player_area_width - 40 * this.ratio,
        h: 30 * this.ratio
      };
      this.ctx.fillStyle = this.player_info_bg_color;

      MyCanvas.drawRoundedRect(rect,this.radius, this.ctx);
      this.ctx.font = "36px Microsoft JhengHei";
      this.ctx.fillStyle = this.player_info_text_color;
      this.ctx.textAlign="left";
      this.ctx.fillText((is_host?'房主':'玩家')+' : '+info.name+(this.is_host===is_host?' (你)':''), this.player_area_x + 40 * this.ratio, text_y_offset);
    },
    getGameInfo(){
      this.$store.dispatch('my_game/GetGameInfo');
    },
    endGame(){
      this.$store.dispatch('my_game/End');
    },
    showCardOperation(cards,card,type){
      this.clearSelect();
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