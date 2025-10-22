<template>
  <div class="app" :class="localeClass">
    <header class="app-header">
      <nav class="nav">
        <RouterLink class="nav-link" to="/">
          {{ t('navigation.home') }}
        </RouterLink>
        <RouterLink class="nav-link" to="/about">
          {{ t('navigation.about') }}
        </RouterLink>
        <RouterLink class="nav-link" to="/contact">
          {{ t('navigation.contact') }}
        </RouterLink>
      </nav>
      <label class="language-select">
        <span>{{ t('language.label') }}</span>
        <select v-model="locale">
          <option
            v-for="option in languageOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ t(option.labelKey) }}
          </option>
        </select>
      </label>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n({ useScope: 'global' });

const languageOptions = computed(() => [
  { value: 'en', labelKey: 'language.english' },
  { value: 'ja', labelKey: 'language.japanese' },
  { value: 'bn', labelKey: 'language.bengali' },
]);

const localeClass = computed(() => {
  const map = {
    en: 'locale-en',
    ja: 'locale-ja',
    bn: 'locale-bn',
  };

  return map[locale.value] ?? 'locale-en';
});
</script>

<style scoped>
.app {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f5f5f5;
  color: #1a1a1a;
}

.app.locale-ja {
  font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif;
}

.app.locale-bn {
  font-family: 'AdorshoLipi', 'Noto Sans Bengali', 'Vrinda', sans-serif;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2d3748;
  color: #fff;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}

.nav-link.router-link-active {
  text-decoration: underline;
}

.language-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-select select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #4a5568;
  background: #1a202c;
  color: #fff;
}

.app-main {
  padding: 2rem;
}
</style>
