import { getDataUnauthed } from "./api";
export async function refreshToken() {
  const user = useCookie("currentUser");

  const { data, error } = await getDataUnauthed("/token/refresh/", {
    method: "POST",
    body: {
      refresh: user?.value?.refresh,
    },
  });

  if (data?.value) {
    console.log("refresh success", data?.value);
    const userData = useCookie("userData");
    userData.value.access = data.value?.access;
    return userData?.value;
  }
  if (error?.value) {
    console.log("refresh fail", error);
    const userData = useCookie("userData");
    const user = useCookie("currentUser");

    user.value = undefined;
    userData.value = undefined;

    throw error?.value;
  }
}
