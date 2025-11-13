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
            <h5 class="text-center">{{ t('register.title') }}</h5>
            <p class="text-center text-muted">{{ t('register.tagline') }}</p>
            <AlertBox
              v-if="state.error"
              type="danger"
              :title="t('register.alert_title_error')"
              :description="state.error"
            />
            <AlertBox
              v-if="state.success"
              type="success"
              :title="t('register.title')"
              :description="state.success"
            />
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="registerName" class="form-label">{{ t('register.name') }}</label>
                <input v-model="form.name" type="text" class="form-control" id="registerName" required />
              </div>
              <div class="mb-3">
                <label for="registerEmail" class="form-label">{{ t('register.email') }}</label>
                <input v-model="form.email" type="email" class="form-control" id="registerEmail" required />
              </div>
              <div class="mb-3">
                <label for="registerPassword" class="form-label">{{ t('register.password') }}</label>
                <input v-model="form.password" type="password" class="form-control" id="registerPassword" required />
              </div>
              <div class="mb-3">
                <label for="registerConfirmPassword" class="form-label">{{ t('register.confirm_password') }}</label>
                <input v-model="form.confirmPassword" type="password" class="form-control"
                  id="registerConfirmPassword" required />
              </div>
              <button type="submit" class="btn btn-dark btn-full mb-3" :disabled="state.loading">
                <span v-if="state.loading" class="spinner-border spinner-border-sm me-2" role="status"
                  aria-hidden="true"></span>
                {{ t('register.cta') }}
              </button>
            </form>
            <p class="text-center text-muted mb-2 mt-2">{{ t('register.login_label') }}</p>
            <RouterLink class="btn btn-light btn-full" to="/login">
              {{ t('register.login') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AlertBox from '../components/AlertBox.vue';
import { authApi } from '../services/authApi';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const state = reactive({
  loading: false,
  error: '',
  success: '',
});

const handleSubmit = async () => {
  state.loading = true;
  state.error = '';
  state.success = '';

  if (form.password !== form.confirmPassword) {
    state.loading = false;
    state.error = t('register.alert_tagline');
    return;
  }

  try {
    await authApi.register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    state.success = t('register.success_message');
    await router.push({
      name: 'confirm-email',
      query: { email: form.email },
    });
  } catch (error) {
    state.error = error.message || t('register.error_message');
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
