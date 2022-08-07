<template>
  <div class="heatmap" v-loading.fullscreen="loading" element-loading-text="数据加载中">
    <div class="toolbar">
      <DragCard title="缓冲区">
        <el-form class="form" :model="form" label-position="left" label-width="auto">
          <el-form-item label="数据源">
            <el-select v-model="form.datasourceName">
              <el-option v-for="item in datasources" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据集">
            <el-select v-model="form.datasetName" @change="datasetChange">
              <el-option v-for="item in datasets" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-select v-model="form.date" filterable>
              <el-option v-for="item in date" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="datasetsPrint(form.datasourceName, form.datasetName, form.date)"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </DragCard>
    </div>
    <MapContainer @map-created="mapInit" />
  </div>
</template>

<script setup>
  // import { ElMessage, ElLoading } from "element-plus"
  import MapContainer from "@/components/MapContainer/MapContainer"
  import DragCard from "@/components/Common/DragCard.vue"
  import { onMounted, onBeforeMount, nextTick, reactive, ref, shallowReactive, watch } from "vue"
  // import initMap from "@/utils/echartsMap"
  import { getDatasourcesName, getDatasetsName, sqlQuery } from "@/utils/analysis"
  import { debounce } from "@/utils/tool.js"
  import { HeatMapLayer } from "@supermap/iclient-leaflet"
  const customMap = shallowReactive({
    map: null,
    features: null,
  })
  const datasources = ref([])
  const datasets = ref([])
  const date = ref([])
  const loading = ref(false)
  const form = reactive({
    datasourceName: "points",
    datasetName: "earthquakePoint",
    date: "2021/03/15 00:00:00",
  })

  // 查询数据
  const datasetsPrint = async (datasourceName, datasetName, date) => {
    const filter = `Date_User > 'to_date(${date})'`
    const datasetNames = [datasourceName + ":" + datasetName]
    const { features } = await sqlQuery({
      filter: filter,
      datasetNames: datasetNames,
      toIndex: 999,
    })
    console.log(features)
  }

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
    getDates(form.datasourceName, form.datasetName)
    // console.log(formDate)
    return Promise.resolve("")
  }
  getDatasetNames()

  // 获取时间集合
  async function getDates(datasourceName, datasetName) {
    try {
      loading.value = false
      // 获取时间
      const {
        features: { features },
        total,
      } = await sqlQuery({
        queryParameter: {
          fields: ["Date_User"],
          groupBy: "Date_User",
          orderBy: "id",
        },
        datasourceName: datasourceName,
        datasetName: datasetName,
        toIndex: 999,
      })
      // console.log(features)
      let getfeature = features.map(feature => {
        return feature.properties.Date_User
      })
      date.value = await Promise.all(getfeature)
      form.date = date.value[0]
      // loading.value = false
      ElMessage({
        showClose: true,
        dangerouslyUseHTMLString: true,
        offset: 50,
        message: `<P>一共${total}条信息</P><p>当前一共为您找到${features.length}条信息</p>`,
        type: "success",
      })
      return await Promise.resolve("")
    } catch (error) {
    } finally {
      loading.value = false
    }
  }

  // 数据集切换获取时间集合
  function datasetChange() {
    getDates(form.datasourceName, form.datasetName)
  }
  // sqlQuery({ filter: "2021-11-28" }).then(res => {
  //   customMap.features = res
  // })

  onMounted(() => {
    sqlQuery({ filter: "2021-11-28" }).then(({ features }) => {
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

  // 添加热力图
  function initHeatMap(features) {
    console.log(features)
    let heatMapLayer = new HeatMapLayer("heatMap", {
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
  .heatmap {
  }
  .toolbar {
    position: absolute;
    top: 100px;
    right: 10px;
    width: 300px;
    text-align: center;
    z-index: 2;
    border-radius: 4px;
  }
  .form {
    padding: 0 5px;
  }
</style>
