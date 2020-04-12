export default {
  state: {
    isGeneralChoose: false,
    machId: null
  },
  mutations: {
    setGeneralChoose (state, val) {
      state.isGeneralChoose = true
    },
    setMachId (state, val) {
      state.machId = val
    }
  },
  actions: {}
}
