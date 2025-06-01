export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  const token = getToken();
  // you can add more validation here
  // for example, check token expiration
  // but for simplicity, just check if token exists
  return !!token; //return true if token exists;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
