<template>
  <div class="login-container">
    <LoginComponent @login-success="isLoggedIn = true" />
    
    <!-- 팝업 메시지 -->
    <div v-if="isLoggedIn" class="popup-overlay">
      <div class="popup-box">
        <h2>환영합니다!</h2>
        <p>로그인이 성공적으로 완료되었습니다.</p>
        <button @click="closePopup">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import LoginComponent from '@/components/LoginComponent.vue';

export default {
  name: 'LoginView',
  components: {
    LoginComponent,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    closePopup() {
      this.isLoggedIn = false;  // 팝업 닫기
    }
  }
};
</script>

<style scoped>

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background-image: url('@/assets/8740981 2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 팝업 배경 스타일 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);  /* 뒷배경 어둡게 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 팝업 박스 스타일 */
.popup-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.popup-box h2 {
  font-size: 24px;
  color: #333;
}

.popup-box p {
  font-size: 16px;
  color: #555;
}

.popup-box button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup-box button:hover {
  background-color: #45a049;
}

@font-face {
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFB.OTF') format('opentype');
}

* {
  font-family: 'NanumSquareRound', sans-serif;
}
</style>
