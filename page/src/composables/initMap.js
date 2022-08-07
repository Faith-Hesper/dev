/*
 * @Author: Faith
 * @Date: 2022-08-06 09:37
 * @LastAuthor: Faith
 * @LastEditTime: 2022-08-06 09:42
 * @Description:
 */
import { shallowReactive } from "vue"
export default function initMap(map) {
  const customMap = shallowReactive({
    map: null,
  })
  customMap.map = map
  return customMap
}
