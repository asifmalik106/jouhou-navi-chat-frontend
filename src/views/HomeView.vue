<template>
  <section class="home-hero py-5">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-7">
          <p class="fs-3 text-uppercase text-primary fw-semibold small mb-2">
            {{ t('home.hero_eyebrow') }}
          </p>
          <h1 class="display-5 fw-semibold mb-3">
            {{ t('home.hero_title') }}
          </h1>
          <p class="lead text-muted mb-4">
            {{ t('home.hero_subtitle') }}
          </p>
          <div class="d-flex flex-wrap gap-3 mb-4">
            <RouterLink class="btn btn-dark btn-lg" to="/chat">
              {{ t('home.hero_primary_cta') }}
            </RouterLink>
            <RouterLink class="btn btn-outline-dark btn-lg" to="/products">
              {{ t('home.hero_secondary_cta') }}
            </RouterLink>
          </div>
          <div class="row g-3 text-center text-md-start">
            <div class="col-md-4">
              <p class="h2 fw-semibold mb-0">{{ t('home.stats.vector_value') }}</p>
              <p class="text-muted small mb-0">{{ t('home.stats.vector_label') }}</p>
            </div>
            <div class="col-md-4">
              <p class="h2 fw-semibold mb-0">{{ t('home.stats.products_value') }}</p>
              <p class="text-muted small mb-0">{{ t('home.stats.products_label') }}</p>
            </div>
            <div class="col-md-4">
              <p class="h2 fw-semibold mb-0">{{ t('home.stats.latency_value') }}</p>
              <p class="text-muted small mb-0">{{ t('home.stats.latency_label') }}</p>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <p class="fs-3 text-uppercase text-muted small mb-2">
                {{ t('home.pipeline.title') }}
              </p>
              <ul class="list-unstyled mb-0">
                <li v-for="step in pipelineSteps" :key="step" class="mb-3 d-flex align-items-start gap-2">
                  <span class="badge bg-dark-subtle text-dark-emphasis rounded-pill mt-1">
                    {{ step.order }}
                  </span>
                  <div>
                    <p class="fw-semibold mb-1">{{ t(step.title) }}</p>
                    <p class="text-muted small mb-0">{{ t(step.body) }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="home-features py-5 bg-light">
    <div class="container">
      <div class="text-center mb-5">
        <p class="fs-3 text-uppercase text-primary fw-semibold small mb-2">
          {{ t('home.features.eyebrow') }}
        </p>
        <h2 class="fw-semibold">{{ t('home.features.title') }}</h2>
        <p class="text-muted mb-0">
          {{ t('home.features.subtitle') }}
        </p>
      </div>
      <div class="row g-4">
        <div
          v-for="key in featureKeys"
          :key="key"
          class="col-md-4"
        >
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5 mb-2">{{ t(`home.features.${key}.title`) }}</h3>
              <p class="text-muted mb-0">{{ t(`home.features.${key}.body`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="howto" class="home-howto py-5">
    <div class="container">
      <div class="text-center mb-4">
        <p class="fs-3 text-uppercase text-primary fw-semibold small mb-2">
          {{ t('home.howto.title') }}
        </p>
        <p class="text-muted mb-0">
        <span>{{ t('app_name.title') }}<sup class="badge text-bg-dark logo-sup-text">{{ t('app_name.tag') }}</sup></span>
                    {{ t('home.howto.body') }}
        </p>
      </div>

      <div class="row g-4">
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex flex-column gap-4">
                <div class="d-flex gap-3 align-items-start">
                  <span class="fs-5 badge bg-dark-subtle text-dark-emphasis rounded-pill mt-1">{{ t('home.howto.step') }} 1</span>
                  <div>
                    <h3 class="h5 mb-1">{{ t('navigation.login') }}</h3>
                    <p class="mb-1">
                    
                      {{ t('home.howto.steps.login.description') }}
                    </p>
                    <RouterLink class="btn btn-link px-0" to="/login">
                      {{ t('navigation.login') }}
                    </RouterLink>
                    <span class="text-muted mx-1">/</span>
                    <RouterLink class="btn btn-link px-0" to="/register">
                      {{ t('navigation.register') }}
                    </RouterLink>
                  </div>
                </div>
                <div class="d-flex gap-3 align-items-start">
                  <h3 class="fs-5 badge bg-dark-subtle text-dark-emphasis rounded-pill mt-1">{{ t('home.howto.step') }} 2</h3>
                  <div>
                    <h3 class="h5 mb-1">{{ t('navigation.products') }}</h3>
                    <p class="mb-1">
                      {{ t('home.howto.steps.products.description') }}
                    </p>
                    <RouterLink class="btn btn-link px-0" to="/products">
                      {{ t('navigation.products') }}
                    </RouterLink>
                  </div>
                </div>
                <div class="d-flex gap-3 align-items-start">
                  <h3 class="fs-5 badge bg-dark-subtle text-dark-emphasis rounded-pill mt-1">{{ t('home.howto.step') }} 3</h3>
                  <div>
                    <h3 class="h5 mb-1">{{ t('navigation.chat') }}</h3>
                    <p class="mb-1">
                      {{ t('home.howto.steps.chat.description') }}
                    </p>
                    <RouterLink class="btn btn-link px-0" to="/chat">
                      {{ t('navigation.chat') }}
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const featureKeys = ['capture', 'vectorize', 'chat'];
const pipelineSteps = computed(() => [
  {
    order: 1,
    title: 'home.pipeline.steps.capture.title',
    body: 'home.pipeline.steps.capture.body',
  },
  {
    order: 2,
    title: 'home.pipeline.steps.vectorize.title',
    body: 'home.pipeline.steps.vectorize.body',
  },
  {
    order: 3,
    title: 'home.pipeline.steps.answer.title',
    body: 'home.pipeline.steps.answer.body',
  },
]);
</script>

<style scoped>
.home-hero {
  background: linear-gradient(135deg, #f8f9fd, #eef2ff);
}

.home-hero .nav-link.router-link-active {
  text-decoration: underline;
}

.card ul {
  margin-bottom: 0;
}
</style>
