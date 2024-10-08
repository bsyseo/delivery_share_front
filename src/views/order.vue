<template>
  <div>
    <!-- OrderComponent에 markerName을 전달 -->
    <OrderComponent :markerName="markerName" />
  </div>
</template>

<script>
import OrderComponent from '@/components/OrderComponent.vue';

export default {
  name: 'OrderView', // 이름을 다중 단어로 변경
  components: {
    OrderComponent
  },
  data() {
    return {
      markerName: this.$route.params.markerName || '' // route 파라미터로 전달된 마커 이름
    };
  },
  watch: {
    '$route.params.markerName': {
      handler(newName) {
        console.log('Received markerName:', newName); // 마커 이름을 콘솔에 출력하여 확인
        this.markerName = newName; // markerName 업데이트
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
/* 폰트 적용 */
@font-face {
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFB.OTF') format('opentype');
}

* {
  font-family: 'NanumSquareRound', sans-serif;
}

</style>
