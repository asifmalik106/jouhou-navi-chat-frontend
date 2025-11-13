<template>
  <div :class="['alert', `alert-${typeClass}`]" role="alert">
    <span v-if="iconToUse" class="alert-icon">
      <i :class="['bi', iconToUse]"></i>
    </span>
    <div class="alert-text">
      <p v-if="title" class="alert-heading">{{ title }}</p>
      <p v-if="description" class="alert-body">{{ description }}</p>
      <ul v-if="items?.length">
        <li v-for="(item, index) in items" :key="`${item}-${index}`">{{ item }}</li>
      </ul>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
  },
  icon: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
});

const typeClass = computed(() => {
  const allowed = ['danger', 'success', 'info', 'warning'];
  return allowed.includes(props.type) ? props.type : 'info';
});

const iconToUse = computed(() => {
  if (props.icon) return props.icon;
  const map = {
    danger: 'bi-x-lg',
    success: 'bi-check-lg',
    info: 'bi-info-lg',
    warning: 'bi-exclamation-lg',
  };
  return map[typeClass.value];
});
</script>
