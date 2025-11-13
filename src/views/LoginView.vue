<template>
  <section class="view">
 
    <div class="container">
        <div class="row align-items-center" style="height:90vh">
            <div class="offset-xl-4 offset-lg-4 offset-md-3 col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div class="login-box">
                    <h4 class="text-center fw-medium mb-4">{{ t('app_name.title') }}<sup
                            class="badge text-bg-dark logo-sup-text">{{ t('app_name.tag') }}</sup>
                    </h4>
                    <h5 class="text-center">{{ t('login.login') }}</h5>
                    <p class="text-center text-muted">{{ t('login.tagline') }}</p>
                    <!-- <p class="text-center text-muted">アカウントをお持ちの方はログインしてください。</p> -->
                    <div class="alert alert-danger" role="alert">
                        <span class="alert-icon"><i class="bi bi-x-lg"></i></span>
                        <div class="alert-text">
                            <p class="alert-heading">{{ t('login.alert_title') }}</p>
                            <p class="alert-body">{{ t('login.alert_tagline') }}</p>
                            <!-- <ul>
                            <li>Check your card details</li>
                            <li>Ensure sufficient funds</li>
                            <li>Verify billing address</li>
                        </ul>
                        </p> -->
                        </div>
                    </div>
                    <div v-if="state.error" class="alert alert-danger" role="alert">
                        <div class="alert-text">
                            <p class="alert-heading">{{ t('login.alert_title') }}</p>
                            <p class="alert-body">{{ state.error }}</p>
                        </div>
                    </div>
                    <div v-if="state.success" class="alert alert-success" role="alert">
                        <div class="alert-text">
                            <p class="alert-heading">{{ t('login.login') }}</p>
                            <p class="alert-body">{{ state.success }}</p>
                        </div>
                    </div>
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <!-- <label for="exampleInputEmail1" class="form-label">メールアドレス</label> -->
                            <label for="exampleInputEmail1" class="form-label">{{ t('login.email') }}</label>
                            <input v-model="form.email" type="email" class="form-control" id="exampleInputEmail1"
                                aria-describedby="emailHelp" required>
                            <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">{{ t('login.password') }}</label>
                            <input v-model="form.password" type="password" class="form-control"
                                id="exampleInputPassword1" required>
                        </div>
                        <!-- <div class="mb-3 form-check">
                        <input class="form-check-input form-check-input-dark" type="checkbox" value=""
                            id="checkNativeSwitch" switch>
                        <label class="form-check-label" for="exampleCheck1">Check me out</label>
                    </div> -->
                        <p class="text-mute text-end">
                          <RouterLink class="text-dark text-decoration-none" to="/forgot-password">
                            {{ t('login.forget_password') }}
                          </RouterLink>
                        </p>
                        <button type="submit" class="btn btn-dark btn-full mb-3" :disabled="state.loading">
                          <span v-if="state.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {{ t('login.login') }}
                        </button>

                    </form>
                    <p class="text-center text-muted mb-2 mt-2">{{ t('login.register_label') }}</p>
                    <RouterLink class="btn btn-light btn-full" to="/register">
                      {{ t('login.register') }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>

  </section>
</template>
<script setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { authApi, persistTokens } from '../services/authApi';

const { t } = useI18n({ useScope: 'global' });

const form = reactive({
  email: '',
  password: '',
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

  try {
    const tokens = await authApi.login({
      email: form.email,
      password: form.password,
    });
    persistTokens(tokens);
    state.success = t('login.success_message');
    form.password = '';
  } catch (error) {
    state.error = error.message || t('login.error_message');
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
