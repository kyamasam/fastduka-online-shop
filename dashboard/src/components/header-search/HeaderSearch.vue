<template>
  <Div
    class="certain-category-search-wrapper"
    :style="{ width: '100%' }"
    :darkMode="darkMode"
  >
    <a-row class="ant-row-middle">
      <a-col :md="2" :xs="1" :class="rtl ? 'text-left' : 'text-right'">
        <span class="certain-category-icon">
          <unicon name="search"></unicon>
        </span>
      </a-col>
      <a-col :md="22" :xs="23">
        <sdPopover
          :placement="!rtl ? 'bottomLeft' : 'bottomRight'"
          v-model="visible"
          title="Search List"
          action="click"
        >
          <template v-slot:content>
            <div>
              <router-link v-for="item in filteredData" :key="item.id" to="#">
                {{ item.title }}
                <span class="certain-search-item-count"
                  >{{ item.count }} people</span
                >
              </router-link>
              <router-link v-if="filteredData.length === 0" to="#">
                Data Not Found.....
              </router-link>
            </div>
          </template>
          <a-input
            placeholder="Search..."
            @input="(e) => search(e, searchData)"
          />
        </sdPopover>
      </a-col>
    </a-row>
  </Div>
</template>

<script>
import { Div } from "./header-search-style";
import { useStore } from "vuex";
import { computed, ref, defineComponent } from "vue";

export default defineComponent({
  name: "HeaderSearch",
  props: ["darkMode"],
  components: {
    Div,
  },
  setup() {
    const { state } = useStore();
    const searchData = ref([
      {
        id: 1,
        title: "AntDesign",
        count: 10000,
      },
      {
        id: 2,
        title: "Design UI",
        count: 10600,
      },

      {
        id: 3,
        title: "Bootstrap Design UI",
        count: 60100,
      },
      {
        id: 4,
        title: "Meterial design",
        count: 30010,
      },

      {
        id: 5,
        title: "AntDesign design language",
        count: 100000,
      },
    ]);
    const rtl = computed(() => state.themeLayout.rtlData);
    const filteredData = ref([
      {
        id: 1,
        title: "AntDesign",
        count: 10000,
      },
      {
        id: 2,
        title: "Design UI",
        count: 10600,
      },

      {
        id: 3,
        title: "Bootstrap Design UI",
        count: 60100,
      },
      {
        id: 4,
        title: "Meterial design",
        count: 30010,
      },

      {
        id: 5,
        title: "AntDesign design language",
        count: 100000,
      },
    ]);
    const visible = ref(false);

    const search = (e, searchDatas) => {
      const data = searchDatas.filter((item) => {
        return item.title.startsWith(e.target.value);
      });
      filteredData.value = data;
    };
    const hide = () => {
      visible.value = false;
    };

    return {
      search,
      hide,
      searchData,
      filteredData,
      visible,
      rtl,
    };
  },
});
</script>
