export const mutations={
  setLoggedUser(state, data) {
    state.loggedUser = { ...data };
  },
  setGalleryResults(state, payload){
    state.galleryResults = payload
  },
  setGalleryFormState(state, payload){
    state.createGalleryFormState = payload
  },
  setImageList(state, payload){
    state.imageList = payload
  },
  setImageUpload(state, payload){
    state.uploadImage = payload
  },
  setLoadingPercentage(state, fileList) {
    state.fileUploads = fileList;
  }

}