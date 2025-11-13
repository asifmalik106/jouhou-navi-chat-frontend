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
                <label class="form-label">
                  {{ t("confirm_email.code") }}
                </label>
                <div class="otp-group">
                  <input
                    v-for="(_, index) in CODE_LENGTH"
                    :key="`otp-${index}`"
                    ref="otpInputRefs"
                    type="text"
                    inputmode="numeric"
                    maxlength="1"
                    autocomplete="one-time-code"
                    class="form-control otp-input"
                    :value="codeDigits[index]"
                    @input="(e) => handleDigitInput(index, e)"
                    @keydown="(e) => handleDigitKeydown(index, e)"
                    @paste="(e) => handlePaste(e)"
                  />
                </div>
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
  onBeforeUpdate,
} from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import AlertBox from "../components/AlertBox.vue";
import { authApi } from "../services/authApi";

const { t } = useI18n({ useScope: "global" });
const route = useRoute();
const REGISTRATION_NOTICE_KEY = "registration_success_notice";
const CODE_LENGTH = 6;
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
const otpInputRefs = ref([]);
const codeDigits = ref(Array(CODE_LENGTH).fill(""));

const resetCodeDigits = () => {
  codeDigits.value = Array(CODE_LENGTH).fill("");
  form.code = "";
  otpInputRefs.value.forEach((input) => {
    if (input) input.value = "";
  });
};

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

onBeforeUpdate(() => {
  otpInputRefs.value = [];
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
    resetCodeDigits();
    applyRegistrationNotice();
  },
  { immediate: true }
);

const handleSubmit = async () => {
  state.loading = true;
  state.error = "";
  state.success = "";
  form.code = codeDigits.value.join("");

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

const focusInput = (index) => {
  const target = otpInputRefs.value[index];
  if (target) {
    target.focus();
    target.select();
  }
};

const handleDigitInput = (index, event) => {
  const { value } = event.target;
  const digit = value.replace(/\D/g, "").slice(-1) || "";
  codeDigits.value[index] = digit;
  event.target.value = digit;
  form.code = codeDigits.value.join("");

  if (digit && index < CODE_LENGTH - 1) {
    focusInput(index + 1);
  }
};

const handleDigitKeydown = (index, event) => {
  if (event.key === "Backspace") {
    event.preventDefault();
    if (codeDigits.value[index]) {
      codeDigits.value[index] = "";
      form.code = codeDigits.value.join("");
      const input = otpInputRefs.value[index];
      if (input) input.value = "";
    } else if (index > 0) {
      focusInput(index - 1);
    }
    return;
  }

  if (event.key === "ArrowLeft" && index > 0) {
    event.preventDefault();
    focusInput(index - 1);
  } else if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
    event.preventDefault();
    focusInput(index + 1);
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
  if (!text) return;

  text.split("").forEach((char, idx) => {
    codeDigits.value[idx] = char;
    const input = otpInputRefs.value[idx];
    if (input) {
      input.value = char;
    }
  });

  form.code = codeDigits.value.join("");
  const nextIndex = Math.min(text.length, CODE_LENGTH - 1);
  focusInput(nextIndex);
};
</script>

<style scoped>
.view {
  min-height: 60vh;
}

.otp-group {
  display: grid;
  grid-template-columns: repeat(6, minmax(48px, 1fr));
  gap: 0.75rem;
}

.otp-input {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.otp-input::-webkit-outer-spin-button,
.otp-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.otp-input[type="number"] {
  -moz-appearance: textfield;
}
</style>
