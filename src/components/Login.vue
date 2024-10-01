<template>
  <div class="login-container">
    <div v-if="!isLoggedIn" class="login-box">
      <div class="header">
        <h2>DELIVERY SHARE</h2>
      </div>
      <label for="email">ID</label>
      <input type="text" v-model="email" id="email" placeholder="Email"><br />
      <label for="password">PW</label>
      <input type="password" v-model="password" id="password" placeholder="PW"><br />
      <div class="actions">
        <router-link to="/signup">회원가입</router-link>
        <router-link to="/find-id-pw">ID/PW 찾기</router-link>
      </div>
      <button v-on:click="login">로그인</button>
    </div>
    <div v-else class="welcome-message">
      <h2>환영합니다!</h2>
      <p>로그인이 성공적으로 완료되었습니다.</p>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default {
  name: 'LoginComponent',
  data() {
    return {
      email: '',
      password: '',
      isLoggedIn: false // 로그인 성공 여부 상태
    }
  },
  methods: {
  login() {
    const authInstance = getAuth();
    signInWithEmailAndPassword(authInstance, this.email, this.password)
      .then(() => { // Removed userCredential since it's not used
        // 로그인 성공 시 isLoggedIn 상태 업데이트
        this.isLoggedIn = true;
        alert('로그인이 성공적으로 완료되었습니다!');
        // 로그인 성공 후 map 페이지로 리다이렉트
        this.$router.push('/map');
      })
      .catch((error) => {
        console.error('로그인 오류:', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      });
  }
}
}
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
  height: 100vh; /* 뷰포트 전체 높이 설정 */
  width: 100vw; /* 뷰포트 전체 너비 설정 */
  margin: 0;
  padding: 0;
  background-image: url('@/assets/8740981 2.png'); /* Upload된 이미지의 경로로 수정 */
  background-size: cover; /* 배경 이미지를 전체 화면에 맞춤 */
  background-position: center; /* 배경을 가운데 정렬 */
  background-repeat: no-repeat; /* 배경이 반복되지 않도록 설정 */
}

.header {
  margin-bottom: 50px;
}

.header h2 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 24px; /* 폰트 크기를 조정 */
  color: #444;
  text-align: center;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.9); /* Slight transparency */
  padding: 20px;
  border-radius: 20px; /* 더 둥글게 테두리 조정 */
  width: 350px; /* 박스 크기를 더 크게 조정 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 강조 */
  margin-top: 30px; /* 위쪽으로 조금 더 이동 */
}

label {
  display: block;
  margin-top: 15px;
  font-weight: bold;
}

input {
  margin: 10px 0;
  width: 85%;
  padding: 12px;
  border-radius: 10px; /* 입력 필드 테두리 둥글게 */
  border: 1px solid #ccc;
}

button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background-color: #c7e5a8;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #b3d999;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.actions a {
  font-size: 14px;
  color: #444;
  text-decoration: none;
}

.welcome-message {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-message h2 {
  font-size: 24px;
  color: #333;
}

.welcome-message p {
  font-size: 16px;
  color: #555;
}
</style>
