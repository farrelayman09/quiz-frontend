<template>
    <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
      <v-card class="pa-7" elevation="10" max-width="500" width="100%">
        <v-card-title class="text-center text-h5">Register</v-card-title>
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
  
            <v-text-field  
              v-model="confirmPasswordModel"
              :counter="128" 
              :error-messages="confirmPassword.errorMessage.value" 
              label="Confirm Password"
              type="password"
              required
            ></v-text-field>
  
            <v-alert v-if="errorMessage" type="error" class="mb-3">{{ errorMessage }}</v-alert>
            <v-alert v-if="successMessage" type="success" class="mb-3">{{ successMessage }}</v-alert>
  
            <v-btn block class="mt-2" color="primary" type="submit" :loading="loading">Register</v-btn>
            <v-btn block variant="text" class="mt-2" @click="handleReset">Clear</v-btn>
  
            <div class="text-center mt-4">
              <span>Already have an account?</span>
              <router-link to="/login" class="text-primary text-decoration-none ml-1">Login</router-link>
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
  const confirmPassword = useField("confirmPassword");
  const router = useRouter();
  
  const loading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");
  
  // Agar tidak terjadi [object Object] pada input
  const usernameModel = computed({
    get: () => username.value.value || "",
    set: (val) => (username.value.value = val),
  });
  
  const passwordModel = computed({
    get: () => password.value.value || "",
    set: (val) => (password.value.value = val),
  });
  
  const confirmPasswordModel = computed({
    get: () => confirmPassword.value.value || "",
    set: (val) => (confirmPassword.value.value = val),
  });
  
  const submit = async () => {
    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";
  
    if (passwordModel.value !== confirmPasswordModel.value) {
      errorMessage.value = "Passwords do not match";
      loading.value = false;
      return;
    }
  
    try {
      const response = await api.post("auth/register", {
        username: usernameModel.value,
        password: passwordModel.value,
      });
  
      console.log("Registration successful:", response.data);
      successMessage.value = "Registration successful! Redirecting to login...";
  
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      errorMessage.value = "Registration failed";
      console.error("Registration error:", error);
    } finally {
      loading.value = false;
    }
  };
  
  const handleReset = () => {
    resetForm();
    errorMessage.value = "";
    successMessage.value = "";
  };
  </script>
  