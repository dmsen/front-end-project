<template>
  <div class="hchartsLine"></div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import boost from "highcharts/modules/boost.js";
import theme from "highcharts/themes/grid-light.js";
theme(Highcharts);
boost(Highcharts);
Highcharts.setOptions({
  global: {
    timezoneOffset: 8 * 60,
    useUTC: false
  },
  lang: {
    resetZoom: "重置缩放"
  }
});
let chart = null;
export default {
  props: ["options", "styles"],
  name: "hchartsLine",
  watch: {
    options: {
      handler(newValue, oldValue) {
        this.options = newValue;
        this.initChart();
      },
      deep: true
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      let that = this;
      chart = new Highcharts.Chart(this.$el, {
        chart: {
          borderRadius: 4,
          zoomType: "x"
        },
        credits: {
          enabled: false
        },
        title: {
          text: this.options.title || ""
        },
        subtitle: {
          text: this.options.subtitle || ""
        },
        colors: this.options.color || [
          "#058DC7",
          "#50B432",
          "#ED561B",
          "#DDDF00",
          "#24CBE5",
          "#64E572",
          "#FF9655",
          "#FFF263",
          "#6AF9C4"
        ],
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L",
            second: "%H:%M:%S",
            minute: "%H:%M",
            hour: "%H:%M",
            day: "%m-%d",
            week: "%m-%d",
            month: "%Y-%m",
            year: "%Y"
          }
        },
        plotOptions: {
          series: {
            cursor: "pointer",
            allowPointSelect: true,
            animation: false
            // events: {
            //   click: function(e) {
            //     that.addMarker(e.point);
            //   }
            // }
          }
        },
        legend: {
          enabled: true,
          symbolHeight: 0.01
        },
        series: this.options.series,
        tooltip: {
          shared: true,
          split: true,
          dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L",
            second: "%H:%M:%S",
            minute: "%H:%M",
            hour: "%H:%M",
            day: "%Y-%m-%d",
            week: "%m-%d",
            month: "%Y-%m",
            year: "%Y"
          }
        }
      });
    }
    // addMarker(e) {
    //   // 添加markPoint
    //   if (this.markList.indexOf(e.index) != -1) {
    //     chart.xAxis[0].removePlotLine(e.index);
    //     this.markList[this.markList.indexOf(e.index)] = null;
    //   } else {
    //     chart.xAxis[0].addPlotLine({
    //       value: e.category,
    //       color: "pink",
    //       width: 2,
    //       id: e.index,
    //       label: e.y
    //     });
    //     this.markList.push(e.index);
    //   }
    // }
  }
};
</script>

<style lang="less">
.highcharts-graph {
  stroke-width: 2;
}
</style>
