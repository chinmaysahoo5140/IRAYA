import { jsx, Fragment } from "react/jsx-runtime";
import axios from "axios";
import { create } from "zustand";
function ProtectedRoute({ children }) {
  return /* @__PURE__ */ jsx(Fragment, { children });
}
const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  token: null,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  setToken: (token) => set({ token }),
  logout: async () => {
    try {
      const { logoutServerFn } = await import("./router-pa2HfNNz.js").then((n) => n.O);
      await logoutServerFn();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      set({ user: null, isLoggedIn: false, token: null });
    }
  },
  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const { checkAuthFn } = await import("./router-pa2HfNNz.js").then((n) => n.O);
      const { user } = await checkAuthFn();
      if (user) {
        set({
          user: {
            id: user.id,
            name: user.user_metadata?.full_name ?? user.email ?? "",
            email: user.email ?? "",
            phone: user.phone ?? null,
            avatar: user.user_metadata?.avatar_url ?? null,
            createdAt: user.created_at
          },
          isLoggedIn: true
        });
      } else {
        set({ user: null, isLoggedIn: false });
      }
    } catch {
      set({ user: null, isLoggedIn: false });
    } finally {
      set({ isLoading: false });
    }
  }
}));
const baseURL = process.env.NEXT_PUBLIC_API_URL || void 0 || "http://localhost:5000";
const api = axios.create({
  baseURL,
  withCredentials: true
});
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        useAuthStore.getState().setToken(accessToken);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/account";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
function SkeletonLine({ width = "w-full", height = "h-4", className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `animate-shimmer rounded bg-secondary dark:bg-charcoal/30 ${width} ${height} ${className}`
    }
  );
}
function SkeletonBox({ width = "w-full", height = "h-32", className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `animate-shimmer rounded bg-secondary dark:bg-charcoal/30 ${width} ${height} ${className}`
    }
  );
}
export {
  ProtectedRoute as P,
  SkeletonLine as S,
  SkeletonBox as a,
  api as b
};
