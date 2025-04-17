export async function getCurrentUser(accessToken) {
  const { data: currentUser, error: currentUserError } = await getData(
    "/users/get-current-user"
  );

  // Log the error if it exists
  console.log("err", currentUserError?.value);

  // Check for a 401 Unauthorized error
  if (currentUserError?.value?.statusCode === 401) {
  } else if (currentUser?.value) {
    const userData = useCookie("userData");
    userData.value = currentUser.value;
    console.log("curent user", currentUser?.value);
  } else {
    console.log("fail");
  }
}
