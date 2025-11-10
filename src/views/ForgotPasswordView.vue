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
            <div class="alert alert-warning" role="alert">
              <span class="alert-icon"><i class="bi bi-exclamation-lg"></i></span>
              <div class="alert-text">
                <p class="alert-heading">{{ t('forgot.alert_title') }}</p>
                <p class="alert-body">{{ t('forgot.alert_tagline') }}</p>
              </div>
            </div>
            <form>
              <div class="mb-3">
                <label for="forgotEmail" class="form-label">{{ t('forgot.email') }}</label>
                <input type="email" class="form-control" id="forgotEmail" />
              </div>
              <button type="submit" class="btn btn-dark btn-full mb-3">{{ t('forgot.cta') }}</button>
            </form>
            <p class="text-center text-muted mb-2 mt-2">{{ t('forgot.login_label') }}</p>
            <RouterLink class="btn btn-light btn-full" to="/login">
              {{ t('forgot.login') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
</script>

<style scoped>
.view {
  min-height: 60vh;
}
</style>
