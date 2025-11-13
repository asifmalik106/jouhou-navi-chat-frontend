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
            <h5 class="text-center">{{ t('confirm_email.title') }}</h5>
            <p class="text-center text-muted">{{ t('confirm_email.tagline') }}</p>
            <div v-if="state.error" class="alert alert-danger" role="alert">
              <div class="alert-text">
                <p class="alert-heading">{{ t('confirm_email.title') }}</p>
                <p class="alert-body">{{ state.error }}</p>
              </div>
            </div>
            <div v-if="state.success" class="alert alert-success" role="alert">
              <div class="alert-text">
                <p class="alert-heading">{{ t('confirm_email.title') }}</p>
                <p class="alert-body">{{ state.success }}</p>
              </div>
            </div>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="confirmEmail" class="form-label">{{ t('confirm_email.email') }}</label>
                <input v-model="form.email" type="email" class="form-control" id="confirmEmail" required />
              </div>
              <div class="mb-3">
                <label for="confirmCode" class="form-label">{{ t('confirm_email.code') }}</label>
                <input v-model="form.code" type="text" class="form-control" id="confirmCode" required />
              </div>
              <button type="submit" class="btn btn-dark btn-full mb-3" :disabled="state.loading">
                <span v-if="state.loading" class="spinner-border spinner-border-sm me-2" role="status"
                  aria-hidden="true"></span>
                {{ t('confirm_email.cta') }}
              </button>
            </form>
            <p class="text-center text-muted mb-2 mt-2">{{ t('confirm_email.resend') }}</p>
            <RouterLink class="btn btn-light btn-full mb-2" to="/register">
              {{ t('register.register') }}
            </RouterLink>
            <RouterLink class="btn btn-outline-dark btn-full" to="/login">
              {{ t('confirm_email.login_cta') }}
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
    await authApi.confirmEmail({
      email: form.email,
      code: form.code,
    });
    state.success = t('confirm_email.success_message');
  } catch (error) {
    state.error = error.message || t('confirm_email.error_message');
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
