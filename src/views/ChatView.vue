<template>
  <section class="view chat-view">
    <div class="container">
      <div class="chat-card">
        <header class="chat-header">
          <div>
            <p class="eyebrow">{{ t('chat.title') }}</p>
            <h2>{{ t('chat.subtitle') }}</h2>
          </div>
        </header>

        <AlertBox
          v-if="state.error"
          type="danger"
          :description="state.error"
          icon="bi-exclamation-triangle"
        />

        <form class="chat-form" @submit.prevent="handleSubmit">
          <label class="form-label" for="chatQuery">{{ t('chat.query_label') }}</label>
          <textarea
            id="chatQuery"
            v-model="form.query"
            class="form-control"
            rows="3"
            :placeholder="t('chat.query_placeholder')"
            required
          ></textarea>
          <div class="submit-field">
            <button class="btn btn-dark btn-full" type="submit" :disabled="state.loading || !canSubmit">
              <span
                v-if="state.loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {{ t('chat.cta') }}
            </button>
          </div>
        </form>

        <section class="chat-results">
          <div v-if="state.threads.length === 0" class="empty-state">
            <i class="bi bi-chat-dots"></i>
            <h3>{{ t('chat.empty_state_title') }}</h3>
            <p>{{ t('chat.empty_state_body') }}</p>
          </div>
          <div v-else class="thread-list">
            <article v-for="thread in state.threads" :key="thread.id" class="thread-item">
              <header class="thread-header">
                <div>
                  <p class="thread-query">{{ thread.query }}</p>
                  <span class="thread-timestamp">{{ formatDate(thread.timestamp) }}</span>
                </div>
              </header>
              <section class="assistant-reply">
                <p class="reply-label">{{ t('chat.assistant_reply') }}</p>
                <p class="reply-body">{{ thread.reply }}</p>
              </section>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AlertBox from '../components/AlertBox.vue';
import { authApi } from '../services/authApi';

const { t, locale } = useI18n({ useScope: 'global' });

const form = reactive({
  query: '',
});

const state = reactive({
  loading: false,
  error: '',
  threads: [],
});

const canSubmit = computed(() => form.query.trim().length > 0 && !state.loading);

const handleSubmit = async () => {
  const trimmed = form.query.trim();
  if (!trimmed) {
    state.error = t('chat.error_message');
    return;
  }

  state.loading = true;
  state.error = '';

  try {
    const data = await authApi.chat({ query: trimmed });
    const thread = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      query: data.query ?? trimmed,
      reply: data.reply ?? '',
      timestamp: new Date(),
    };

    state.threads.unshift(thread);
    form.query = '';
  } catch (error) {
    state.error = error.message || t('chat.error_message');
  } finally {
    state.loading = false;
  }
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  try {
    return new Intl.DateTimeFormat(locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (_error) {
    return date.toISOString();
  }
};
</script>

<style scoped>
.chat-view {
  min-height: 70vh;
}

.chat-card {
  background: #fff;
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.12);
  max-width: 960px;
  margin: 0 auto;
}

.chat-header {
  margin-bottom: 1.5rem;
}

.chat-header .eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.chat-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.chat-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.submit-field {
  margin-top: 0.5rem;
}

.help-text {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #64748b;
}

.chat-results {
  margin-top: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  border: 1px dashed #d1d5db;
  border-radius: 1rem;
  color: #475467;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.thread-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.thread-item {
  border: 1px solid #edf2f7;
  border-radius: 1rem;
  padding: 1.25rem;
  background: #fdfdfd;
}

.thread-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.thread-query {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.thread-timestamp {
  font-size: 0.85rem;
  color: #64748b;
}

.assistant-reply {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  background: #fff;
  margin-bottom: 1rem;
}

.reply-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 0.35rem;
}

.reply-body {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #1f2937;
}

@media (max-width: 768px) {
  .chat-card {
    padding: 1.5rem;
  }

  .form-row {
    flex-direction: column;
  }

  .submit-field {
    width: 100%;
  }
}
</style>
