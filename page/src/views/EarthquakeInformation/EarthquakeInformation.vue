<template>
  <div class="container">
    <QuakeDataSearch class="tool" @footer="footerStatusChange" @search="search"></QuakeDataSearch>
    <div class="map">
      <!-- <MapContainer mapId="quakeMap" :sqlResultLayer="sqlResultFeatures" style="max-width:1000px; height:500px"> -->
      <MapContainer ref="map" />
    </div>
    <div class="footer">
      <template v-if="footerStatus">
        <el-card shadow="hover" style="margin: 10px 0">
          <FooterContainer :quakeInformation="sqlQueryResult"></FooterContainer>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script setup>
  import { onBeforeMount, onMounted, shallowReactive, reactive, ref } from "vue"
  import BreadCrumb from "@/components/Common/BreadCrumb"
  import QuakeDataSearch from "@/components/Common/QuakeDataSearch"
  import MapContainer from "@/components/MapContainer/MapContainer"
  import FooterContainer from "@/components/FooterContainer/FooterContainer.vue"
  import { sqlQuery } from "@/utils/analysis"

  const map = ref(null)
  const asideShow = ref()
  const footerStatus = ref(true)
  const sqlQueryResult = ref([])
  const sqlResultFeatures = ref({})

  // 地震信息查询窗口状态
  const aside = status => {
    asideShow.value = status
  }

  // 地震信息列表状态
  const footerStatusChange = status => {
    footerStatus.value = status
  }

  onMounted(() => {
    console.log(map.value)
  })

  // 获取SQL查询到的数据并传给子组件
  const search = async sqlFilter => {
    const { features } = await sqlQuery("", sqlFilter)
    console.log(features)
    sqlResultFeatures.value = features
    console.log(sqlResultFeatures.value)
    const { features: sqlResult } = features
    let sqlData = sqlResult.map(item => {
      let temp = {
        class: item.properties.CLASS,
        date: item.properties.QUAKEDATE,
        lat: item.properties.LAT,
        lng: item.properties.LNG,
        depth: item.properties.DEPTH,
        location: item.properties.LOCATION,
      }
      return temp
    })
    sqlQueryResult.value = sqlData
    console.log(sqlQueryResult)
  }
</script>

<script>
  export default {}
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    // position: relative;
  }

  .header {
    // width: 800px;
    height: 40px;
    padding-top: 20px;
  }
  .map {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .footer {
    position: absolute;
    margin-left: 50%;
    transform: translate(-50%);
    bottom: 10px;
    width: 800px;
  }

  .tool {
    position: absolute;
    margin-left: 2%;
    margin-top: 20px;
    width: 400px;
    height: 400px;
    z-index: 2;
  }
</style>
