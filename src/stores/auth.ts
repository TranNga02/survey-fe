import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  api_token: string;
}

export interface UserInfoResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string | null;
  isAdmin: boolean;
  verifyToken: string | null;
  isVerified: boolean;
}

export interface LoginData {
  user: UserInfoResponse;
  token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const userInfo = ref<UserInfoResponse>({} as UserInfoResponse);
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: LoginData) {
    isAuthenticated.value = true;
    userInfo.value = authUser.user;
    errors.value = {};
    JwtService.saveToken(authUser.token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  function login(credentials: User) {
    return ApiService.post("public/login", credentials)
      .then(({ data }) => {
        setAuth(data.data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("verify_token", { api_token: JwtService.getToken() })
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
