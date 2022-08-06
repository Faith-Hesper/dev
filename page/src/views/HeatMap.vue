<template>
  <div id="toolbar">
    <el-card>
      <div>缓冲区</div>
      <el-form :model="form" label-position="left" label-width="auto">
        <el-form-item label="数据源">
          <el-select v-model="form.datasourceName">
            <el-option v-for="item in datasources" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据集">
          <el-select v-model="form.datasetName">
            <el-option v-for="item in datasets" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-select v-model="form.date">
            <el-option label="2" value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="datasetsPrint">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <MapContainer @map-created="mapInit" />
</template>

<script setup>
  import MapContainer from "@/components/MapContainer/MapContainer"
  import { onMounted, onBeforeMount, nextTick, reactive, ref, shallowReactive, watch } from "vue"
  // import initMap from "@/utils/echartsMap"
  import { getDatasourcesName, getDatasetsName, sqlQuery } from "@/utils/analysis"
  // import { HeatMapLayer } from "@supermap/iclient-leaflet"
  const customMap = shallowReactive({
    map: null,
    features: null,
  })
  const datasources = ref([])
  const datasets = ref([])
  const form = reactive({
    datasourceName: "",
    datasetName: "",
    date: "",
  })

  const datasetsPrint = () => {}

  const mapInit = mapObject => {
    customMap.map = mapObject.map
    // initHeatMap()
  }

  const getDatasetNames = async () => {
    // 获取数据源名称集合
    datasources.value = await getDatasourcesName()
    form.datasourceName = datasources.value[0]

    // 获取数据集名称集合
    datasets.value = await getDatasetsName(datasources.value)
    form.datasetName = datasets.value[0]
    // console.log(sources)
  }
  getDatasetNames()

  // sqlQuery({ filter: "2021-11-28" }).then(res => {
  //   customMap.features = res
  // })

  onMounted(() => {
    sqlQuery({ filter: "2021-11-28" }).then(features => {
      initHeatMap(features)
    })
  })
  // watch(
  //   () => customMap.features,
  //   newFeature => {
  //     if (!newFeature || !customMap.map) return
  //     console.log(newFeature)
  //     initHeatMap(newFeature)
  //   }
  // )

  function initHeatMap(features) {
    console.log(features)
    let heatMapLayer = new L.supermap.HeatMapLayer("heatMap", {
      id: "heatmap",
      map: customMap.map,
      radius: 80,
      featureWeight: "CLASS",
    })
    heatMapLayer.addFeatures(features)
    heatMapLayer.addTo(customMap.map)
  }
</script>
<script>
  export default {}
</script>

<style scoped>
  #toolbar {
    position: absolute;
    top: 100px;
    right: 10px;
    width: 300px;
    text-align: center;
    z-index: 500;
    border-radius: 4px;
  }
</style>
