import axios from "axios"
// import https from'https'

// const agent = new https.Agent({ keepAlive: true,rejectUnauthorized: false })

const request = axios.create({
  timeout: 0,
})

// 相应拦截
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export const _get = (url, params, config) => {
  let conf = {}
  if (params) {
    conf.params = params
  }
  Object.assign(conf, config)
  return request.get(url, conf)
}

export const _post = (url, params, config) => {
  return request.post(url, params, config)
}
