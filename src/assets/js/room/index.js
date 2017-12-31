import { MessageBox } from 'mint-ui'

export default {
  name: 'room',
  data () {
    return {
    }
  },
  mounted: function(){
    let canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d');

    var getPixelRatio = function(context) {
      var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

      return (window.devicePixelRatio || 1) / backingStore;
    };

    var ratio = getPixelRatio(ctx);

console.log(ratio);
    console.log(window);
    /*console.log(canvas);*/
    canvas.width = window.innerWidth * ratio ;
    canvas.height = (window.innerHeight - 40) *ratio;

    ctx.fillStyle = "#cececa";
    ctx.fillRect(0,0,window.innerWidth * ratio,(window.innerHeight - 40) *ratio);



    ctx.fillStyle = "#7baadc";
    ctx.strokeStyle = '#7baadc';
    this.drawRoundedRect({x:10 * ratio, y:10 * ratio, width: canvas.width - 20 * ratio, height:140 * ratio}, 10 * ratio, ctx);
    this.drawRoundedRect({x:10 * ratio, y:160 * ratio, width:canvas.width - 20 * ratio, height:140 * ratio}, 10 * ratio, ctx);


    /*ctx.lineWidth = .3;
    ctx.strokeStyle = (new Color(150)).style;*/
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
    Point (x, y) {
      return {x:x, y:y};
    },
    drawRoundedRect(rect, r, ctx) {
      let ptA = this.Point(rect.x + r, rect.y);
      let ptB = this.Point(rect.x + rect.width, rect.y);
      let ptC = this.Point(rect.x + rect.width, rect.y + rect.height);
      let ptD = this.Point(rect.x, rect.y + rect.height);
      let ptE = this.Point(rect.x, rect.y);

      ctx.beginPath();

      ctx.moveTo(ptA.x, ptA.y);
      ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
      ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
      ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
      ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

      ctx.stroke();
      ctx.fill();
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