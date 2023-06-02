/** Return user auth from local storage value */
export const getStoredUserAuth = () => {
  const auth = window.localStorage.getItem("UserAuth");
  if (auth === null) {
    return null;
  } else {
    const authJson = JSON.parse(auth);
    if (new Date() >= new Date(authJson.expiresIn)) {
      localStorage.removeItem("UserAuth");
      return null;
    }
    return authJson;
  }
};
