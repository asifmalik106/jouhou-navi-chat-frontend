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
            <h5 class="text-center">{{ t('forgot.title') }}</h5>
            <p class="text-center text-muted">{{ t('forgot.tagline') }}</p>
            <AlertBox
              type="warning"
              :title="t('forgot.alert_title')"
              :description="t('forgot.alert_tagline')"
            />
            <AlertBox
              v-if="state.error"
              type="danger"
              :title="t('forgot.title')"
              :description="state.error"
            />
            <AlertBox
              v-if="state.success"
              type="success"
              :title="t('forgot.title')"
              :description="state.success"
            />
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="forgotEmail" class="form-label">{{ t('forgot.email') }}</label>
                <input v-model="email" type="email" class="form-control" id="forgotEmail" required />
              </div>
              <button type="submit" class="btn btn-dark btn-full mb-3" :disabled="state.loading">
                <span v-if="state.loading" class="spinner-border spinner-border-sm me-2" role="status"
                  aria-hidden="true"></span>
                {{ t('forgot.cta') }}
              </button>
            </form>
            <p class="text-center text-muted mb-2 mt-2">{{ t('forgot.login_label') }}</p>
            <RouterLink class="btn btn-light btn-full" to="/login">
              {{ t('forgot.login') }}
            </RouterLink>
            <RouterLink v-if="state.canConfirm" class="btn btn-outline-dark btn-full mt-2"
              :to="{ name: 'forgot-confirm', query: { email } }">
              {{ t('forgot.confirm_cta') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import AlertBox from '../components/AlertBox.vue';
import { authApi } from '../services/authApi';

const { t } = useI18n({ useScope: 'global' });
const email = ref('');

const state = reactive({
  loading: false,
  error: '',
  success: '',
  canConfirm: false,
});

const handleSubmit = async () => {
  state.loading = true;
  state.error = '';
  state.success = '';

  try {
    await authApi.forgot({
      email: email.value,
    });
    state.success = t('forgot.success_message');
    state.canConfirm = true;
  } catch (error) {
    state.error = error.message || t('forgot.error_message');
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
