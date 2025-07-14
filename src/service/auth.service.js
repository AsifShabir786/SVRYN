import axiosInstance from "./url.service";

//signUp user
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
// loginUser.js
export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post(
      "/auth/login",
      userData,
      { withCredentials: true } // ← tell axios/browser to include cookies
    );
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("userId", response.data.data._id);
    localStorage.setItem("profilePicture", response.data.data.profilePicture);
    localStorage.setItem("email", response.data.data.email);
    localStorage.setItem("username", response.data.data.username);

    localStorage.setItem("user-storage", response.data);

    console.log(response.data.data, "response.data");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//login user
export const logout = async () => {
  try {
    const response = await axiosInstance.get("/auth/logout");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//check auth api
export const checkUserAuth = async () => {
  try {
    const token = localStorage.getItem('token'); // or sessionStorage depending on where you store it

    const response = await axiosInstance.get("users/check-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status === "success") {
      return { isAuthenticated: true, user: response?.data?.data };
    } else {
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.log("checkUserAuth error:", error.response?.data || error.message);
    return { isAuthenticated: false };
  }
};
