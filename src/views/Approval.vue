<!-- Approval.vue -->
<template>
    <div class="result-page success">
      <h1>결제 성공</h1>
      <p>결제가 성공적으로 완료되었습니다!</p>
      <p>주문 내역을 확인하려면 마이페이지로 이동하세요.</p>
      <button @click="$router.push('/mypage')">마이페이지로 이동</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Approval-component',
    created() {
      // 결제 성공 시 서버와 연동하여 결제 승인 처리
      this.confirmPayment();
    },
    methods: {
      async confirmPayment() {
        try {
          // 백엔드에서 결제 승인 처리를 위한 API 호출 (백엔드 서버 필요)
          const response = await fetch('/api/kakao/approve', {
            method: 'POST',
            body: JSON.stringify({ pg_token: this.$route.query.pg_token }),
            headers: { 'Content-Type': 'application/json' }
          });
  
          if (!response.ok) throw new Error('결제 승인 오류');
          console.log('결제 승인 성공');
        } catch (error) {
          console.error(error);
        }
      }
    }
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
  
  .result-page.success {
    background-color: #d4edda;
    color: #155724;
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
    background-color: #28a745;
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
    background-color: #218838;
  }
  </style>
  