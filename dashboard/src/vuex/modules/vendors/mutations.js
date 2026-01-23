export const mutations = {
  setVendors(state, payload) {
    state.vendors = payload;
    state.vendorsLoaded = true;
  },
  setProducts(state, payload) {
    state.products = payload;
    state.productsLoaded = true;
  },
  setCategories(state, payload) {
    state.categories = payload;
    state.categoriesLoaded = true;
  },
  setCategoryTypes(state, payload) {
    state.categoryTypes = payload;
    state.categoryTypesLoaded = true;
  },
  clearVendors(state) {
    state.vendors = [];
    state.vendorsLoaded = false;
  },
  clearProducts(state) {
    state.products = [];
    state.productsLoaded = false;
  },
  clearCategories(state) {
    state.categories = [];
    state.categoriesLoaded = false;
  },
  clearCategoryTypes(state) {
    state.categoryTypes = [];
    state.categoryTypesLoaded = false;
  },
};
