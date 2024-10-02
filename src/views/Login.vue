<template>
  <div class="login-container">
    <LoginComponent @login-success="isLoggedIn = true" />
    <div v-if="isLoggedIn" class="welcome-message">
      <h2>환영합니다!</h2>
      <p>로그인이 성공적으로 완료되었습니다.</p>
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
