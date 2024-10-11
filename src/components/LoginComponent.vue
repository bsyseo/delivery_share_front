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
import { getDatabase, ref, get } from 'firebase/database';

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
        .then((userCredential) => {
          const user = userCredential.user;
          // Firebase Realtime Database에서 해당 유저의 role을 확인
          this.checkUserRole(user.uid);
        })
        .catch((error) => {
          console.error('로그인 오류:', error);
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        });
    },
    checkUserRole(uid) {
      const db = getDatabase();
      const userRef = ref(db, `users/${uid}/role`); // uid에 해당하는 사용자의 role을 가져옴
      
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const role = snapshot.val();
            this.routeByRole(role);
          } else {
            alert('사용자의 역할 정보를 찾을 수 없습니다.');
          }
        })
        .catch((error) => {
          console.error('데이터베이스 오류:', error);
          alert('사용자 정보 확인 중 오류가 발생했습니다.');
        });
    },
    routeByRole(role) {
      // role 값에 따라 라우팅
      if (role === 'consumer') {
        this.$router.push('/map');
      } else if (role === 'business') {
        this.$router.push('/business');
      } else if (role === 'admin') {
        this.$router.push('/admin');
      } else {
        alert('알 수 없는 역할입니다.');
      }
    }
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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
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
