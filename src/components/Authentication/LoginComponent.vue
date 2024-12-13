<template>
  <div>
    <!-- 로그인 폼 -->
    <div v-if="!isLoggedIn" class="login-box">
      <div class="header">
        <h2>DELIVERY SHARE</h2>
      </div>
      <label for="email">ID</label>
      <input type="text" v-model="email" id="email" placeholder="Email" /><br />
      <label for="password">PW</label>
      <input type="password" v-model="password" id="password" placeholder="PW" /><br />
      <div class="actions">
        <router-link to="/signup">회원가입</router-link>
        <router-link to="/Reset_IDnPW">ID/PW 찾기</router-link>
      </div>
      <button v-on:click="login" class="login-button">로그인</button>
    </div>

    <!-- 선택 화면 -->
    <div v-else class="login-box">
      <div class="header">
        <h2>안녕하세요 {{ userName }}님, 무엇을 하시겠습니까?</h2>
      </div>
      <!-- Consumer 선택 옵션 -->
      <div v-if="role === 'consumer'">
        <button v-on:click="goToOrder" class="action-button">주문 바로가기</button>
        <button v-on:click="goToMypage" class="action-button">마이페이지로 가기</button>
      </div>
      <!-- Business 선택 옵션 -->
      <div v-else-if="role === 'business'">
        <button v-on:click="goToMap" class="action-button">가게 등록</button>
        <button v-on:click="goToStoreInfo" class="action-button">스토어 관리</button>
        <button v-on:click="goToBusinessInfo" class="action-button">사업자 정보 등록</button>
      </div>
      <button v-on:click="logout" class="logout-button">로그아웃</button>
      <button v-on:click="deleteAccount" class="delete-button">탈퇴하기</button>
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
      loginExpirationTime: 20 * 60 * 1000, // 20분 (밀리초 단위)
    };
  },
  created() {
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    const currentTime = new Date().getTime();
    
    // lastLoginTime이 있고 현재 시간과 비교하여 20분 내이면 자동 로그인
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
      if (!this.email || !this.password) {
        alert('모든 필드를 입력해주세요.');
        return;
      }

      const authInstance = getAuth();
      signInWithEmailAndPassword(authInstance, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.checkUserRole(user.uid);
          localStorage.setItem('lastLoginTime', new Date().getTime()); // 로그인 시각 저장
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
            localStorage.setItem('lastLoginTime', new Date().getTime()); // 로그인 시각 업데이트

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
    goToMypage(){
      this.$router.push('/UserMypage')
    },
    goToOrder() {
      this.$router.push('/order'); // 주문 페이지로 이동
    },
    goToStoreInfo(){
      this.$router.push('/store_information');
    },
    goToMap(){
      this.$router.push('/business');
    },
    goToBusinessInfo(){
      this.$router.push('/business_information');
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
/* 로그인 박스 스타일 */
.login-box {
  background-color: #ffffff;
  padding: 32px;
  border-radius: 20px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'IBMPlexSansKR', sans-serif;
}

.header h2 {
  font-weight: bold;
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 24px;
}

label {
  width: 100%;
  margin-top: 12px;
  font-weight: 500;
  font-size: 14px;
  color: #5f6368;
}

input {
  margin-top: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #dadce0;
  font-size: 16px;
  color: #333;
  background-color: #f7f7f7;
  transition: background-color 0.3s ease;
}

input:focus {
  outline: none;
  background-color: #e8f0fe;
}

/* 로그인 버튼 */
.login-button {
  margin-top: 24px;
  width: 100%;
  padding: 12px;
  background-color: #6200ea;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.login-button:hover {
  background-color: #3700b3;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
}

/* 액션 링크 섹션 */
.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 12px;
}

.actions a {
  font-size: 14px;
  color: #6200ea;
  font-weight: 500;
  text-decoration: none;
}

.actions a:hover {
  text-decoration: underline;
}

/* 액션 버튼 스타일 */
.action-button {
  margin-top: 24px;
  width: 30vh;
  padding: 12px;
  background-color: #6eabe4;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.action-button:hover {
  background-color: #2B6CB0;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

/* 로그아웃 및 계정 삭제 버튼 */
.logout-button,
.delete-button {
  margin-top: 20px;
  width: 30vh;
  padding: 12px;
  background-color: #ac85de;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.logout-button:hover,
.delete-button:hover {
  background-color: #8a65bb;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
}
</style>
