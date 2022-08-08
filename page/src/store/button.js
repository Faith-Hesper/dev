const state = {
  collapseStatus: true,
  map: {},
}
const mutations = {
  collapseStatusChange(state) {
    state.collapseStatus = !state.collapseStatus
  },
  mapChange(state, map) {
    state.map = map
  },
}
const actions = {
  collapseStatusChange({ commit }) {
    commit("collapseStatusChange")
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
