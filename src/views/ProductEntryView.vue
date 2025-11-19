<template>
  <section class="view">
    <div class="container py-4">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 class="mb-1">{{ t('product.title') }}</h1>
          <p class="text-muted mb-0">{{ t('product.subtitle') }}</p>
        </div>
        <button
          type="button"
          class="btn btn-outline-dark"
          :disabled="listState.loading"
          @click="loadProducts"
        >
          <span
            v-if="listState.loading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ t('product.actions.refresh') }}
        </button>
      </div>

      <div class="row g-4">
        <div class="col-lg-5">
          <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h2 class="h5 mb-1">
                  {{
                    editingProductId
                      ? t('product.form.edit_title')
                      : t('product.form.create_title')
                  }}
                </h2>
                <p class="text-muted mb-0">{{ t('product.form.subtitle') }}</p>
              </div>
              <button
                v-if="editingProductId"
                type="button"
                class="btn btn-sm btn-light"
                @click="resetForm"
              >
                {{ t('product.actions.cancel_edit') }}
              </button>
            </div>
            <div class="card-body">
              <AlertBox
                v-if="formState.error"
                type="danger"
                :description="formState.error"
                class="mb-3"
              />
              <AlertBox
                v-if="formState.success"
                type="success"
                :description="formState.success"
                class="mb-3"
              />

              <form class="needs-validation" novalidate @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <div class="col-sm-12">
                    <label class="form-label">{{ t('product.form.fields.title') }}</label>
                    <input
                      v-model="form.title"
                      type="text"
                      class="form-control"
                      required
                      placeholder="Awesome gadget"
                    />
                  </div>
                  <div class="col-sm-12">
                    <label class="form-label">{{ t('product.form.fields.category') }}</label>
                    <input
                      v-model="form.category"
                      type="text"
                      class="form-control"
                      required
                      :placeholder="t('product.form.fields.category_placeholder')"
                    />
                  </div>
                  <div class="col-sm-12">
                    <label class="form-label">{{ t('product.form.fields.featured_image') }}</label>
                    <input
                      ref="imageInput"
                      type="file"
                      accept="image/*"
                      class="form-control"
                      @change="handleImageChange"
                    />
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label">{{ t('product.form.fields.stock') }}</label>
                    <input
                      v-model.number="form.stock"
                      type="number"
                      class="form-control"
                      min="0"
                      step="1"
                      required
                    />
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label">{{ t('product.form.fields.price') }}</label>
                    <input
                      v-model.number="form.price"
                      type="number"
                      class="form-control"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div class="col-12">
                    <label class="form-label">{{ t('product.form.fields.description') }}</label>
                    <textarea
                      v-model="form.description"
                      class="form-control"
                      rows="4"
                      placeholder="Describe the product..."
                      required
                    ></textarea>
                  </div>
                  <div class="col-12 form-check form-switch">
                    <input
                      id="publishSwitch"
                      v-model="form.publish"
                      class="form-check-input"
                      type="checkbox"
                    />
                    <label class="form-check-label" for="publishSwitch">
                      {{ t('product.form.fields.publish') }}
                    </label>
                  </div>
                </div>

                <div v-if="featuredImagePreview" class="mt-3">
                  <p class="text-muted small mb-2">{{ t('product.form.preview') }}</p>
                  <img
                    :src="featuredImagePreview"
                    :alt="form.title"
                    class="img-fluid rounded border"
                  />
                </div>

                <button type="submit" class="btn btn-dark w-100 mt-4" :disabled="formState.loading">
                  <span
                    v-if="formState.loading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{
                    editingProductId
                      ? t('product.actions.update')
                      : t('product.actions.create')
                  }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card shadow-sm">
            <div class="card-header">
              <h2 class="h5 mb-1">{{ t('product.list.title') }}</h2>
              <p class="text-muted mb-0">{{ t('product.list.subtitle') }}</p>
            </div>
            <div class="card-body">
              <AlertBox
                v-if="listState.error"
                type="danger"
                :description="listState.error"
                class="mb-3"
              />
              <div v-if="listState.loading" class="py-4 text-center text-muted">
                <span class="spinner-border" role="status" aria-hidden="true"></span>
              </div>
              <p v-else-if="!products.length" class="text-muted text-center py-4 mb-0">
                {{ t('product.list.empty') }}
              </p>
              <div v-else class="row row-cols-1 row-cols-md-2 g-3">
                <div v-for="product in products" :key="product.id || product.title" class="col">
                  <div class="card h-100 border-0 shadow-sm">
                    <div class="ratio ratio-4x3 bg-light rounded-top overflow-hidden">
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
                        <span class="small">{{ t('product.form.fields.featured_image') }}</span>
                      </div>
                    </div>
                    <div class="card-body d-flex flex-column gap-2">
                      <div class="d-flex justify-content-between align-items-center">
                        <h3 class="h6 mb-0">{{ product.title }}</h3>
                        <span
                          class="badge"
                          :class="product.publish ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'"
                        >
                          {{
                            product.publish
                              ? t('product.badges.published')
                              : t('product.badges.draft')
                          }}
                        </span>
                      </div>
                      <span class="badge bg-light text-dark text-uppercase">
                        {{ product.category }}
                      </span>
                      <p class="text-muted small mb-0">
                        {{ truncateText(product.description, 140) }}
                      </p>
                      <div class="d-flex justify-content-between fw-semibold small">
                        <span>{{
                          t('product.list.price', {
                            price: formatCurrency(product.price),
                          })
                        }}</span>
                        <span>{{ t('product.list.stock', { stock: product.stock }) }}</span>
                      </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 d-flex gap-2">
                      <button
                        type="button"
                        class="btn btn-outline-dark btn-sm w-50"
                        @click="handleEdit(product)"
                      >
                        {{ t('product.actions.edit') }}
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-danger btn-sm w-50"
                        @click="handleDelete(product)"
                      >
                        {{ t('product.actions.delete') }}
                      </button>
                    </div>
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
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AlertBox from '../components/AlertBox.vue';
import { productApi } from '../services/productApi';

