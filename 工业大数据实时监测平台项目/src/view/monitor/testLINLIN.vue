<template>
    <div id="zhaosi"></div>
</template>

<script>
  import HighCharts from "highcharts/highstock";
  import boost from "highcharts/modules/boost.js";
  import theme from "highcharts/themes/grid-light.js";
  theme(HighCharts);
  boost(HighCharts);
    export default {
        mounted(){
          let chart = new HighCharts.Chart('zhaosi',{

            title:{text:'zhaosi'},
            series: []
          })
        }
    }
</script>

<style scoped>

</style>
