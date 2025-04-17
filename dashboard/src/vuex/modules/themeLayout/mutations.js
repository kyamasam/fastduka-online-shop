export default {
  changeLayoutBegin(state) {
    state.loading = true;
  },

  changeLayoutSuccess(state, data) {
    state.loading = false;
    state.data = data;
    state.main = data ? 'blackMode' : 'lightMode';
  },

  changeLayoutErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  changeRtlBegin(state) {
    state.loading = true;
  },

  changeRtlSuccess(state, data) {
    state.loading = false;
    state.rtlData = data;
  },

  changeRtlErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  changeMenuBegin(state) {
    state.loading = true;
  },

  changeMenuSuccess(state, data) {
    state.loading = false;
    state.topMenu = data;
  },

  changeMenuErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
