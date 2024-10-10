<!-- src/components/MakingOrderComponent.vue -->
<template>
    <div class="making-order-form">
      <form @submit.prevent="submitOrder">
        <div class="form-group">
          <label for="order-details">주문 세부 정보</label>
          <textarea id="order-details" v-model="orderDetails" placeholder="주문할 내용을 입력하세요" required></textarea>
        </div>
        <div class="form-group">
          <label for="pickup-time">픽업 시간</label>
          <input type="datetime-local" id="pickup-time" v-model="pickupTime" required />
        </div>
        <button type="submit" class="submit-button">예약하기</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MakingOrderComponent',
    data() {
      return {
        orderDetails: '',
        pickupTime: ''
      };
    },
    methods: {
      submitOrder() {
        console.log('주문 세부 정보:', this.orderDetails);
        console.log('픽업 시간:', this.pickupTime);
        alert('주문 예약이 완료되었습니다.');
        // 이후 필요한 처리 로직 추가
      }
    }
  };
  </script>
  
  <style scoped>
  .making-order-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  textarea, input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .submit-button {
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: #4caf50;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  </style>
  