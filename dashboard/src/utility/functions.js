import router from "@/routes";
import { ElNotification } from "element-plus";

export function showSuccess(text) {
  ElNotification({
    title: "Success",
    type: "success",
    position: "top-right",
    message: text,
  });
}

export function raiseError(text) {
  ElNotification({
    title: "Error",
    type: "error",
    position: "top-right",
    message: text.response.data?.detail,
  });
}

export function raiseServerError(err) {
  // if (err?.response?.status === 401) {
  //     return
  // }

  err?.response?.data?.errors?.forEach((obj) => {
    setTimeout(function () {
      ElNotification({
        title: `${obj?.attr ? obj?.attr?.[0]?.toUpperCase() : "Error"}${
          obj?.attr ? obj?.attr?.substring(1) : ""
        }`,
        type: "warning",
        position: "top-right",
        message: obj?.detail,
      });
    }, 2);
  });
}

export const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export function base64toBlobWithInfo(data) {
  const regex = /^data:(.+);base64,/;
  const matches = data.match(regex);

  if (matches && matches.length > 1) {
    const contentType = matches[1];
    const base64WithoutHeader = data.replace(regex, "");
    const blob = b64toBlob(base64WithoutHeader, contentType);

    // Extract filename and extension
    const filename = extractFilename(blob, contentType);

    return { blob, filename };
  }

  // Handle error or return a default value
  return { blob: null, filename: "unknown.txt" };
}

export function extractFilename(blob, contentType) {
  // Example: You can customize this logic based on your needs
  const defaultFilename = "unknown.txt";

  if (blob instanceof Blob && contentType) {
    const extension = contentType.split("/")[1] || "";
    const timestamp = new Date().getTime(); // Use a timestamp as a part of the filename
    return `file_${timestamp}.${extension}`;
  }

  return defaultFilename;
}

export function deleteLocalStorageInformation() {
  localStorage.removeItem("piczanguAuthData");
  localStorage.removeItem("activeGallery");
  localStorage.removeItem("galleryToPurchase");
  localStorage.removeItem("urlToLoadPicZangu");
  localStorage.removeItem("galleryCodeToFetch");
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function setGalleryCodeToFetch(galleryCode) {
  localStorage.setItem("galleryCodeToFetch", JSON.stringify(galleryCode));
}

/**
 * alert that a gallery doesn't exist the route to dashboard
 * @param galleryIsSelected
 * @return {Promise}
 */
export function galleryInexistenceAlert(galleryIsSelected) {
  function showAlert() {
    return new Promise((resolve) => {
      ElNotification({
        title: `No Selected Gallery`,
        type: "warning",
        position: "top-right",
        message: "Select a gallery to continue",
      });

      resolve(); // Resolve the promise after showing the alert
    });
  }

  if (galleryIsSelected) {
    return Promise.resolve(); // Resolve immediately if gallery is selected
  } else {
    return showAlert().then(() => {
      return router.push({ name: "home" });
    });
  }
}

/**
 * check For an Item's existence in the local storage
 * @param {string} itemName
 */
export function checkLocalStorageItemExistence(itemName) {
  let checkForGalleryExistence = localStorage.getItem(itemName);

  return checkForGalleryExistence !== null;
}

export function addToStorageFirst(data, storageKey) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      resolve(); // Resolve the promise after setting the data in local storage
    } catch (error) {
      reject(error); // Reject the promise if an error occurs
    }
  });
}

/**
 *
 * @param amount
 * @param currency
 * @return {string}
 */
export function formatCurrency(amount = 0, currency = "KES") {
  return amount.toLocaleString("en-us", {
    style: "currency",
    currency: currency,
  });
} //end of formatCurrency

export function allowedUsers(userTypesAllowed) {
  let userType = JSON.parse(localStorage.getItem("piczanguUserDetails"))
    ?.is_admin
    ? "admin"
    : JSON.parse(localStorage.getItem("piczanguUserDetails"))?.user_type;

  if (userTypesAllowed !== userType && userTypesAllowed !== "all") {
    router.push({ name: "unauthorised" });
  }
}

export default {};
