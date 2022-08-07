/*
 * @Author: Faith
 * @Date: 2022-04-02 17:08
 * @LastAuthor: Faith
 * @LastEditTime: 2022-08-07 10:07
 * @Description: 超图分析函数
 */

const dataUrl = "http://localhost:8090/iserver/services/data-earthquakePoints/rest/data"
const spatialanalystUrl =
  "http://localhost:8090/iserver/services/spatialAnalysis-earthquakePoints/restjsr/spatialanalyst"

// 获取数据源集合
async function getDatasourcesName(url = dataUrl) {
  return await new Promise((resolve, reject) => {
    L.supermap.datasourceService(url).getDatasources(serviceResult => {
      const datasourceNames = serviceResult.result.datasourceNames
      // console.log(datasourceNames)
      resolve(datasourceNames)
    })
  }).catch(err => console.log(err))
}

// 获取数据集
async function getDatasetsName(datasourceName, url = dataUrl) {
  return await new Promise((resolve, reject) => {
    L.supermap.datasetService(url).getDatasets(datasourceName, function (serviceResult) {
      const datasetNames = serviceResult.result.datasetNames
      resolve(datasetNames)
    })
  }).catch(err => console.log(err))
}

// 日期
async function dateSelect(param) {
  const result = await sqlQuery("", "", "Date_User")
  console.log("1", result)
  datasetsSelect = document.getElementById("dateSelect")
  for (let i = 0, len = result.length; i < len; i++) {
    datasetsSelect.options[i] = new Option(result[i], result[i])
  }
}

// sql查询
async function sqlQuery({
  url = BASE_CONFIG.BASEURL.dataUrl,
  filter = "",
  datasetNames = ["points:earthquakePoint"],
  fromIndex = 0,
  toIndex = 19,
} = {}) {
  let queryParam = {
    name: "earthquakePoint",
    attributeFilter: filter,
  }
  //
  let sqlParameters = {
    queryParameter: queryParam,
    datasetNames: datasetNames,
    fromIndex: fromIndex,
    toIndex: toIndex,
  }
  Object.assign(sqlParameters, ...arguments)
  const sqlParam = new L.supermap.GetFeaturesBySQLParameters(sqlParameters)
  return await new Promise((resolve, reject) => {
    new L.supermap.FeatureService(url).getFeaturesBySQL(sqlParam, serviceResult => {
      if (serviceResult.type === "processFailed" || serviceResult.error) {
        ElMessage({
          showClose: true,
          message: `${serviceResult.error}`,
          offset: 40,
          grouping: true,
          type: "error",
        })
        reject(serviceResult.error)
      } else {
        resolve(serviceResult.result.features)
      }
    })
  })
}

// 查询字段信息
async function getFieldsName(url = "") {
  url = url == "" ? dataUrl : url
  return await new Promise((resolve, reject) => {
    const fieldsParam = new SuperMap.FieldParameters({
      datasource: "points",
      dataset: "earthquakePoint",
    })
    L.supermap.fieldService(url).getFields(fieldsParam, serviceResult => {
      resolve(serviceResult.result.fieldNames)
    })
  }).catch(err => console.log(err))
}

// 缓冲区分析
async function buffer_Analysis() {
  // 缓冲区分析参数
  const butterflyAnalystParams = new SuperMap.DatasetBufferAnalystParameters({
    dataset: "earthquakePoint@points",
    filterQueryParameter: new SuperMap.FilterParameter({
      attributeFilter: "class>='6.1'",
      name: "earthquakePoint@points",
    }),
    bufferSetting: new SuperMap.BufferSetting({
      endType: SuperMap.BufferEndType.ROUND,
      leftDistance: { value: 2 },
      rightDistance: { value: 2 },
      semicircleLineSegment: 10,
    }),
  })

  // 分析
  return await new Promise((resolve, reject) => {
    L.supermap
      .spatialAnalystService(spatialanalystUrl)
      .bufferAnalysis(butterflyAnalystParams, serviceResult => {
        serviceResult.type === "processFailed"
          ? alert(serviceResult.error + "\n请打开iServer服务")
          : true
        // L.geoJSON(serviceResult.result.recordset.features).addTo(map)
        console.log(serviceResult.result)
        resolve(serviceResult.result)
      })
  }).catch(err => console.log(err))
}

export { getDatasourcesName, getDatasetsName, getFieldsName, dateSelect, buffer_Analysis, sqlQuery }
