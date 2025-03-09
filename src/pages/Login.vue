<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="pa-7" elevation="10" max-width="500" width="100%">
      <v-card-title class="text-center text-h5">Login</v-card-title>
      <v-card-text>
        <form @submit.prevent="submit">
          <v-text-field  
            v-model="usernameModel"
            :counter="30" 
            :error-messages="username.errorMessage.value" 
            label="Username"
            required
          ></v-text-field>

          <v-text-field  
            v-model="passwordModel"
            :counter="128" 
            :error-messages="password.errorMessage.value" 
            label="Password"
            type="password"
            required
          ></v-text-field>

          <v-alert v-if="errorMessage" type="error" class="mb-3">{{ errorMessage }}</v-alert>

          <v-btn block class="mt-2" color="primary" type="submit" :loading="loading">Submit</v-btn>
          <v-btn block variant="text" class="mt-2" @click="handleReset">Clear</v-btn>

          <div class="text-center mt-4">
            <span>Don't have an account?</span>
            <router-link to="/register" class="text-primary text-decoration-none ml-1">Register</router-link>
          </div>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useField, useForm } from "vee-validate";
import { useRouter } from "vue-router";
import api from "../router/api";


const { handleSubmit, resetForm } = useForm();
const username = useField("username");
const password = useField("password");
const router = useRouter();

const loading = ref(false);
const errorMessage = ref("");

// Agar tidak terjadi [object Object] pada input
const usernameModel = computed({
  get: () => username.value.value || "",
  set: (val) => (username.value.value = val),
});

const passwordModel = computed({
  get: () => password.value.value || "",
  set: (val) => (password.value.value = val),
});

const submit = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
        const response = await api.post("auth/login", {
            username: usernameModel.value,
            password: passwordModel.value,
        });

        console.log("Login successful:", response.data);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem("id", response.data.user.id);
        localStorage.setItem("username", response.data.user.username);  
  
        router.push("/");
    } catch (error) {
        errorMessage.value = "Login failed";
        console.error("Login error:", error);
    } finally {
        loading.value = false;
    }
};

const handleReset = () => {
  resetForm();
  errorMessage.value = "";
};
</script>
