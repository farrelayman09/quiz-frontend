<script setup>
import { useDrawerStore } from "../stores/useDrawerStore";
import { ref } from "vue";
import api from "../router/api";
import { useRoute } from "vue-router";

const drawerStore = useDrawerStore();
const loggedInUser = localStorage.getItem("username") // Gantilah dengan state user dari auth store
const router = useRouter();



const logout = async () => {
  try {
    console.log("Logout initial status");
    const response = await api.delete("auth/logout",
      {},
      { withCredentials: true }
    );
    console.log("Logout response:", response.data);
    localStorage.removeItem('accessToken');
    // proxy.updateAuthState(); 
    router.push("/guest");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

</script>

<template>
    <v-navigation-drawer :width="270" v-model="drawerStore.drawer" app>
        <v-list-item class="my-2" :title="`Welcome, ${loggedInUser}`" subtitle="Submit and create tryouts!"></v-list-item>
        <v-list-item router-link to="/" prepend-icon="mdi-home" title="Home"></v-list-item>
        <v-list-item router-link to="/my-tryouts" prepend-icon="mdi-pencil" title="My Tryouts"></v-list-item>
        <v-list-item router-link to="/my-submissions" prepend-icon="mdi-check" title="My Submissions"></v-list-item>
        <v-list-item @click="logout" prepend-icon="mdi-logout" title="Logout"></v-list-item>
    </v-navigation-drawer>
</template>
