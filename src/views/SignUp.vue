<template>
  <div class="login-container">
    <SignUpComponent />
    <div v-if="isSignedUp" class="welcome-message">
      <h2>회원가입 완료!</h2>
      <p>가입이 성공적으로 완료되었습니다.</p>
    </div>
  </div>
</template>

<script>
import SignUpComponent from '@/components/SignUpComponent.vue';

export default {
  name: 'SignUpView',
  components: {
    SignUpComponent
  },
  data() {
    return {
      isSignedUp: false
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('@/assets/8740981%202.png');
  background-size: cover;
  background-position: center;
}

.welcome-message {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  width: 250px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-message h2 {
  font-size: 20px;
  color: #333;
}

.welcome-message p {
  font-size: 12px;
  color: #555;
}
</style>
