<template>
    <div class="login-box">
      <div class="header">
        <h2>DELIVERY SHARE</h2>
      </div>
      <label for="email">ID</label>
      <input type="text" v-model="email" id="email" placeholder="Email"><br />
      <label for="password">PW</label>
      <input type="password" v-model="password" id="password" placeholder="PW"><br />
      <div class="actions">
        <router-link to="/signup">회원가입</router-link>
        <router-link to="/Reset_IDnPW">ID/PW 찾기</router-link>
      </div>
      <button v-on:click="login">로그인</button>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  
  export default {
    name: 'LoginComponent',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      login() {
        const authInstance = getAuth();
        signInWithEmailAndPassword(authInstance, this.email, this.password)
          .then(() => {
            // 로그인 성공 시 처리
            this.$emit('login-success');
            alert('로그인이 성공적으로 완료되었습니다!');
            this.$router.push('/map');
          })
          .catch((error) => {
            console.error('로그인 오류:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
          });
      },
    },
  };
  </script>
  
  <style scoped>
  /* 이전에 작성된 스타일 유지 */
  .login-box {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 20px;
    width: 350px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    margin-top: 30px;
  }
  
  .header {
    margin-bottom: 50px;
  }
  
  .header h2 {
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    font-size: 24px;
    color: #444;
    text-align: center;
  }
  
  label {
    display: block;
    margin-top: 15px;
    font-weight: bold;
    text-align: left;
    margin-left: 20px;
  }
  
  input {
    margin: 10px 0;
    width: 85%;
    padding: 12px;
    border-radius: 10px;
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
  </style>
  