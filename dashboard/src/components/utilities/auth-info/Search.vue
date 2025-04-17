<template>
  <div
    :class="
      openSearch
        ? 'ninjadash-nav-actions__item ninjadash-nav-actions__searchbar show'
        : 'ninjadash-nav-actions__item ninjadash-nav-actions__searchbar'
    "
  >
    <div class="ninjadash-searchbar">
      <a-form name="ninjadash-search">
        <a-form-item>
          <a-input placeholder="Search Here" />
        </a-form-item>
      </a-form>
    </div>
    <router-link
      to="#"
      @click="(e) => openSearchBar(e)"
      class="ninjadash-search-icon"
      ><unicon name="search"></unicon
    ></router-link>
    <router-link
      to="#"
      @click="(e) => closeSearchBar(e)"
      class="ninjadash-close-icon"
    >
      <unicon name="times"></unicon>
    </router-link>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "SearchBar",
  setup() {
    const openSearch = ref(false);
    const openSearchBar = (e) => {
      e.preventDefault();
      openSearch.value = true;
    };
    const closeSearchBar = (e) => {
      e.preventDefault();
      openSearch.value = false;
    };
    return {
      openSearch,
      openSearchBar,
      closeSearchBar,
    };
  },
});
</script>
