<template>
  <v-app id="inspire">
    <NavigationDrawer />


      <v-app-bar>
        <v-app-bar-nav-icon @click="drawerStore.drawer = !drawerStore.drawer">
          <!-- <v-icon>mdi-dots-grid</v-icon> Replace mdi-menu with other icons -->
        </v-app-bar-nav-icon>
        <v-app-bar-title>
          <router-link to="/" style="text-decoration: none; color: inherit;">
            QuizApp
          </router-link>
        </v-app-bar-title>
      </v-app-bar>


    <v-main>
      <!-- <router-view></router-view> -->
      <v-container class="pa-8">

        <v-row>
          <v-col cols="11">
            <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
              hide-details single-line class="mb-8"></v-text-field>
          </v-col>
          <v-col cols="1">
            <div class="text-center">
              <v-dialog width="auto" scrollable>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn variant="tonal" class="d-flex align-center mb-4" style="height: 55px;" v-bind="activatorProps">
                    <v-icon size="25">mdi-tune</v-icon>

                  </v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card title="Filter by Creation Date" width="500px">
                    <v-divider class="mt-3"></v-divider>

                    <v-card-text class="px-4" style="height: 250px;">
                      <v-radio-group v-model="selectedDateFilter" messages="Select CreatedAt Date">
                        <v-radio label="All" value="all"></v-radio>
                        <v-radio label="Today" value="today"></v-radio>
                        <v-radio label="This week" value="this_week"></v-radio>
                        <v-radio label="This month" value="this_month"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn text="CLOSE" variant="tonal" @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </div>
          </v-col>
        </v-row>

        <v-row dense>


          <v-col cols="12" v-for="tryout in filteredTryouts" :key="tryout.id">
            <v-card color="#385F73">
              <v-card-title class="text-h5">{{ tryout.title }}</v-card-title>
              <v-card-subtitle>{{ tryout.category }}</v-card-subtitle>
              <v-card-subtitle>created at: {{ new Date(tryout.createdAt).toLocaleDateString() }}</v-card-subtitle>
              <v-card-actions>
                <v-btn text="Do tryout" @click="doTryout(tryout._id)" variant="tonal"></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>


        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>



<script setup>
import { ref, onMounted } from "vue";
// import axios from "axios";
import { useRouter } from "vue-router";
import api from "../router/api";
import { getCurrentInstance } from "vue";


const search = ref(""); // Variabel pencarian
const tryouts = ref([]);
const router = useRouter();
const loggedInUser = ref("Guest");
const loggedInId = ref(null);
const { proxy } = getCurrentInstance();
import { useDrawerStore } from "../stores/useDrawerStore";
import NavigationDrawer from "../components/NavigationDrawer";

const drawerStore = useDrawerStore();

const selectedDateFilter = ref("all");

onMounted(async () => {
  try {
    loggedInUser.value = localStorage.getItem("username") || "Guest";
    loggedInId.value = localStorage.getItem("id")
    const response = await api.get("tryout/ready");
    tryouts.value = response.data;
    console.log("tryouts", tryouts.value);
  } catch (error) {
    console.error("Failed to fetch tryouts:", error);
  }
});

// Computed Property untuk filter daftar tryouts berdasarkan search
// Computed Property untuk filter daftar tryouts berdasarkan search
const filteredTryouts = computed(() => {
  return tryouts.value.filter((tryout) => {
    const createdAt = new Date(tryout.createdAt);
    const today = new Date();

    // Filter berdasarkan rentang waktu
    if (selectedDateFilter.value === "today") {
      return createdAt.toDateString() === today.toDateString();
    } else if (selectedDateFilter.value === "this_week") {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      return createdAt >= startOfWeek;
    } else if (selectedDateFilter.value === "this_month") {
      return (
        createdAt.getFullYear() === today.getFullYear() &&
        createdAt.getMonth() === today.getMonth()
      );
    }
    return true;
  }).filter((tryout) =>
    tryout.title.toLowerCase().includes(search.value.toLowerCase()) ||
    tryout.category.toLowerCase().includes(search.value.toLowerCase())
  );
});

const doTryout = (id) => {
  router.push(`/do-tryout/${id}`);
};
</script>