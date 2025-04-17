export function setLoggedInUser(userData) {
    const user = useCookie('user')
    user.value=userData
}