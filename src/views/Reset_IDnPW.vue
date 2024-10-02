<template>
  <div class="reset-idpw-container">
    <div class="header">
      <h2>ID/PW 찾기</h2>
    </div>

    <!-- ID 찾기 부분 -->
    <div v-if="showIdFindSection && !showResetPasswordSection" class="find-id-box">
      <label for="name">이름</label>
      <input type="text" v-model="name" id="name" placeholder="이름을 입력하세요" /><br />
      <label for="phone">전화번호</label>
      <input type="text" v-model="phone" id="phone" placeholder="전화번호를 입력하세요" /><br />
      <button @click="findId">ID 찾기</button>
      <p v-if="foundId">{{ foundId }}</p>
      <p v-if="message">{{ message }}</p>
    </div>

    <!-- 비밀번호 재설정 부분 -->
    <div v-if="showResetPasswordSection && !showIdFindSection" class="reset-password-box">
      <h3>비밀번호 재설정</h3>
      <label for="resetEmail">이메일로 재설정</label>
      <input type="text" v-model="resetEmail" id="resetEmail" placeholder="이메일을 입력하세요"><br />
      <button @click="sendResetPasswordEmail">비밀번호 재설정 이메일 보내기</button>
      <p v-if="resetPasswordMessage">{{ resetPasswordMessage }}</p>
    </div>

    <!-- 버튼들 -->
    <div class="actions">
      <button @click="toggleIdFindSection">ID 찾기</button>
      <button @click="toggleResetPasswordSection">PW 재설정</button>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';
import { database } from '@/main';

export default {
  name: 'ResetIDnPW',
  data() {
    return {
      name: '',
      phone: '',
      email: '',
      resetEmail: '',
      foundId: '',
      message: '',
      resetMessage: '',
      resetPasswordMessage: '',
      isIdFound: false, // ID 찾기 완료 여부
      resetVisible: false, // 비밀번호 재설정 칸 표시 여부
      showIdFindSection: false, // ID 찾기 부분 표시 여부
      showResetPasswordSection: false // PW 재설정 부분 표시 여부
    };
  },
  methods: {
    // ID 찾기
    async findId() {
      if (!this.name.trim() || !this.phone.trim()) {
        this.message = '이름과 전화번호를 입력하세요.';
        return;
      }
      
      this.message = '';
      this.foundId = '';

      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'users'));

        if (snapshot.exists()) {
          const users = snapshot.val();
          let found = false;

          for (let uid in users) {
            const user = users[uid];
            if (user.name.trim().toLowerCase() === this.name.trim().toLowerCase() &&
                user.phone.trim() === this.phone.trim()) {
              this.email = user.email;
              this.foundId = `해당하는 ID는: ${user.email} 입니다.`;
              this.isIdFound = true; // ID 찾기 완료
              found = true;
              break;
            }
          }

          if (!found) {
            this.message = '해당 정보와 일치하는 ID를 찾을 수 없습니다.';
          }
        } else {
          this.message = '사용자 정보가 없습니다.';
        }
      } catch (error) {
        console.error('데이터베이스 검색 오류:', error);
        this.message = '데이터베이스 검색 중 오류가 발생했습니다.';
      }
    },

    // 비밀번호 재설정 링크 전송
    sendResetEmail() {
      const auth = getAuth();
      sendPasswordResetEmail(auth, this.email)
        .then(() => {
          this.resetMessage = '비밀번호 재설정 이메일이 전송되었습니다.';
        })
        .catch((error) => {
          this.resetMessage = '에러 발생: ' + error.message;
        });
    },

    goHome() {
      this.$router.push('/');
    },

    // 비밀번호 재설정 이메일 보내기
    sendResetPasswordEmail() {
      const auth = getAuth();
      sendPasswordResetEmail(auth, this.resetEmail)
        .then(() => {
          this.resetPasswordMessage = '비밀번호 재설정 이메일이 전송되었습니다.';
          this.resetVisible = true; // 비밀번호 재설정 칸을 표시하도록 설정
        })
        .catch((error) => {
          this.resetPasswordMessage = '에러 발생: ' + error.message;
        });
    },

    // ID 찾기 부분 표시
    toggleIdFindSection() {
      this.showIdFindSection = true;
      this.showResetPasswordSection = false;
    },

    // PW 재설정 부분 표시
    toggleResetPasswordSection() {
      this.showIdFindSection = false;
      this.showResetPasswordSection = true;
    }
  }
};
</script>

<style scoped>
.reset-idpw-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('@/assets/8740981%202.png');
  background-size: cover;
  background-position: center;
}

.header {
  margin-bottom: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 20px;
  width: 10%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.header h2 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: #444;
}

.find-id-box,
.reset-box,
.reset-password-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 20px;
  width: 300px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
}

input {
  margin: 4px 0;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 85%;
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

.actions {
  margin-top: 20px;
}

.reset-link {
  font-size: 14px;
  color: #444;
  text-decoration: underline;
  cursor: pointer;
}

.reset-link:hover {
  color: #555;
}

p {
  margin-top: 15px;
  font-size: 12px;
  color: green;
}
</style>
