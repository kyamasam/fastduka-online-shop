/**
 * actions module
 * @module functions
 */

import api from "../../../utility/api.js";
import { baseUrl, headers } from "../../../utility/constants.js";
import {
  b64toBlob,
  raiseServerError,
  showSuccess,
} from "../../../utility/functions.js";

export const actions = {
  /**
   * Get an array of objects :  `payload  = {url: ''}`
   * @param commit
   * @param state
   * @param {Object} payload `{url: ''}`
   * @return {Promise}
   */
  async fetchList({ commit, state }, payload) {
    return api
      .get(`${baseUrl}${payload.url}`, { headers })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        raiseServerError(err);
        throw err;
      });
  },

  /**
   * Get an object :  `payload  = {id :number , url: string}`
   * @param commit
   * @param state
   * @param payload
   * @return {Promise}
   */
  async fetchSingleItem({ commit, state }, payload) {
    return await api
      .get(`${baseUrl}${payload.url}/${payload.id}/`)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        raiseServerError(err);
        throw err;
      });
  },
  /**
   * Make post request to backend. `payload = {url: string, data:object = payload.url , payload.data}`
   * @param state
   * @param commit
   * @param payload
   * @return {Promise,Object}
   */
  async postData({ state, commit }, payload) {
    try {
      const response = await api.post(
        `${baseUrl}${payload.url}/`,
        {
          ...payload.data,
          createdBy: JSON.parse(localStorage.getItem("authData"))?.id,
          lastModifiedBy: JSON.parse(localStorage.getItem("authData"))?.id,
        },
        { headers }
      );
      if (payload.data?.showSucccess === false) {
      } else {
        showSuccess("Successful");
      }
      return response;
    } catch (err) {
      raiseServerError(err);
      throw err;
    }
  },
  /**
   * Amend an object in the database.Only Fields to amend are in the payload.data. Payload = {url:string, id:number, data:object}
   * @param state
   * @param commit
   * @param payload
   * @return {Promise}
   */
  async patchData({ state, commit }, payload) {
    try {
      const response = await api.patch(
        `${baseUrl}${payload.url}/${payload.id}/`,
        payload.data,
        { headers }
      );
      showSuccess("Successful");
      return response;
    } catch (err) {
      raiseServerError(err);
      throw err;
    }
  },
  /**
   * Ammend an object in the database.All fields are required. Payload = {url:string, id:number,data:object}
   * function
   * @param state
   * @param commit
   * @param payload
   * @return {Promise}
   */
  async putData({ state, commit }, payload) {
    try {
      const response = await api.put(
        `${baseUrl}${payload.url}/${payload.id}/`,
        {
          ...payload.data,
          lastModifiedBy: JSON.parse(localStorage.getItem("authData"))?.data
            ?.id,
        },
        { headers }
      );
      showSuccess("Successful");
      return response;
    } catch (err) {
      raiseServerError(err);
      throw err;
    }
  },
  async deleteData({ state, commit }, payload) {
    try {
      const response = await api.delete(
        `${baseUrl}${payload.url}/${payload.id}/`,
        { headers }
      );
      showSuccess("Successful");
      return response;
    } catch (err) {
      raiseServerError(err);
      throw err;
    }
  },
  async uploadProfileImage(commit, payload) {
    const response = await api
      .post(`${baseUrl}photo-uploads/`, payload, {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      })
      .then((response) => {
        showSuccess("Successfully Uploaded Image");
      })
      .catch((err) => {
        raiseServerError(err);
      });
  },
  download({ state, commit }, payload) {
    let authData = JSON.parse(localStorage.getItem("authData"));
    return new Promise((resolve, reject) => {
      let route = payload.url;
      api
        .get(`${baseUrl}${payload.url}/${payload.id}/`)
        .then(({ data }) => {
          // const blob = b64toBlob(data, 'json')
          const blob = b64toBlob(data?.image);

          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          const docName = `${Date.now()}${data?.file_name}`;
          link.setAttribute("download", `${docName}`);
          document.body.appendChild(link);
          link.click();
          showSuccess("Successful");
          resolve(data);
        })
        .catch((err) => {
          console.error("errsds", err);
          raiseServerError(err);
          reject(err);
        });
    });
  },
};
