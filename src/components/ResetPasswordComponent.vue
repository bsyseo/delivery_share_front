<template>
  <div class="reset-password-container">
    <div class="header">
      <h2>비밀번호 재설정</h2>
    </div>
    <div class="reset-box">
      <label for="email">이메일</label>
      <input type="text" v-model="email" id="email" placeholder="이메일을 입력하세요" /><br />
      <button @click="sendResetEmail">비밀번호 재설정 링크 보내기</button>
      <p v-if="message">{{ message }}</p>
      
      <!-- 홈으로 돌아가기 버튼 추가 -->
      <button v-if="message" @click="goHome">홈으로 돌아가기</button>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default {
  name: 'ResetPasswordComponent',
  data() {
    return {
      email: '',
      message: ''
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
  background-color: #f2f2f2;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.header h2 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: #444;
}

.reset-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  font-size: 12px;
  margin-top: 10px;
}

input {
  margin: 4px 0;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 12px;
}

button {
  margin-top: 15px;
  width: 100%;
  padding: 8px;
  background-color: #c7e5a8;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #b3d999;
}

p {
  margin-top: 15px;
  font-size: 12px;
  color: green;
}
</style>
