export const getters = {
    getLoggedInUser(state){
        return state.loggedUser
    },
    getProfileImage(state){
        return state.userProfile
    },
    getGalleryFormState(state){
        return state.createGalleryFormState
    },
    getImageList(state){
        return state.imageList
    },
    getGalleryResults(state){
        return state.galleryResults
    },
    getLoadingPercentage(state){
        return state.loadingPercentage
    }
}
