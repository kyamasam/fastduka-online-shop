export async function getUserWithToken(token) {
  const nuxtApp = useNuxtApp();
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Missing request URL parameter in the original code
  const request = "/users/get-current-user"; // Add your actual endpoint here

  try {
    const { data, error } = await useFetch(request, {
      baseURL: nuxtApp?.$config.public.apiBaseUrl,
      headers: defaultHeaders,
      onResponseError: async ({ response }) => {
        console.log("err", response);

        if (response?.status === 401) {
          console.log("unauthorized error", response?._data);

          if (response?._data?.errors?.[0]?.code === "token_not_valid") {
            try {
              await refreshToken();
              // You might want to retry the original request here with the new token
              return getUserWithToken(/* new token */);
            } catch (err) {
              throw {
                errors: [
                  {
                    code: "login",
                    detail: "Please Login",
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
                  detail: "Please Login",
                  attr: "",
                },
              ],
            };
          }
        } else if (response?.status < 500) {
          showServerErrors(response?._data);
          throw response;
        } else {
          toast.error("An Unknown Error occurred");
          throw response._data;
        }
      },
    });

    if (error.value) {
      throw error.value;
    }

    const userData = useCookie("userData");
    userData.value = data.value;
    console.log("curent user", userData?.value);

    return data.value;
  } catch (err) {
    console.error("Error in getUserWithToken:", err);
    throw err;
  }
}
