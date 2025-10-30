import { toast } from "vue3-toastify";

export const getData = async (request, opts) => {
  const user = useCookie("currentUser");

  console.log("access token", user?.value?.access);
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...opts?.headers, // Allow overriding or adding custom headers from the options
  };
  if (user?.value?.access) {
    defaultHeaders["Authorization"] = "Bearer " + user?.value?.access;
  }
  const nuxtApp = useNuxtApp();

  return useFetch(request, {
    baseURL: nuxtApp?.$config.public.apiBaseUrl,
    // baseURL: "https://shopapi.fastduka.co.ke/api",
    headers: defaultHeaders,
    ...opts,
    onResponseError: async ({ response }) => {
      console.log("err", response);
      if (response?.status < 500 && response?.status !== 401) {
        showServerErrors(response?._data);
        throw response;
      } else if (response?.status === 401) {
        console.log("unautheed error", response?._data);
        // toast.error("Please Login");
        //clear the token
        if (response?._data?.errors[0]?.code === "token_not_valid") {
          try {
            await refreshToken();
          } catch (err) {
            throw {
              errors: [
                {
                  code: "login",
                  detail: "Please Login ",
                  attr: "",
                },
              ],
            };
          }
        } else {
          throw {
            errors: [
              {
                code: "login",
                detail: "Please Login ",
                attr: "",
              },
            ],
          };
        }
      } else {
        toast.error("An Unknown Error occured");
        return response._data;
      }
    },
  });
};

// export const getDataUnauthed = (request, opts) => {
//   const config = useRuntimeConfig();
//   const defaultHeaders = {
//     "Content-Type": "application/json",
//     ...opts?.headers, // Allow overriding or adding custom headers from the options
//   };
//   return useFetch(request, {
//     baseURL: config.public.apiBaseUrl,
//     headers: defaultHeaders,
//     ...opts,
//     onResponseError: async ({ response }) => {
//       console.log("err", response);
//       if (response?.status < 500 && response?.status !== 401) {
//         console.log("server err", response);
//         showServerErrors(response?._data);
//         throw response;
//       } else if (response?.status === 401) {
//         // toast.error("Please Login");
//         //clear the token
//         if (response?._data?.errors) {
//           response?._data?.errors?.forEach((error) => {
//             toast.error(error?.attr + ": " + error.detail);
//           });
//           throw response;
//         } else {
//           throw {
//             errors: [
//               {
//                 code: "error",
//                 detail: "Something went wrong",
//                 attr: "",
//               },
//             ],
//           };
//         }
//       } else {
//         toast.error("An Unknown Error occured");
//         return response._data;
//       }
//     },
//   });
// };

export const getDataUnauthed = (request, opts) => {
  const config = useRuntimeConfig();
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...opts?.headers,
  };

  return useLazyFetch(request, {
    baseURL: config.public.apiBaseUrl,
    headers: defaultHeaders,
    ...opts,
    onResponseError: async ({ response }) => {
      console.log("err", response);
      if (response?.status < 500 && response?.status !== 401) {
        console.log("server err", response);
        showServerErrors(response?._data);
      } else if (response?.status === 401) {
        if (response?._data?.errors) {
          response?._data?.errors?.forEach((error) => {
            toast.error(error?.attr + ": " + error.detail);
          });
        } else {
          toast.error("Unauthorized");
        }
      } else {
        toast.error("An Unknown Error occurred");
      }
    },
  });
};