const currencyMap = {
  en: 'USD',
  ja: 'JPY',
  bn: 'BDT',
};

const { t, locale } = useI18n({ useScope: 'global' });

const products = ref([]);
const editingProductId = ref(null);
const imageInput = ref(null);
const featuredImageFile = ref(null);
const featuredImagePreview = ref('');

const form = reactive({
  title: '',
  featuredImage: '',
  category: '',
  description: '',
  stock: 0,
  price: 0,
  publish: true,
});

const formState = reactive({
  loading: false,
  error: '',
  success: '',
});

const listState = reactive({
  loading: false,
  error: '',
});

const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}…` : text;
};

const formatCurrency = (value) => {
  const currency = currencyMap[locale.value] ?? 'USD';
  const formatter = new Intl.NumberFormat(locale.value ?? 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  });
  const numericValue = Number(value);
  return formatter.format(Number.isFinite(numericValue) ? numericValue : 0);
};

const resetForm = () => {
  form.title = '';
  form.featuredImage = '';
  if (imageInput.value) {
    imageInput.value.value = '';
  }
  featuredImageFile.value = null;
  updatePreview('');
  form.category = '';
  form.description = '';
  form.stock = 0;
  form.price = 0;
  form.publish = true;
  editingProductId.value = null;
  formState.error = '';
  formState.success = '';
};

const buildPayload = () => {
  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('category', form.category);
  formData.append('description', form.description);
  formData.append('stock', String(Number(form.stock) || 0));
  formData.append('price', String(Number(form.price) || 0));
  formData.append('publish', String(!!form.publish));

  if (featuredImageFile.value) {
    formData.append('featuredImage', featuredImageFile.value);
  } else if (form.featuredImage) {
    formData.append('featuredImage', form.featuredImage);
  }

  return formData;
};

const loadProducts = async () => {
  listState.loading = true;
  listState.error = '';
  try {
    const data = await productApi.list();
    products.value = Array.isArray(data) ? data : [];
  } catch (error) {
    listState.error = error?.message || t('product.messages.fetch_error');
  } finally {
    listState.loading = false;
  }
};

const handleSubmit = async () => {
  formState.loading = true;
  formState.error = '';
  formState.success = '';

  const payload = buildPayload();

  try {
    if (editingProductId.value) {
      await productApi.update(editingProductId.value, payload);
      formState.success = t('product.messages.updated');
    } else {
      await productApi.create(payload);
      formState.success = t('product.messages.created');
    }
    resetForm();
    await loadProducts();
  } catch (error) {
    formState.error = error?.message || t('product.messages.save_error');
  } finally {
    formState.loading = false;
  }
};

const handleEdit = (product) => {
  editingProductId.value = product.id;
  form.title = product.title ?? '';
  form.featuredImage = product.featuredImage ?? '';
  if (imageInput.value) {
    imageInput.value.value = '';
  }
  featuredImageFile.value = null;
  updatePreview(form.featuredImage);
  form.category = product.category ?? '';
  form.description = product.description ?? '';
  form.stock = product.stock ?? 0;
  form.price = product.price ?? 0;
  form.publish = Boolean(product.publish);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleDelete = async (product) => {
  const confirmDelete = window.confirm(
    t('product.messages.confirm_delete', { title: product.title }),
  );
  if (!confirmDelete) return;

  try {
    await productApi.remove(product.id);
    await loadProducts();
  } catch (error) {
    listState.error = error?.message || t('product.messages.delete_error');
  }
};

const handleImageChange = async (event) => {
  const file = event.target?.files?.[0];
  if (!file) {
    form.featuredImage = '';
    featuredImageFile.value = null;
    updatePreview('');
    return;
  }

  try {
    featuredImageFile.value = file;
    form.featuredImage = '';
    updatePreview(URL.createObjectURL(file));
  } catch (error) {
    formState.error = error?.message || t('product.messages.image_error');
    form.featuredImage = '';
    featuredImageFile.value = null;
    if (imageInput.value) {
      imageInput.value.value = '';
    }
    updatePreview('');
  }
};

function updatePreview(src) {
  if (
    featuredImagePreview.value &&
    featuredImagePreview.value.startsWith('blob:') &&
    typeof URL !== 'undefined'
  ) {
    URL.revokeObjectURL(featuredImagePreview.value);
  }
  featuredImagePreview.value = src || '';
}

onMounted(() => {
  loadProducts();
});
</script>
