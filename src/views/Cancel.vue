<!-- Cancel.vue -->
<template>
    <div class="result-page cancel">
      <h1>결제 취소</h1>
      <p>결제가 취소되었습니다. 다시 시도하거나 필요한 경우 고객 지원에 문의하세요.</p>
      <button @click="$router.push('/')">홈으로 이동</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Cancel-component'
  };
  </script>
  
  <style scoped>
  .result-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    background-color: #f0f8f4;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-top: 50px;
  }
  
  .result-page.cancel {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  
  p {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  button {
    background-color: #dc3545;
    color: #fff;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #c82333;
  }
  </style>
  