import { createStore } from 'vuex';
import themeLayout from './modules/themeLayout/actionCreator';
import loginMutations from "@/vuex/modules/authentication/axios/mutations";
import mainRequests from "./modules/mainRequests/index"
import vendors from "./modules/vendors/index"
// import VuexPersistence from 'vuex-persist'
import vuexPersist from "@/vuex/modules/vuexPersist/index"

export default createStore({
  modules: {
    themeLayout,
    loginMutations,
    mainRequests,
    vendors,
    // vuexPersist
  },
  // plugins: [new VuexPersistence().plugin]
});
