export const useUserStore = defineStore("user_store", () => {
  let currentUserData = reactive({});

  const setCurrentUserData = (data: any) => {
    Object.assign(currentUserData, data);
  };

  return {
    currentUserData,
    setCurrentUserData,
  };
});
