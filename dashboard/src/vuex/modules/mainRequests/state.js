export const state = {
  loggedUser: {},
  userProfile: "",
  createGalleryFormState: {
    name: "",
    gallery_price: null,
    price_per_photo: null,
    access_type: "public",
    free_to_download: false,
  },
  galleryResults: {},
  loggedUserType: JSON.parse(localStorage.getItem("piczanguUserDetails"))
    ?.user_type,
  imageList: [],
  uploadImage: false,
  loadingPercentage: {},
  fileUploads: [],
  vendor : 'test',
};
