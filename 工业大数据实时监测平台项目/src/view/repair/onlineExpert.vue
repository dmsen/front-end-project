<template>
  <Card :bordered="false" :shadow="true">
    <Row>
      <i-col span="4" style="margin: 4px">
        <Card :bordered="true" :shadow="false">
          <div class="box">
            <img class="img">
          </div>
          <div class="context">
            <p>姓名: *师傅</p>
            <p>类型: 设备维修</p>
          </div>
        </Card>
      </i-col>
    </Row>
  </Card>
</template>

<script>
export default {};
</script>

<style lang='less' scoped>
.box {
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 1px;
}
.img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
</style>
