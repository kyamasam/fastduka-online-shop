export default {
  loginBegin(state) {
    state.login = true;
  },
  loginSuccess(state, data) {
    state.loading = false;
    state.login = data;
  },

  loginErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  logoutBegin(state) {
    state.loading = true;
  },

  logoutSuccess(state, data) {
    state.loading = false;
    state.login = data;
  },

  logoutErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
