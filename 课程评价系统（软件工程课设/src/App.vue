<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  beforeCreate(){
      // console.log(sessionStorage.themeStyle);
    if(localStorage.themeStyle){
      import('./theme/'+localStorage.themeStyle+'.less')
    }else {
        import('./theme/dark.less')
    }
  },
  mounted() {
  },
  // beforeDestroy(){
  //   this.socketApi.close()
  // }
};
</script>

<style lang="less">
@import "./reset.less";
</style>
