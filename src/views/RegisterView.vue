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
            <div class="alert alert-info" role="alert">
              <span class="alert-icon"><i class="bi bi-info-lg"></i></span>
              <div class="alert-text">
                <p class="alert-heading">{{ t('register.alert_title') }}</p>
                <p class="alert-body">{{ t('register.alert_tagline') }}</p>
              </div>
            </div>
            <form>
              <div class="mb-3">
                <label for="registerName" class="form-label">{{ t('register.name') }}</label>
                <input type="text" class="form-control" id="registerName" />
              </div>
              <div class="mb-3">
                <label for="registerEmail" class="form-label">{{ t('register.email') }}</label>
                <input type="email" class="form-control" id="registerEmail" />
              </div>
              <div class="mb-3">
                <label for="registerPassword" class="form-label">{{ t('register.password') }}</label>
                <input type="password" class="form-control" id="registerPassword" />
              </div>
              <div class="mb-3">
                <label for="registerConfirmPassword" class="form-label">{{ t('register.confirm_password') }}</label>
                <input type="password" class="form-control" id="registerConfirmPassword" />
              </div>
              <button type="submit" class="btn btn-dark btn-full mb-3">{{ t('register.cta') }}</button>
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
</script>

<style scoped>
.view {
  min-height: 60vh;
}
</style>
