export const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const headers = { "Content-Type": "application/json" };
export const frontendBaseUrl = import.meta.env.VITE_FRONT_END_BASE_URL;
export const homePageUrl = import.meta.env.VITE_HOME_PAGE_URL;
export const loggedInUser = JSON.parse(
  localStorage.getItem("piczanguUserDetails")
);

export const userTypes = {
  photographer: "photographer",
};

export const storageMultiplier = {
  mb: 1000000,
  gb: 1e9,
};
