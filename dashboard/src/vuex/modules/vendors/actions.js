import api from "../../../utility/api.js";
import { baseUrl } from "../../../utility/constants.js";
import { raiseServerError } from "../../../utility/functions.js";

export const actions = {
  async fetchVendors({ commit, state }) {
    // Check if vendors are already loaded
    if (state.vendorsLoaded && state.vendors.length > 0) {
      return state.vendors;
    }

    try {
      const response = await api.get(`${baseUrl}vendors/vendors-unpaged/`);
      commit("setVendors", response.data);
      return response.data;
    } catch (err) {
      raiseServerError(err);
      throw err;
    }
  },

  async fetchProducts({ commit, state }) {
    // Check if products are already loaded
    if (state.productsLoaded && state.products.length > 0) {
      return state.products;
    }

    try {
      const response = await api.get(`${baseUrl}products/`);
      const products = response.data.results || response.data;
      commit("setProducts", products);
      return products;
    } catch (err) {
      raiseServerError(err);
      throw err;
    }
  },

  async fetchCategories({ commit, state }) {
    // Check if categories are already loaded
    if (state.categoriesLoaded && state.categories.length > 0) {
      return state.categories;
    }

    try {
      const response = await api.get(`${baseUrl}category/categories-unpaged/`);
      commit("setCategories", response.data);
      return response.data;
    } catch (err) {
      raiseServerError(err);
      throw err;
    }
  },

  async fetchCategoryTypes({ commit, state }) {
    // Check if category types are already loaded
    if (state.categoryTypesLoaded && state.categoryTypes.length > 0) {
      return state.categoryTypes;
    }

    try {
      const response = await api.get(`${baseUrl}category-type/categories-types-unpaged/`);
      commit("setCategoryTypes", response.data);
      return response.data;
    } catch (err) {
      raiseServerError(err);
      throw err;
    }
  },

  refreshVendors({ commit, dispatch }) {
    commit("clearVendors");
    return dispatch("fetchVendors");
  },

  refreshProducts({ commit, dispatch }) {
    commit("clearProducts");
    return dispatch("fetchProducts");
  },

  refreshCategories({ commit, dispatch }) {
    commit("clearCategories");
    return dispatch("fetchCategories");
  },

  refreshCategoryTypes({ commit, dispatch }) {
    commit("clearCategoryTypes");
    return dispatch("fetchCategoryTypes");
  },
};
