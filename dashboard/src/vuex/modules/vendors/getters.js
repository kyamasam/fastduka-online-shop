export const getters = {
  vendors: (state) => state.vendors,
  products: (state) => state.products,
  categories: (state) => state.categories,
  categoryTypes: (state) => state.categoryTypes,
  vendorsLoaded: (state) => state.vendorsLoaded,
  productsLoaded: (state) => state.productsLoaded,
  categoriesLoaded: (state) => state.categoriesLoaded,
  categoryTypesLoaded: (state) => state.categoryTypesLoaded,
  getVendorById: (state) => (id) => {
    return state.vendors.find((vendor) => vendor.id === id);
  },
  getProductById: (state) => (id) => {
    return state.products.find((product) => product.id === id);
  },
  getCategoryById: (state) => (id) => {
    return state.categories.find((category) => category.id === id);
  },
  getCategoryTypeById: (state) => (id) => {
    return state.categoryTypes.find((type) => type.id === id);
  },
};
