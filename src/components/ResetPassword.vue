<template>
    <div class="reset-password-container">
      <div class="header">
        <h2>비밀번호 재설정</h2>
      </div>
      <div class="reset-box">
        <label for="email">이메일</label>
        <input type="text" v-model="email" id="email" placeholder="이메일을 입력하세요"><br />
        <button v-on:click="sendResetEmail">비밀번호 재설정 링크 보내기</button>
      </div>
      <p v-if="message">{{ message }}</p>
      
      <!-- 홈으로 돌아가기 버튼 추가 -->
      <button v-if="message" v-on:click="goHome">홈으로 돌아가기</button>
    </div>
  </template>
  
  <script>
  import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
  
  export default {
    name: 'ResetPassword',
    data() {
      return {
        email: '',
        message: '' // 메시지 상태
      };
    },
    methods: {
      sendResetEmail() {
        const auth = getAuth();
        sendPasswordResetEmail(auth, this.email)
          .then(() => {
            this.message = '비밀번호 재설정 이메일이 전송되었습니다.';
          })
          .catch((error) => {
            this.message = '에러 발생: ' + error.message;
          });
      },
      goHome() {
        // 로그인 화면으로 이동
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  .reset-password-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  
  .header {
    margin-bottom: 20px;
  }
  
  .header h2 {
    font-size: 24px;
  }
  
  .reset-box {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    text-align: center;
  }
  
  label {
    display: block;
    margin-top: 10px;
  }
  
  input {
    margin: 10px 0;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  p {
    margin-top: 20px;
    color: green;
  }
  
  /* 홈으로 돌아가기 버튼 스타일 추가 */
  button {
    margin-top: 20px;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  