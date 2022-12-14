/*
 * @Author: Faith
 * @Date: 2022-03-18 08:32
 * @LastAuthor: Faith
 * @LastEditTime: 2022-08-08 20:01
 * @Description:
 */
import { _get, _post } from "./index"

// 高德地图关键字搜索API
async function gaode(pageNum, city = "唐山市") {
  const data = await _get(
    `/gaode/v3/place/text?key=5833fc2ab01735a6c6fd3a72d1b43459&keywords=应急&city=${city}&page=${pageNum}&citylimit=true&extensions=all&children=1`
  ).catch(err => console.log(err))
  // console.log(data)
  return data
}

async function earthquake() {
  // let timestamp = Date.parse(new Date())
  const data = await _get("/api/earth").catch(err => console.log(err))
  // console.log(data)
  return data
}

async function sqlData(date) {
  const { data } = await _get("/api/info", { date: date }).catch(err => console.log(err))
  // console.log(data);
  return data
}

export { gaode, earthquake, sqlData }
