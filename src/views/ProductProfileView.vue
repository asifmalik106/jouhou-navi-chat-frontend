<template>
  <section class="view">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <p class="text-muted mb-1">{{ t('product.profile.title') }}</p>
          <h1 class="mb-2">{{ product?.title || t('product.profile.untitled') }}</h1>
          <p class="text-muted mb-3">
            {{ t('product.profile.subtitle') }}
          </p>
          <RouterLink class="btn btn-outline-secondary me-2" :to="{ name: 'products' }">
            <i class="bi bi-arrow-left me-2"></i>
            {{ t('product.profile.back_to_list') }}
          </RouterLink>
          <RouterLink
            v-if="product?.id"
            class="btn btn-dark"
            :to="{ name: 'product-edit', params: { id: product.id } }"
          >
            <i class="bi bi-pencil me-2"></i>
            {{ t('product.profile.edit_cta') }}
          </RouterLink>
        </div>
        <span
          v-if="product"
          class="badge fs-6"
          :class="product.publish ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'"
        >
          {{ product.publish ? t('product.badges.published') : t('product.badges.draft') }}
        </span>
      </div>

      <AlertBox v-if="state.error" type="danger" :description="state.error" class="mb-3" />

      <div v-if="state.loading" class="text-center text-muted py-5">
        <span class="spinner-border" role="status" aria-hidden="true"></span>
      </div>

      <div v-else-if="product" class="row g-4">
        <div class="col-lg-5">
          <div class="card shadow-sm h-100">
            <div class="card-header">
              <h2 class="h5 mb-0">{{ t('product.profile.media') }}</h2>
            </div>
            <div class="card-body">
              <div class="ratio ratio-4x3 bg-light rounded overflow-hidden mb-3">
                <img
                  v-if="product.featuredImage"
                  :src="product.featuredImage"
                  class="w-100 h-100"
                  style="object-fit: cover;"
                  :alt="product.title"
                />
                <div
                  v-else
                  class="d-flex flex-column justify-content-center align-items-center text-muted"
                >
                  <i class="bi bi-image fs-2 mb-2"></i>
                  <span class="small">{{ t('product.profile.no_media') }}</span>
                </div>
              </div>
              <dl class="row mb-0">
                <dt class="col-5 text-muted small">{{ t('product.profile.created') }}</dt>
                <dd class="col-7">{{ formatDate(product.createdAt) }}</dd>
                <dt class="col-5 text-muted small">{{ t('product.profile.updated') }}</dt>
                <dd class="col-7">{{ formatDate(product.updatedAt) }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card shadow-sm">
            <div class="card-header">
              <h2 class="h5 mb-0">{{ t('product.profile.details') }}</h2>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <span class="text-uppercase text-muted small">{{ t('product.profile.category') }}</span>
                <p class="h6 mb-0">{{ product.category || '—' }}</p>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-md-4">
                  <span class="text-uppercase text-muted small">{{ t('product.profile.price') }}</span>
                  <p class="h6 mb-0">{{ formatPrice(product.price) }}</p>
                </div>
                <div class="col-md-4">
                  <span class="text-uppercase text-muted small">{{ t('product.profile.stock') }}</span>
                  <p class="h6 mb-0">{{ product.stock ?? '—' }}</p>
                </div>
                <div class="col-md-4">
                  <span class="text-uppercase text-muted small">{{ t('product.profile.publish') }}</span>
                  <p class="h6 mb-0">{{ product.publish ? t('product.boolean_yes') : t('product.boolean_no') }}</p>
                </div>
              </div>
              <div>
                <span class="text-uppercase text-muted small">{{ t('product.profile.description') }}</span>
                <p class="mb-0">{{ product.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AlertBox from '../components/AlertBox.vue';
import { productApi } from '../services/productApi';

const route = useRoute();
const { t, locale } = useI18n({ useScope: 'global' });

const product = ref(null);
const state = reactive({
  loading: false,
  error: '',
});

const loadProduct = async () => {
  const id = route.params.id;
  if (!id) {
    state.error = t('product.profile.missing_id');
    return;
  }

  state.loading = true;
  state.error = '';
  try {
    const data = await productApi.get(id);
    product.value = data;
  } catch (error) {
    state.error = error?.message || t('product.profile.load_error');
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

const formatPrice = (value) => {
  if (typeof value !== 'number') return '—';
  try {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: locale.value === 'ja' ? 'JPY' : 'USD',
      maximumFractionDigits: locale.value === 'ja' ? 0 : 2,
    }).format(value);
  } catch (_error) {
    return `$${value.toFixed(2)}`;
  }
};

onMounted(() => {
  loadProduct();
});
</script>
