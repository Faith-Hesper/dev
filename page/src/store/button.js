/*
 * @Author: Faith
 * @Date: 2022-08-08 19:49
 * @LastAuthor: Faith
 * @LastEditTime: 2022-08-08 20:54
 * @Description:
 */
const state = {
  collapseStatus: true,
  formStatus: false,
}
const mutations = {
  collapseStatusChange(state) {
    state.collapseStatus = !state.collapseStatus
  },
  formStatusChange(state) {
    state.formStatus = !state.formStatus
  },
}
const actions = {
  collapseStatusChange({ commit }) {
    commit("collapseStatusChange")
  },
  formStatusChange({ commit }) {
    commit("formStatusChange")
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
