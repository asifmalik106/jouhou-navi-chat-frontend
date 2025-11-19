<template>
  <section class="view profile-view">
    <header class="profile-header">
      <div>
        <h1>{{ t('profile.title') }}</h1>
        <p class="muted">{{ t('profile.subtitle') }}</p>
      </div>
      <button
        v-if="accessToken"
        type="button"
        class="btn btn-outline-dark logout-btn"
        :disabled="logoutState.loading"
        @click="handleLogout"
      >
        <span
          v-if="logoutState.loading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        {{ t('profile.logout.cta') }}
      </button>
    </header>

    <AlertBox
      v-if="logoutState.error"
      type="danger"
      :description="logoutState.error"
    />
    <AlertBox
      v-if="logoutState.success"
      type="success"
      :description="logoutState.success"
    />

    <div v-if="!accessToken" class="card message-card">
      <p class="mb-3">{{ t('profile.login_required') }}</p>
      <RouterLink class="btn btn-dark" to="/login">
        {{ t('login.login') }}
      </RouterLink>
    </div>

    <template v-else>
      <div class="card info-card">
        <div class="card-header">
          <div>
            <h2>{{ t('profile.info_title') }}</h2>
            <p class="muted">{{ t('profile.info_subtitle') }}</p>
          </div>
          <button
            type="button"
            class="btn btn-outline-dark btn-sm"
            :disabled="profileState.loading"
            @click="loadProfile"
          >
            <span
              v-if="profileState.loading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ t('profile.refresh') }}
          </button>
        </div>
        <div class="card-body">
          <AlertBox
            v-if="profileState.error"
            type="danger"
            :description="profileState.error"
          />
          <div v-else-if="profileState.profile" class="profile-details">
            <dl>
              <div class="detail-row">
                <dt>{{ t('profile.labels.name') }}</dt>
                <dd>{{ profileState.profile.name ?? '-' }}</dd>
              </div>
              <div class="detail-row">
                <dt>{{ t('profile.labels.email') }}</dt>
                <dd>{{ profileState.profile.email ?? '-' }}</dd>
              </div>
              <div class="detail-row">
                <dt>{{ t('profile.labels.verified') }}</dt>
                <dd>
                  {{ profileState.profile.emailVerified ? t('profile.labels.verified_true') : t('profile.labels.verified_false') }}
                </dd>
              </div>
            </dl>
            <div v-if="formattedRaw" class="raw-block">
              <p class="muted">{{ t('profile.raw_title') }}</p>
              <pre>{{ formattedRaw }}</pre>
            </div>
          </div>
          <p v-else class="muted">{{ t('profile.empty_state') }}</p>
        </div>
      </div>

      <div class="card password-card">
        <div class="card-header">
          <div>
            <h2>{{ t('profile.password.title') }}</h2>
            <p class="muted">{{ t('profile.password.subtitle') }}</p>
          </div>
        </div>
        <div class="card-body">
          <AlertBox
            v-if="passwordState.error"
            type="danger"
            :description="passwordState.error"
          />
          <AlertBox
            v-if="passwordState.success"
            type="success"
            :description="passwordState.success"
          />
          <form class="password-form" @submit.prevent="handleChangePassword">
            <div class="mb-3">
              <label class="form-label" for="oldPassword">{{
                t('profile.password.old')
              }}</label>
              <input
                id="oldPassword"
                v-model="passwordForm.oldPassword"
                type="password"
                class="form-control"
                autocomplete="current-password"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label" for="newPassword">{{
                t('profile.password.new')
              }}</label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                class="form-control"
                autocomplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              class="btn btn-dark"
              :disabled="passwordState.loading"
            >
              <span
                v-if="passwordState.loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {{ t('profile.password.submit') }}
            </button>
          </form>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AlertBox from '../components/AlertBox.vue';
import {
  AUTH_CHANGE_EVENT,
  authApi,
  clearStoredTokens,
  getStoredTokens,
} from '../services/authApi';

const { t } = useI18n({ useScope: 'global' });

const tokens = ref(getStoredTokens());
const accessToken = computed(() => tokens.value?.accessToken ?? '');
const refreshToken = computed(() => tokens.value?.refreshToken ?? '');

const profileState = reactive({
  loading: false,
  error: '',
  profile: null,
});

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
});

const passwordState = reactive({
  loading: false,
  error: '',
  success: '',
});

const logoutState = reactive({
  loading: false,
  error: '',
  success: '',
});

const formattedRaw = computed(() =>
  profileState.profile?.raw
    ? JSON.stringify(profileState.profile.raw, null, 2)
    : '',
);

const syncTokens = () => {
  tokens.value = getStoredTokens();
};

const loadProfile = async () => {
  if (!accessToken.value) return;
  profileState.loading = true;
  profileState.error = '';

  try {
    const data = await authApi.getProfile({
      accessToken: accessToken.value,
    });
    profileState.profile = data;
  } catch (error) {
    profileState.error = error?.message || t('profile.errors.generic');
  } finally {
    profileState.loading = false;
  }
};

const handleChangePassword = async () => {
  passwordState.loading = true;
  passwordState.error = '';
  passwordState.success = '';

  if (!accessToken.value) {
    passwordState.error = t('profile.errors.missing_token');
    passwordState.loading = false;
    return;
  }

  try {
    await authApi.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      accessToken: accessToken.value,
    });
    passwordState.success = t('profile.password.success');
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
  } catch (error) {
    passwordState.error =
      error?.message || t('profile.password.error_generic');
  } finally {
    passwordState.loading = false;
  }
};

const handleLogout = async () => {
  logoutState.loading = true;
  logoutState.error = '';
  logoutState.success = '';

  if (!accessToken.value || !refreshToken.value) {
    logoutState.error = t('profile.logout.missing_token');
    logoutState.loading = false;
    return;
  }

  try {
    await authApi.logout({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    });
    clearStoredTokens();
    logoutState.success = t('profile.logout.success');
  } catch (error) {
    logoutState.error = error?.message || t('profile.logout.error');
  } finally {
    logoutState.loading = false;
  }
};

onMounted(() => {
  if (accessToken.value) {
    loadProfile();
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', syncTokens);
    window.addEventListener(AUTH_CHANGE_EVENT, syncTokens);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', syncTokens);
    window.removeEventListener(AUTH_CHANGE_EVENT, syncTokens);
  }
});

watch(
  () => accessToken.value,
  (current, previous) => {
    if (current && current !== previous) {
      loadProfile();
      logoutState.error = '';
      logoutState.success = '';
    }
    if (!current) {
      profileState.profile = null;
      profileState.error = '';
    }
  },
);
</script>

<style scoped>
.profile-view {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile-header h1 {
  margin-bottom: 0.25rem;
}

.logout-btn {
  white-space: nowrap;
}

.muted {
  color: #4a5568;
  margin: 0;
}

.card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 1.25rem 1.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.card-body {
  padding: 0.5rem 1.5rem 1.5rem;
}

.profile-details dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px dashed #edf2f7;
  padding-bottom: 0.5rem;
}

.detail-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

dt {
  font-weight: 600;
  color: #2d3748;
}

dd {
  margin: 0;
  color: #1a202c;
  text-align: right;
}

.raw-block {
  margin-top: 1rem;
}

.raw-block pre {
  background: #1a202c;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.85rem;
}

.password-form .btn {
  min-width: 200px;
}

.message-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

@media (max-width: 640px) {
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  dd {
    text-align: left;
  }
}
</style>
