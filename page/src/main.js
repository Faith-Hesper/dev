import { createApp } from "vue"
import App from "./App.vue"
import router from "@/router"
import store from "@/store"

import "leaflet/dist/leaflet.css"
import "./assets/css/comman.css"
import "./assets/css/L.Icon.Pulse.css"
import "@/config/config"

import {
  Location,
  Document,
  Menu as IconMenu,
  House,
  Expand,
  Fold,
  Setting,
} from "@element-plus/icons-vue"

import L from "leaflet"
import "@supermap/iclient-leaflet"

const app = createApp(App)

app.use(router)
app.use(store)

app.component("location", Location)
app.component("document", Document)
app.component("icon-menu", IconMenu)
app.component("setting", Setting)
app.component("expand", Expand)
app.component("fold", Fold)
app.component("house", House)

app.mount("#app")
