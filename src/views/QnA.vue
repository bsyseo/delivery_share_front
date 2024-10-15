<template>
    <div>
      <h1>Q&A Page</h1>
      <!-- QnA 컴포넌트를 실제로 사용하도록 추가 -->
      <QnA_Component />
    </div>
  </template>
  
  <script>
  import QnA_Component from './QnA_Component.vue'; // 컴포넌트 import
  
  export default {
    name: 'QnA',
    components: {
      QnA_Component // 컴포넌트 등록
    }
  }
  </script>
  
  <style scoped>
  /* 스타일 정의 */
  </style>
  