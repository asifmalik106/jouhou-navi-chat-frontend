<template>
  <section class="view">
    <div class="container">
      <div class="row align-items-center" style="height: 90vh">
        <div
          class="offset-xl-4 offset-lg-4 offset-md-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
        >
          <div class="login-box">
            <h4 class="text-center fw-medium mb-4">
              {{ t("app_name.title") }}
              <sup class="badge text-bg-dark logo-sup-text">{{
                t("app_name.tag")
              }}</sup>
            </h4>
            <h5 class="text-center">{{ t("confirm_email.title") }}</h5>
            <p class="text-center text-muted">
              {{ t("confirm_email.tagline") }}
            </p>
            <AlertBox
              v-if="state.error"
              type="danger"
              :title="t('confirm_email.title')"
              :description="state.error"
            />
            <AlertBox
              v-if="state.notice"
              type="info"
              :title="t('confirm_email.title')"
              :description="state.notice"
              icon="bi-envelope-check fs-4"
            />
            <AlertBox
              v-if="state.success"
              type="success"
              :title="t('confirm_email.title')"
              :description="state.success"
            />
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="confirmEmail" class="form-label">{{
                  t("confirm_email.email")
                }}</label>
                <input
                  v-model="form.email"
                  type="email"
                  :class="state.emailClass"
                  id="confirmEmail"
                  :readonly="isEmailLocked"
                  :aria-readonly="isEmailLocked"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="confirmCode" class="form-label">{{
                  t("confirm_email.code")
                }}</label>
                <input
                  v-model="form.code"
                  type="text"
                  class="form-control"
                  id="confirmCode"
                  required
                />
              </div>
              <button
                type="submit"
                class="btn btn-dark btn-full mb-3"
                :disabled="state.loading"
              >
                <span
                  v-if="state.loading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ t("confirm_email.cta") }}
              </button>
            </form>
            <div class="resend-box text-center mt-3 mb-3">
              <p class="text-muted small mb-2">
                {{ t("confirm_email.resend_prompt") }}
              </p>
              <button
                type="button"
                class="btn btn-outline-dark btn-full"
                :disabled="!canResend"
                @click="handleResend"
              >
                <span
                  v-if="state.resendLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>
                  {{
                    canResend
                      ? t("confirm_email.resend_button")
                      : t("confirm_email.resend_timer", {
                          seconds: cooldownSeconds,
                        })
                  }}
                </span>
              </button>
            </div>
            <RouterLink class="btn btn-light btn-full mb-2" to="/register">
              {{ t("register.register") }}
            </RouterLink>
            <RouterLink class="btn btn-outline-dark btn-full" to="/login">
              {{ t("confirm_email.login_cta") }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  reactive,
  watch,
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import AlertBox from "../components/AlertBox.vue";
import { authApi } from "../services/authApi";

const { t } = useI18n({ useScope: "global" });
const route = useRoute();
const REGISTRATION_NOTICE_KEY = "registration_success_notice";
const RESEND_COOLDOWN_MS = 60 * 1000;

const form = reactive({
  email: route.query.email ?? "",
  code: "",
});

const state = reactive({
  loading: false,
  error: "",
  success: "",
  notice: "",
  emailClass: "form-control",
  resendLoading: false,
  cooldownExpiresAt: null,
});

const isEmailLocked = computed(() => Boolean(route.query.email));
const now = ref(Date.now());
let tickerId = null;

const startTicker = () => {
  if (typeof window === "undefined" || tickerId) return;
  tickerId = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
};

const stopTicker = () => {
  if (!tickerId) return;
  window.clearInterval(tickerId);
  tickerId = null;
};

onMounted(() => {
  startTicker();
});

onBeforeUnmount(() => {
  stopTicker();
});

const applyRegistrationNotice = () => {
  if (typeof window === "undefined") {
    state.notice = "";
    state.emailClass = "form-control";
    return;
  }

  try {
    const raw = sessionStorage.getItem(REGISTRATION_NOTICE_KEY);
    if (!raw) {
      state.notice = "";
      state.emailClass = "form-control";
      return;
    }
    const record = JSON.parse(raw);
    const maxAge = 5 * 60 * 1000;
    const expired =
      !record?.createdAt || Date.now() - record.createdAt > maxAge;
    const emailMatches =
      record?.email && form.email && record.email === form.email;
    if (expired || !emailMatches) {
      sessionStorage.removeItem(REGISTRATION_NOTICE_KEY);
      state.notice = "";
      state.emailClass = "form-control";
      return;
    }
    state.notice = t("confirm_email.registration_notice");
    state.emailClass = "form-control-plaintext";
    sessionStorage.removeItem(REGISTRATION_NOTICE_KEY);
  } catch {
    state.notice = "";
    state.emailClass = "form-control";
  }
};

const cooldownSeconds = computed(() => {
  if (!state.cooldownExpiresAt) return 0;
  const remaining = Math.max(0, state.cooldownExpiresAt - now.value);
  return Math.ceil(remaining / 1000);
});

const canResend = computed(() => {
  return (
    Boolean(form.email) &&
    !state.resendLoading &&
    cooldownSeconds.value === 0
  );
});

const startCooldown = () => {
  state.cooldownExpiresAt = Date.now() + RESEND_COOLDOWN_MS;
};

watch(
  () => route.query.email,
  (value) => {
    form.email = value ?? "";
    applyRegistrationNotice();
  },
  { immediate: true }
);

const handleSubmit = async () => {
  state.loading = true;
  state.error = "";
  state.success = "";

  try {
    await authApi.confirmEmail({
      email: form.email,
      code: form.code,
    });
    state.success = t("confirm_email.success_message");
  } catch (error) {
    state.error = error.message || t("confirm_email.error_message");
  } finally {
    state.loading = false;
  }
};

watch(
  () => form.email,
  () => {
    if (!state.notice) {
      applyRegistrationNotice();
    }
  }
);

const handleResend = async () => {
  if (!form.email || !canResend.value) return;
  state.resendLoading = true;
  state.error = "";

  try {
    await authApi.resendConfirmation({
      email: form.email,
    });
    state.notice = t("confirm_email.resend_success");
    startCooldown();
  } catch (error) {
    state.error = error.message || t("confirm_email.error_message");
  } finally {
    state.resendLoading = false;
  }
};
</script>

<style scoped>
.view {
  min-height: 60vh;
}
</style>
