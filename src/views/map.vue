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
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFL.OTF') format('opentype');
}

.head {

  font-family: 'NanumSquareRound', sans-serif;
}
</style>
