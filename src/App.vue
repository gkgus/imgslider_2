<template>
  <div id="app">
    <index></index>
  </div>
</template>
<script>

  import index from './components/index'
  export default {
    name: 'app',
    components: {
     index
    }
  }
  /*
  * <div id="nav">
      <router-link to="/">이미지 업로드</router-link> |
      <router-link to="/slideShow">슬라이드쇼</router-link>
    </div>
    <router-view/>
  *
  * */
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
