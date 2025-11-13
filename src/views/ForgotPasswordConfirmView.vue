<template>
  <section class="view">
    <div class="container">
      <div class="row align-items-center" style="height: 90vh">
        <div class="offset-xl-4 offset-lg-4 offset-md-3 col-xl-4 col-lg-4 col-md-6 col-sm-12">
          <div class="login-box">
            <h4 class="text-center fw-medium mb-4">
              {{ t('app_name.title') }}
              <sup class="badge text-bg-dark logo-sup-text">{{ t('app_name.tag') }}</sup>
            </h4>
            <h5 class="text-center">{{ t('forgot_confirm.title') }}</h5>
            <p class="text-center text-muted">{{ t('forgot_confirm.tagline') }}</p>
            <div v-if="state.error" class="alert alert-danger" role="alert">
              <div class="alert-text">
                <p class="alert-heading">{{ t('forgot_confirm.title') }}</p>
                <p class="alert-body">{{ state.error }}</p>
              </div>
            </div>
            <div v-if="state.success" class="alert alert-success" role="alert">
              <div class="alert-text">
                <p class="alert-heading">{{ t('forgot_confirm.title') }}</p>
                <p class="alert-body">{{ state.success }}</p>
              </div>
            </div>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="forgotConfirmEmail" class="form-label">{{ t('forgot_confirm.email') }}</label>
                <input v-model="form.email" type="email" class="form-control" id="forgotConfirmEmail" required />
              </div>
              <div class="mb-3">
                <label for="forgotConfirmCode" class="form-label">{{ t('forgot_confirm.code') }}</label>
                <input v-model="form.code" type="text" class="form-control" id="forgotConfirmCode" required />
              </div>
              <div class="mb-3">
                <label for="forgotConfirmPassword" class="form-label">{{ t('forgot_confirm.new_password') }}</label>
                <input v-model="form.newPassword" type="password" class="form-control" id="forgotConfirmPassword" required />
              </div>
              <button type="submit" class="btn btn-dark btn-full mb-3" :disabled="state.loading">
                <span v-if="state.loading" class="spinner-border spinner-border-sm me-2" role="status"
                  aria-hidden="true"></span>
                {{ t('forgot_confirm.cta') }}
              </button>
            </form>
            <RouterLink class="btn btn-light btn-full" to="/login">
              {{ t('forgot_confirm.login_cta') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { authApi } from '../services/authApi';

const { t } = useI18n({ useScope: 'global' });
const route = useRoute();

const form = reactive({
  email: route.query.email ?? '',
  code: '',
  newPassword: '',
});

const state = reactive({
  loading: false,
  error: '',
  success: '',
});

watch(
  () => route.query.email,
  (value) => {
    if (value) {
      form.email = value;
    }
  },
);

const handleSubmit = async () => {
  state.loading = true;
  state.error = '';
  state.success = '';

  try {
    await authApi.confirmForgot({
      email: form.email,
      code: form.code,
      newPassword: form.newPassword,
    });
    state.success = t('forgot_confirm.success_message');
    form.newPassword = '';
  } catch (error) {
    state.error = error.message || t('forgot_confirm.error_message');
  } finally {
    state.loading = false;
  }
};
</script>

<style scoped>
.view {
  min-height: 60vh;
}
</style>
