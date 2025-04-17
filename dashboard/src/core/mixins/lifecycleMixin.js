import {baseUrl} from "@/utility/constants";
import {raiseServerError, showSuccess} from "@/utility/functions";
import store from "@/vuex/store";
import {notification} from "ant-design-vue";
import axios from "axios";
import {ElNotification} from "element-plus";

const mixin = {
    methods: {
        /**
         * @param info : Object info object sent by the ant design upload function
         * @param fileList : Array of the
         * @param uploadUrl : String the url to upload the file to
         */
        async handleUploadPhotos(
            info,
            fileList,
            uploadUrl = "products/",
            fileKeyName = "files",
            referenceIdKey = "reference_id"
        ) {
            console.log(uploadUrl, 'second')
            try {
                const requestBody = new FormData();

                let fileTooLarge = false;

                for (let attachment of fileList) {
                    if (attachment?.originFileObj.size <= 4 * 1024 * 1024) {
                        requestBody.append(fileKeyName, attachment?.originFileObj);
                        console.log("att", attachment?.originFileObj);
                    } else {
                        notification["error"]({
                            message: "Error",
                            description: `${attachment?.name} exceeds 4MB size limit and won't be uploaded`,
                        });
                        fileTooLarge = true;
                        break;
                    }
                }
                console.log(uploadUrl, 'upload url')

                if (!fileTooLarge) {
                    // Proceed only if no file is too large
                    const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));

                    const resp = await axios.patch(`${baseUrl}${uploadUrl}`, requestBody, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: "Bearer " + authData?.access,
                        },
                    });

                    // this.fileList = [];

                    showSuccess("Successfully Uploaded Image");

                    return resp;
                } else {
                    // raiseServerError(`File/(s) exceeds 4MB size limit and won't be uploaded`);
                    largeEntity(fileTooLarge);
                }
            } catch (error) {
                raiseServerError(error);
                console.log(error, "errrr");
                throw error;
            }
        },

        async handleUploadGalleryPhotos(
            info,
            referenceType,
            referenceId,
            fileList,
            uploadUrl = "photo-uploads/",
            fileKey = "files",
            referenceKey = "reference_type",
            showPrice = false,
            priceAmount = 50
        ) {
            console.log("we are here", fileList);

            let requestBody = new FormData();
            if (info.file.status !== "") {
                requestBody.append("reference_type", referenceType);
                requestBody.append(referenceKey, referenceId);
                if (showPrice) {
                    requestBody.append("price", priceAmount);
                }

                // Generate a unique ID for the upload
                const uniqueId = `${Math.floor(Math.random() * 1000000)}-${Date.now()}`;

                // Update fileList with unique ID and initial progress
                fileList = fileList.map((file) => {
                    if (file.uid === info.file.uid) {
                        return {...file, uniqueId, uploadProgress: 0};
                    }
                    return file;
                });

                // Append files to the request body
                for (let attachment of fileList) {
                    requestBody.append(fileKey, attachment?.originFileObj);
                }

                const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));

                return axios
                    .post(`${baseUrl}${uploadUrl}`, requestBody, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: "Bearer " + authData?.access,
                        },
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.lengthComputable) {
                                const totalLength = progressEvent.total;
                                const loaded = progressEvent.loaded;
                                const percentage = Math.round((loaded * 100) / totalLength);

                                // Update progress for each file
                                fileList = fileList.map((file) => {
                                    // Find the object by its uid
                                    const foundObject = store.state.mainRequests.fileUploads.find(
                                        (item) => item.uid === file.uid
                                    );
                                    const index = store.state.mainRequests.fileUploads.findIndex(
                                        (item) => item.uid === file.uid
                                    );

                                    if (foundObject) {
                                        // If the object exists, update it
                                        store.state.mainRequests.fileUploads[index] = {
                                            ...store.state.mainRequests.fileUploads[index],
                                            uploadProgress: percentage,
                                        };

                                        console.log("updating", {uploadProgress: percentage});
                                        console.log("object", store.state.mainRequests.fileUploads);

                                        // If the upload progress is 100%, remove the object from the array
                                        if (percentage === 100) {
                                            store.state.mainRequests.fileUploads.splice(index, 1);
                                        }

                                        return file;
                                    } else {
                                        // If the object doesn't exist, push a new object
                                        store.state.mainRequests.fileUploads.push({
                                            ...file,
                                            uploadProgress: percentage,
                                        });
                                    }

                                    // Update the file object in fileList with the new progress
                                    return {...file, uploadProgress: percentage};
                                });

                                // Commit the updated progress to the store
                                // store.commit('setLoadingPercentage', fileList);
                                // console.log("percentage", fileList);
                            }
                        },
                    })
                    .then((resp) => {
                        // this.fileList = [];
                        showSuccess("Successfully Uploaded Image");
                        return resp;
                    })
                    .catch((err) => {
                        raiseServerError(err);
                        throw err;
                    });
            }

            if (info.file.status === "done") {
                console.log(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === "error") {
                console.log(`${info.file.name} file upload failed.`);
            }
        },
        getSetCurrentUser() {
            // store.state.loggedUser ={'sdfds':"sdfsdfs"}
            store
                .dispatch("fetchList", {
                    url: `users/get-current-user/`,
                })
                .then((resp) => {
                    store.commit("setLoggedUser", resp.data);
                    localStorage.setItem(
                        "piczanguUserDetails",
                        JSON.stringify(resp.data)
                    );
                    // store.state.userProfile = resp.data?.profile?.profile_photo
                    // store.state.loggedUser = resp.data
                });
        },

        formatCurrency(amount, currency = "KES") {
            return amount?.toLocaleString("en-us", {
                style: "currency",
                currency: currency,
            });
        }, //end of formatCurrency
    },
};

function largeEntity(action) {
    if (action) {
        setTimeout(function () {
            ElNotification({
                title: `error`,
                type: "warning",
                position: "top-right",
                message: `File/(s) exceeds 4MB size limit and won't be uploaded`,
            });
        }, 2);
    }
}

export default mixin;
