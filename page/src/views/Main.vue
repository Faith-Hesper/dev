<template>
  <div class="layout-container">
    <div class="aside">
      <AsideContainer></AsideContainer>
    </div>
    <div class="container">
      <div class="header">
        <HeaderContainer> </HeaderContainer>
      </div>
      <div class="main">
        <router-view></router-view>
        <!-- <MapContainer></MapContainer> -->
      </div>
    </div>
  </div>
</template>

<script>
  import { onMounted, provide, ref, shallowRef, reactive } from "vue"
  import HeaderContainer from "@/components/HeaderContainer/HeaderContainer.vue"
  import AsideContainer from "@/components/AsideContainer/AsideContainer.vue"
  // import MapContainer from '@/components/MapContainer/MapContainer.vue'
  import { earthPoint, recentData } from "@/utils/map"
  import { earthquake } from "@/api/base"

  export default {
    name: "Main",
    components: {
      HeaderContainer,
      AsideContainer,
      // MapContainer,
    },

    setup(props) {
      const earthquakePoint = shallowRef([])
      const recentquakeData = shallowRef({})

      provide("earthquakePoint", earthquakePoint)
      provide("recentquakeData", recentquakeData)
      // onMounted(async () => {
      //   // 请求地震点数据
      //   const {
      //     data: { result },
      //   } = await earthquake()
      //   console.log(result)
      //   let reverseDate = result.reverse()
      //   // earthquakePoint.value = await earthPoint(reverseDate)
      //   recentquakeData.value = await recentData(reverseDate)
      // })

      return {
        // earthquakePoint,
        // recentquakeData
      }
    },
  }
</script>

<style scoped>
  .layout-container {
    height: 44.4375rem;
    display: flex;
    flex-direction: row;
  }
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .aside {
    height: 100%;
    background: #545c64;
    zoom: 1;
    z-index: 1;
  }
  .header {
    height: 2.7rem;
    padding: 0;
    background-color: #b3c0d1;
    position: sticky;
    display: flex;
    justify-content: left;
    align-items: center;
    text-align: center;
    z-index: 1;
  }

  .main {
    width: 1600px;
    padding: 0;
    overflow: hidden;
  }
</style>
