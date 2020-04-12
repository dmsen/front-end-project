export default {
  state: {
    alarmRecord: {},
    alarmRecordGroup: {},
    solution: {},
    current: 0
  },
  mutations: {
    setRecord(state, val) {
      state.alarmRecord = val
    },
    setRecordGroup(state, val) {
      state.alarmRecordGroup = val
    },
    setSolution(state, val) {
      state.solution = val
    },
    setCurrent(state, val) {
      state.current = val
    }
  },
  actions: {}
}
