<template>
  <section class="view">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <p class="text-muted mb-1">{{ t('product.edit.title') }}</p>
          <h1 class="mb-2">{{ form.title || t('product.profile.untitled') }}</h1>
          <p class="text-muted mb-0">{{ t('product.edit.subtitle') }}</p>
        </div>
        <div class="d-flex gap-2">
          <RouterLink class="btn btn-outline-secondary" :to="{ name: 'product-profile', params: { id: route.params.id } }">
            <i class="bi bi-arrow-left me-2"></i>
            {{ t('product.edit.back_to_profile') }}
          </RouterLink>
          <RouterLink class="btn btn-outline-dark" :to="{ name: 'products' }">
            {{ t('product.profile.back_to_list') }}
          </RouterLink>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card shadow-sm">
            <div class="card-header">
              <h2 class="h5 mb-0">{{ t('product.form.edit_title') }}</h2>
            </div>
            <div class="card-body">
              <AlertBox v-if="state.error" type="danger" :description="state.error" class="mb-3" />
              <AlertBox v-if="state.success" type="success" :description="state.success" class="mb-3" />

              <form class="row g-3" @submit.prevent="handleSubmit">
                <div class="col-12">
                  <label class="form-label">{{ t('product.form.fields.title') }}</label>
                  <input v-model="form.title" type="text" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label">{{ t('product.form.fields.category') }}</label>
                  <input v-model="form.category" type="text" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label">{{ t('product.form.fields.description') }}</label>
                  <textarea v-model="form.description" class="form-control" rows="4" required></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label">{{ t('product.form.fields.stock') }}</label>
                  <input v-model.number="form.stock" type="number" min="0" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">{{ t('product.form.fields.price') }}</label>
                  <input v-model.number="form.price" type="number" min="0" step="0.01" class="form-control" />
                </div>
                <div class="col-12 form-check form-switch">
                  <input id="publishSwitchEdit" v-model="form.publish" class="form-check-input" type="checkbox" />
                  <label class="form-check-label" for="publishSwitchEdit">
                    {{ t('product.form.fields.publish') }}
                  </label>
                </div>
                <div class="col-12">
                  <label class="form-label">{{ t('product.form.fields.featured_image') }}</label>
                  <input ref="imageInput" type="file" class="form-control" accept="image/*" @change="handleImageChange" />
                </div>
                <div class="col-12">
                  <button class="btn btn-dark w-100" type="submit" :disabled="state.loading">
                    <span
                      v-if="state.loading"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {{ t('product.edit.save_cta') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-header">
              <h2 class="h5 mb-0">{{ t('product.form.preview') }}</h2>
            </div>
            <div class="card-body">
              <div class="ratio ratio-4x3 bg-light rounded overflow-hidden mb-3">
                <img
                  v-if="featuredImagePreview"
                  :src="featuredImagePreview"
                  class="w-100 h-100"
                  style="object-fit: cover;"
                  :alt="form.title"
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
                <dt class="col-4 text-muted small">{{ t('product.profile.created') }}</dt>
                <dd class="col-8">{{ formatDate(form.createdAt) }}</dd>
                <dt class="col-4 text-muted small">{{ t('product.profile.updated') }}</dt>
                <dd class="col-8">{{ formatDate(form.updatedAt) }}</dd>
              </dl>
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

const form = reactive({
  title: '',
  category: '',
  description: '',
  stock: 0,
  price: 0,
  publish: true,
  featuredImage: '',
  createdAt: '',
  updatedAt: '',
});

const state = reactive({
  loading: false,
  error: '',
  success: '',
});

const imageInput = ref(null);
const featuredImageFile = ref(null);
const featuredImagePreview = ref('');

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
    form.title = data.title ?? '';
    form.category = data.category ?? '';
    form.description = data.description ?? '';
    form.stock = data.stock ?? 0;
    form.price = data.price ?? 0;
    form.publish = Boolean(data.publish);
    form.featuredImage = data.featuredImage ?? '';
    form.createdAt = data.createdAt ?? '';
    form.updatedAt = data.updatedAt ?? '';
    updatePreview(form.featuredImage);
  } catch (error) {
    state.error = error?.message || t('product.profile.load_error');
  } finally {
    state.loading = false;
  }
};

const updatePreview = (src) => {
  if (featuredImagePreview.value && featuredImagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(featuredImagePreview.value);
  }
  featuredImagePreview.value = src || '';
};

const handleImageChange = (event) => {
  const file = event.target?.files?.[0];
  if (!file) {
    featuredImageFile.value = null;
    updatePreview(form.featuredImage);
    return;
  }
  featuredImageFile.value = file;
  updatePreview(URL.createObjectURL(file));
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

const buildPayload = () => {
  const formData = new FormData();
  if (form.title) formData.append('title', form.title);
  if (form.category) formData.append('category', form.category);
  if (form.description) formData.append('description', form.description);
  formData.append('stock', String(Number(form.stock) || 0));
  formData.append('price', String(Number(form.price) || 0));
  formData.append('publish', String(!!form.publish));

  if (featuredImageFile.value) {
    formData.append('featuredImage', featuredImageFile.value);
  }

  return formData;
};

const handleSubmit = async () => {
  const id = route.params.id;
  if (!id) return;
  state.loading = true;
  state.error = '';
  state.success = '';

  try {
    const payload = buildPayload();
    const updated = await productApi.update(id, payload);
    form.updatedAt = updated.updatedAt ?? new Date().toISOString();
    form.featuredImage = updated.featuredImage ?? form.featuredImage;
    updatePreview(form.featuredImage);
    state.success = t('product.messages.updated');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    state.error = error?.message || t('product.messages.save_error');
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  loadProduct();
});
</script>
