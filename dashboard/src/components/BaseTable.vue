<template>
  <div class="px-2 pb-2">
    <div class="flex flex-col w-full h-full">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :row-key="(record) => record?.id"
        :scroll="{ x: 1000 }"
        :show-expand-column="showExpandedItems"
        style="border-radius: 10px"
      >
        <template #bodyCell="{ column, text }" class="w-full">
          <slot :column="column" :text="text" name="bodyCell"></slot>
        </template>

        <template #expandedRowRender="{ record }">
          <div style="width: 100%; background-color: white; padding: 6px">
            <slot
              :record="record"
              name="expandedRowRender"
              class="block w-full"
            />
          </div>
        </template>

        <template #title>
          <div
            class="w-full py-4 flex flex-col md:justify-between md:flex-row flex-wrap gap-4 bg-white border-b rounded-t-lg border-b-gray-100"
          >
            <!--    <div class="font-medium text-lg">{{ title }}</div>-->
            <a-input
              v-if="showSearch"
              class="text-lg h-12 rounded hidden md:block md:w-[300px] w-full"
              placeholder="Search"
              size="small"
            ></a-input>
            <div v-else></div>

            <div class="flex flex-col md:flex-row gap-6">
              <slot v-if="show0therItems" name="otherItems"></slot>
              <router-link
                v-if="createRouteName !== undefined"
                :to="{ name: createRouteName }"
              >
                <el-button
                  class="flex items-center justify-center rounded-none bg-red-500 hover:bg-red-400 border-none"
                  size="large"
                  type="primary"
                >
                  <PlusOutlined class="h-fit pr-2" />
                  <span>Add New</span>
                </el-button>
              </router-link>

              <div
                class="flex items-start gap-4 justify-between font-bold text-gray-800"
              >
                <a-button class="w-10" size="large" @click="toggleFilters">
                  <template #icon>
                    <FilterOutlined v-if="!showFilters"></FilterOutlined>

                    <FilterFilled v-if="showFilters"></FilterFilled>
                  </template>
                </a-button>

                <a-button class="w-10" size="large" @click="refresh">
                  <template #icon>
                    <ReloadOutlined></ReloadOutlined>
                  </template>
                </a-button>
              </div>
            </div>

            <a-input
              v-if="showSearch"
              class="text-lg h-12 rounded md:hidden"
              placeholder="Search"
              style="width: 300px"
            ></a-input>
          </div>
          <div
            v-if="showFilters || show0therItems"
            class="flex w-full py-4 gap-2 bg-white justify-start"
          >
            <slot name="filters"> </slot>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import {
  FilterFilled,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import { defineEmits } from "vue";
import store from "../vuex/store";

export default {
  name: "BaseTable",
  components: {
    PlusOutlined,
    ReloadOutlined,
    SettingOutlined,
    FilterOutlined,
    FilterFilled,
  },
  data() {
    return {
      dataSource: [],
      showFilters: false,
      loading: true,
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    createRouteName: {
      type: String,
      default: undefined,
    },
    fetchUrl: {
      type: String,
      default: "Client/list",
    },
    show0therItems: {
      type: Boolean,
      default: false,
    },
    showExpandedItems: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => {
        return [
          {
            title: "Name",
            dataIndex: "firstName",
            sorter: true,
            width: "20%",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
        ];
      },
    },
  },
  methods: {
    emit() {
      return defineEmits(["trailingReload"]);
    },
    queryData(url) {
      this.loading = true;

      store
        .dispatch("fetchList", { url })
        .then((resp) => {
          this.dataSource = resp.data.results;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
      console.log(typeof this.show0therItems, this.show0therItems);
      // this.show0therItems = !this.show0therItems
    },
    refresh() {
      this.queryData(this.fetchUrl);
      this.trailingReload();
    },
    trailingReload() {
      this.$emit("trailingReload");
    },
  },
  watch: {
    fetchUrl: function (newVal, oldVal) {
      this.queryData(this.fetchUrl);
    },
    $route: function (to, from) {
      console.log('changed');
      
      this.queryData(this.fetchUrl);
    },
    
  },
  mounted() {
    this.queryData(this.fetchUrl);
  },
};
</script>
