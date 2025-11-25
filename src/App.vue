<template>
  <div class="app" :class="localeClass">
    <header class="bg-dark text-white py-3">
      <div class="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-3">
        <nav class="nav flex-wrap gap-3">
          <RouterLink class="nav-link text-white px-0" to="/">
            {{ t('navigation.home') }}
          </RouterLink>
          <RouterLink class="nav-link text-white px-0" to="/#howto">
            {{ t('navigation.howto') }}
          </RouterLink>
          <RouterLink v-if="isAuthed" class="nav-link text-white px-0" to="/products">
            {{ t('navigation.products') }}
          </RouterLink>
          <RouterLink v-if="isAuthed" class="nav-link text-white px-0" to="/chat">
            {{ t('navigation.chat') }}
          </RouterLink>
          <RouterLink v-if="isAuthed" class="nav-link text-white px-0" to="/profile">
            {{ t('navigation.profile') }}
          </RouterLink>
        </nav>
        <div class="d-flex align-items-center gap-3">
          <label class="d-flex align-items-center gap-2 mb-0">
            <span class="small text-nowrap">{{ t('language.label') }}</span>
            <select v-model="locale" class="form-select form-select-sm text-bg-dark border-secondary">
              <option
                v-for="option in languageOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>
          <button
            v-if="isAuthed"
            class="btn btn-sm btn-outline-light"
            @click="handleLogout"
          >
            <i class="bi bi-box-arrow-right me-1"></i>
            {{ t('navigation.logout') }}
          </button>
          <RouterLink
            v-else
            class="btn btn-sm btn-outline-light"
            to="/login"
          >
            {{ t('navigation.login') }}
          </RouterLink>
        </div>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { isAuthenticated, clearStoredTokens, AUTH_CHANGE_EVENT } from './services/authApi';

const { t, locale } = useI18n({ useScope: 'global' });
const router = useRouter();
const isAuthed = ref(false);

const languageOptions = computed(() => [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'bn', label: 'বাংলা' },
]);

const localeClass = computed(() => {
  const map = {
    en: 'locale-en',
    ja: 'locale-ja',
    bn: 'locale-bn',
  };

  return map[locale.value] ?? 'locale-en';
});

const refreshAuthState = () => {
  isAuthed.value = isAuthenticated();
};

const handleLogout = () => {
  clearStoredTokens();
  refreshAuthState();
  router.push({ name: 'login' });
};

onMounted(() => {
  refreshAuthState();
  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_CHANGE_EVENT, refreshAuthState);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener(AUTH_CHANGE_EVENT, refreshAuthState);
  }
});
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f5f5;
  line-height: 1.6;
}

.app-main {
  padding: 2rem;
}
</style>
