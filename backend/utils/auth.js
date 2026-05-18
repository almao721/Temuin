export const getUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const clearSession = () => {
  localStorage.clear();
  sessionStorage.clear();
};