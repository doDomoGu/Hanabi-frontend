import { MessageBox } from 'mint-ui'
export default {
  name: 'index',
  data () {
    return {
    }
  },
  mounted: function(){


  },
  created: function(){
    this.$store.dispatch('common/SetTitle2','Hanabi');
    if(this.isLogin()){
      this.$store.dispatch('common/SetTitle2','('+this.$store.getters['auth/user_id']+')');
      this.$store.dispatch('room/List');
      this.$store.dispatch('my_room/GetInfo',{mode:'simple',force:true});
      //this.$store.dispatch('my_game/IsInGame');
    }
  },
  computed : {
    room_list : function() {
      let room_list = this.$store.getters['room/list'];

      for(let room of room_list){
        room._title = '<mt-badge size="small">'+room.id+'</mt-badge>'+' '+room.title;
        room._title = (room.id<100?room.id<10?'00'+room.id:'0'+room.id:room.id)+' '+room.title;

        if(room.password!==''){
          room._title += '[lock]';
        }
      }
      return room_list;
    }
  },
  methods: {
    toLogin(){
      this.$router.push({path:'/login'});
    },
    /*toRegister(){

    },*/
    isLogin(){
      return this.$store.getters['auth/is_login'];
    },
    enterRoom(room_id){
      let that = this;
      this.$store.dispatch('my_room/Enter',room_id).then((res)=>{
        if(res.success){
          that.$router.push('/room');
        }else {
          MessageBox.alert(res.msg + '(' + room_id + ')').then(action => {
            //console.log(action);
          });
        }
      })
    },
    isInRoom(){
      return this.$store.getters['my_room/room_id']>0;
    },
    isInGame(){
      return this.$store.getters['my_game/is_playing'];
    }
  }
}