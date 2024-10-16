<template>
  <div>
    <!-- Default Login Form -->
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
        <router-link to="/Reset_IDnPW">ID/PW 찾기</router-link>
      </div>
      <button v-on:click="login">로그인</button>
    </div>

    <!-- 선택 화면 -->
    <div v-else class="login-box">
      <div class="header">
        <h2>안녕하세요 {{ userName }}님, 무엇을 하시겠습니까?</h2>
      </div>
      <!-- Consumer 선택 옵션 -->
      <div v-if="role === 'consumer'">
        <button v-on:click="goToOrder">주문 바로가기</button>
        <button v-on:click="goToStoreInfo">마이페이지로 가기</button>
      </div>
      <!-- Business 선택 옵션 -->
      <div v-else-if="role === 'business'">
        <button v-on:click="goToMap">가게 등록</button>
        <button v-on:click="goToStoreInfo">스토어 관리</button>
        <button v-on:click="goToMyMenu">메뉴 관리</button>
      </div>
      <button v-on:click="logout">로그아웃</button> <!-- 로그아웃 버튼 -->
      <button v-on:click="deleteAccount" class="delete-button">탈퇴하기</button> <!-- 탈퇴 버튼 -->
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

export default {
  name: 'LoginComponent',
  data() {
    return {
      email: '',
      password: '',
      isLoggedIn: false,
      role: '',
      userName: '',
      loginExpirationTime: 10 * 60 * 1000, // 10분 (밀리초 단위)
    };
  },
  created() {
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    const currentTime = new Date().getTime();
    
    if (lastLoginTime && currentTime - lastLoginTime < this.loginExpirationTime) {
      this.autoLogin();
    } else {
      this.isLoggedIn = false;
      localStorage.removeItem('lastLoginTime');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
    }
  },
  methods: {
    login() {
      const authInstance = getAuth();
      signInWithEmailAndPassword(authInstance, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.checkUserRole(user.uid);
          localStorage.setItem('lastLoginTime', new Date().getTime());
        })
        .catch((error) => {
          console.error('로그인 오류:', error);
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        });
    },
    autoLogin() {
      const savedRole = localStorage.getItem('role');
      const savedUserName = localStorage.getItem('userName');
      if (savedRole) {
        this.isLoggedIn = true;
        this.role = savedRole;
        this.userName = savedUserName;
        if (savedRole === 'admin') {
          this.$router.push('/admin'); // Admin인 경우 바로 Admin 페이지로 이동
        }
      }
    },
    checkUserRole(uid) {
      const db = getDatabase();
      const userRef = ref(db, `users/${uid}/role`); 
      const userNameRef = ref(db, `users/${uid}/name`); 

      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.role = snapshot.val();
            this.isLoggedIn = true; 
            localStorage.setItem('role', this.role);
            localStorage.setItem('lastLoginTime', new Date().getTime());

            // Admin 역할일 경우 바로 Admin 페이지로 이동
            if (this.role === 'admin') {
              this.$router.push('/admin');
            }
          } else {
            alert('사용자의 역할 정보를 찾을 수 없습니다.');
          }
        })
        .catch((error) => {
          console.error('데이터베이스 오류:', error);
          alert('사용자 정보 확인 중 오류가 발생했습니다.');
        });

      get(userNameRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.userName = snapshot.val();
            localStorage.setItem('userName', this.userName);
          }
        });
    },
    goToOrder() {
      this.$router.push('/map'); // 주문 페이지로 이동
    },
    goToStoreInfo(){
      this.$router.push('/store_information');
    },
    goToMap(){
      this.$router.push('/business');
    },
    goToMyMenu(){
      this.$router.push('/business_menu');
    },
    logout() {
      const authInstance = getAuth();
      signOut(authInstance)
        .then(() => {
          this.isLoggedIn = false;
          this.role = '';
          this.userName = '';
          localStorage.removeItem('role');  
          localStorage.removeItem('userName');  
          localStorage.removeItem('lastLoginTime'); 
          this.$router.push('/');  // 로그인 페이지로 이동
        })
        .catch((error) => {
          console.error('로그아웃 오류:', error);
          alert('로그아웃에 실패했습니다.');
        });
    },
    deleteAccount() {
      const authInstance = getAuth();
      const user = authInstance.currentUser;

      if (user) {
        user.delete()
          .then(() => {
            alert('계정이 성공적으로 삭제되었습니다.');
            this.logout(); // 로그아웃 후 리디렉션
          })
          .catch((error) => {
            console.error('계정 삭제 오류:', error);
            alert('계정 삭제에 실패했습니다. 다시 시도해주세요.');
          });
      } else {
        alert('로그인된 사용자가 없습니다.');
      }
    }
  }
};
</script>

<style scoped>
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

.delete-button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background-color: #ff4d4d;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
}

.delete-button:hover {
  background-color: #e60000;
}

@font-face {
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFB.OTF') format('opentype');
}

* {
  font-family: 'NanumSquareRound', sans-serif;
}
</style>
