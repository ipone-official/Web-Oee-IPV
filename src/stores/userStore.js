// src/stores/userStore.js
import { defineStore } from "pinia";
import { getUser } from "@/services/apiService";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    empId: "",
    group: "",
    samAccount: "",
    mobile: "",
    company: "",
    department: "",
    position: "",
    telephone: "",
    pathUrl: "",

    isAuthenticated: false,
    isUserReady: false, // 🔑 สำคัญมาก กันหน้าขาว

    accessToken: "",
    refreshToken: "",
  }),

  actions: {
    /* =========================
       LOGIN (ใช้หลัง login / hydrate)
    ========================= */
    login(userData) {
      this.name = userData.name || "";
      this.firstName = userData.firstName || "";
      this.lastName = userData.lastName || "";
      this.email = userData.email || "";
      this.empId = userData.empId || "";
      this.group = userData.group || "";
      this.samAccount = userData.samAccount || "";
      this.mobile = userData.mobile || "";
      this.company = userData.company || "";
      this.department = userData.department || "";
      this.position = userData.position || "";
      this.telephone = userData.telephone || "";
      this.pathUrl = userData.pathUrl || "";

      this.accessToken = userData.accessToken || "";
      this.refreshToken = userData.refreshToken || "";

      this.isAuthenticated = true;
      this.isUserReady = true;
    },

    /* =========================
       LOGOUT
    ========================= */
    logout() {
      this.$reset();
      // 🔑 สำคัญ: อย่าปล่อยให้ false ค้าง
      this.isUserReady = true;
    },

    /* =========================
       INIT AFTER REFRESH (หัวใจของปัญหา)
    ========================= */
    async initFromStorage() {
      this.isUserReady = false

      try {
        const accessToken = localStorage.getItem("accessTokenIpvOee")
        const refreshToken = localStorage.getItem("refreshTokenIpvOee")

        if (!accessToken) {
          this.logout()
          return
        }

        const payload = JSON.parse(atob(accessToken.split(".")[1]))

        const username =
          payload.name ||
          payload.preferred_username ||
          payload.samAccountName ||
          payload.upn ||
          payload.sub

        if (!username) {
          throw new Error("Username not found in token")
        }

        const res = await getUser(username)
        const userProfile = res.data ?? res

        this.login({
          ...userProfile,
          accessToken,
          refreshToken,
        })
      } catch (err) {
        console.error("[UserStore] initFromStorage failed:", err)
        this.logout()
      } finally {
        this.isUserReady = true
      }
    },

    setUserReady(status) {
      this.isUserReady = status;
    },
  },
});
