<template>
  <div class="card">
    <div class="card-head">
      <h2>{{ title }}</h2>
      <div v-if="image" class="icon">
        <img :src="imageSrc" alt="icon" />
      </div>
    </div>
    <div class="card-body">
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Total Tickets',
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
    required: true,
  },
})

const imageSrc = computed(() => {
  if (!props.image) return ''

  // Import the images directly
  const images = {
    'ticket.svg': new URL('../assets/ticket.svg', import.meta.url).href,
    'open.svg': new URL('../assets/open.svg', import.meta.url).href,
    'tick.svg': new URL('../assets/tick.svg', import.meta.url).href,
  }

  return images[props.image] || ''
})
</script>

<style scoped>
.card {
  border-radius: 10px;
  max-width: 20rem;
  width: 100%;
  box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.5);
  padding: 0.4rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

h2 {
  font-size: 1.3rem;
  font-weight: 500;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-body p {
  font-size: 40px;
  font-weight: 500;
}
img {
  width: 1.5rem;
}
</style>
