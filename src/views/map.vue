<template>
  <div class="head">
    <MapComponent />
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent.vue';

export default {
  name: 'MapView',
  components: {
    MapComponent,
  },
};
</script>

<style scoped>
  @font-face {
    font-family: 'IBMPlexSansKR';
    src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
  }
  
  * {
    font-family: 'IBMPlexSansKR', sans-serif;
  }
</style>
