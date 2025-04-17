import app from './config/configApp';
import router from './routes/index.js';
import store from './vuex/store';
import './static/css/style.css';

// Vue 3rd party plugins
import '@/core/plugins/ant-design';
import '@/core/plugins/fonts';
import '@/core/components/custom';
import '@/core/components/style';
import 'element-plus/dist/index.css'
import {defaultConfig, plugin} from '@formkit/vue'
import 'element-plus/dist/index.css'


import '@/i18n/config';
import './assets/tailwind.css'
import api from "@/utility/api";
import {notification} from "ant-design-vue";
import {deleteLocalStorageInformation} from "@/utility/functions";
import VueHtmlToPaper from 'vue-html-to-paper';

import mixin from "@/core/mixins/lifecycleMixin"

api.interceptors.request.use((config) => {
    const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));

    if (authData?.access) {
        config.headers.Authorization = authData?.access
            ? "Bearer " + authData?.access
            : "";//else
    }
    return config;

});
api.interceptors.response.use(undefined, function (err) {
    return new Promise(function () {
        if (err.response.status === 401) {
            notification["error"]({
                message: "Error",
                description: "Session Expired. Please Login Again",
            });
            deleteLocalStorageInformation()

            router.push({name: "login"});

        } else if (err.response.status === 403) {
            notification["error"]({
                message: "Error",
                description: "Permission Denied",
            });

            return
        } else if (err.response.status === 413) {
            notification["error"]({
                message: "Error",
                description: "Entity too large",
            });

            return;
        }
        throw err;
    });
})


app.config.productionTip = false;
app.use(plugin, defaultConfig);
app.use(store);
app.mixin(mixin);
app.use(VueHtmlToPaper);
app.use(router);
app.mount('#app');