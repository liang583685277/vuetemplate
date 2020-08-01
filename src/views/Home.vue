<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <a href="javascript:void(0)" data-id="1" @click="clFnc">点击0</a>
    <router-link to="/myCenter">个人中心</router-link>
  </div>
</template>

<script>
import {findReportInfoList} from '@/api/index.js'

export default {
  name: 'Home',
  components: {},
  methods: {
    clFnc(e) {
      console.log(e.target.dataset.id)
    }
  },
  created() {
    findReportInfoList({}).then(data => {
      console.log(data)
    })
  }
}
</script>
