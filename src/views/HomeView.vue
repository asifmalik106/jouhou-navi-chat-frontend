<template>
  <section class="view">
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.message') }}</p>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
</script>

<style scoped>
.view {
  padding: 2rem;
  line-height: 1.6;
}
</style>
