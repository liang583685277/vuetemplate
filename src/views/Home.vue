<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <input type="text" v-model="from.id">
    <input type="text" v-model="from.str">
    <a href="javascript:void(0)" data-id="1" @click="clFnc">点击10</a>
    <router-link to="/myCenter">个人中心</router-link>
  </div>
</template>

<script>
  import {postAjax} from "../plugins/axios";

export default {
  name: 'Home',
  data(){
    return{
      from:{
        id:'',
        str:''
      }
    }
  },
  components: {},
  methods: {
    clFnc(e) {
      const that = this;
      postAjax('return.php',that.from).then(res=>{
        console.log(res)
      })
      console.log(e.target.dataset.id)
    }
  },
  created() {

  }
}
</script>
