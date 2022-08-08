<template>
  <div class="container">
    <div class="tool">
      <DragCard title="地震查询">
        <QuakeDataSearch  @footer="footerStatusChange" @search="search"></QuakeDataSearch>
      </DragCard>
    </div>
    <div class="map">
      <MapContainer @map-created="mapInit" />
    </div>
    <div class="footer">
      <template v-if="footerStatus">
        <FooterContainer :quakeInformation="sqlQueryResult"></FooterContainer>
      </template>
    </div>
  </div>
</template>

<script setup>
  import { onBeforeMount, onMounted, shallowReactive, reactive, ref } from "vue"
  // import BreadCrumb from "@/components/Common/BreadCrumb"
  import DragCard from "@/components/Common/DragCard.vue"
  import QuakeDataSearch from "@/components/Common/QuakeDataSearch"
  import MapContainer from "@/components/MapContainer/MapContainer"
  import FooterContainer from "@/components/FooterContainer/FooterContainer.vue"
  import { earthquake } from "@/api/base.js"
  import { sqlQuery } from "@/utils/analysis"
  import { pulsingIcon } from "@/utils/icon.js"

  const footerStatus = ref(true)
  const sqlQueryResult = ref([])
  const sqlResultFeatures = ref(null)

  const customMap = shallowReactive({
    map: null,
    features: null,
  })
  const mapInit = mapObject => {
    customMap.map = mapObject.map
    // initHeatMap()
  }

  // 地震信息查询窗口状态
  const aside = status => {
    asideShow.value = status
  }

  // 地震信息列表状态
  const footerStatusChange = status => {
    footerStatus.value = status
  }

  onMounted(() => {
    earthquake().then(res => {
      console.log(res)
    })
    // console.log(customMap.map)
  })

  // 获取SQL查询到的数据并传给子组件
  const search = async sqlFilter => {
    const { features } = await sqlQuery(sqlFilter)
    // console.log(features)
    sqlResultFeatures.value = features
    // console.log(sqlResultFeatures.value)

    let sqlData = features.map(item => {
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

    drawLayer(features)
  }

  const drawLayer = queryResult => {
    // try {
    //   customMap.map.removeLayer(sqlLayer)
    //   // maps.control.removeLayer(sqlLayer)
    // } catch (error) {}

    // customMap.map.flyTo(
    //   L.latLng(
    //     sqlQueryResult.features[0].properties.LAT,
    //     sqlQueryResult.features[0].properties.LNG
    //   ),
    //   8
    // )
    let sqlLayer = L.geoJSON(queryResult, {
      pointToLayer: (geoJsonPoint, latlng) => {
        // console.log(geoJsonPoint)
        // 震级大于等于 6
        if (geoJsonPoint.properties.CLASS >= 6) {
          return L.marker(latlng, {
            icon: pulsingIcon(geoJsonPoint.properties.CLASS * 2.5, "#F60", "#ff0000"),
          }).bindPopup(
            `<p>震源: ${geoJsonPoint.properties.LOCATION}</p><p>震级: ${geoJsonPoint.properties.CLASS}</p><p>深度: ${geoJsonPoint.properties.DEPTH} 千米</p><p>发震时刻: ${geoJsonPoint.properties.QUAKEDATE}</p`
          )
        }
        return L.marker(latlng, {
          icon: pulsingIcon(geoJsonPoint.properties.CLASS * 2.5, "#F60", "#efcc00", false),
        }).bindPopup(
          `<p>震源: ${geoJsonPoint.properties.LOCATION}</p><p>震级: ${geoJsonPoint.properties.CLASS}</p><p>深度: ${geoJsonPoint.properties.DEPTH} 千米</p><p>发震时刻: ${geoJsonPoint.properties.QUAKEDATE}</p`
        )
      },
    })
    sqlLayer
      .on("mousemove", e => e.layer.openPopup())
      .on("mouseout", e => e.layer.closePopup())
      .on("click", e => customMap.map.flyTo(e.latlng, 8))
      .addTo(customMap.map)

    // maps.control.addOverlay(sqlLayer, "地震点")
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
    bottom: 5px;
    width: 800px;
  }

  .tool {
    position: absolute;
    margin-left: 10px;
    margin-top: 20px;
    width: 380px;
    height: 300px;
    z-index: 2;
    background: #fff;
  }
</style>
