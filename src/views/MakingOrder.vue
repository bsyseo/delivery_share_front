<!-- src/views/MakingOrder.vue -->
<template>
    <div class="making-order-container">
      <h1>주문 예약 만들기</h1>
      <MakingOrderComponent />
    </div>
  </template>
  
  <script>
  import MakingOrderComponent from '@/components/MakingOrderComponent.vue';
  
  export default {
    name: 'MakingOrder',
    components: {
      MakingOrderComponent
    }
  };
  </script>
  
  <style scoped>
  .making-order-container {
    padding: 20px;
    text-align: center;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  </style>
  