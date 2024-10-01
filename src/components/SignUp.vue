<template>
  <div class="login-container">
    <div v-if="!isSignedUp" class="signup-box">
      <div class="header">
        <h2>회원가입</h2>
      </div>
      <label for="role">이용자 구분</label>
      <select v-model="role" id="role">
        <option value="consumer">소비자</option>
        <option value="business">자영업자</option>
        <option value="admin">관리자</option>
      </select><br />
      <label for="name">이름</label>
      <input type="text" v-model="name" id="name" placeholder="name" /><br />
      <label for="adress">주소</label>
      <input type="text" v-model="adress" id="adress" placeholder="adress" /><br />
      <label for="phone">전화번호</label>
      <input type="phone" v-model="phone" id="phone" placeholder="phone" /><br />
      <label for="email">Email</label>
      <input type="text" v-model="email" id="email" placeholder="Email" /><br />
      <label for="password">Password</label>
      <input type="password" v-model="password" id="password" placeholder="Password" /><br />
      <button @click="signUp">회원가입</button>
      <p>이미 계정이 있으신가요? <router-link to="/">로그인</router-link>하세요!</p>
    </div>
    <!-- 회원가입 성공 시 메시지 표시 -->
    <div v-else class="welcome-message">
      <h2>회원가입 완료!</h2>
      <p>가입이 성공적으로 완료되었습니다.</p>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { database } from '@/main'
import { ref, set } from 'firebase/database'

export default {
  name: 'SignUpComponent',
  data() {
    return {
      email: '',
      password: '',
      name: '',
      adress: '',
      phone: '',
      role: 'consumer', // 추가된 역할 데이터, 기본값은 "소비자"
      isSignedUp: false // 회원가입 성공 여부 상태
    }
  },
  methods: {
    signUp() {
      // Check if any required field is empty
      if (!this.name || !this.adress || !this.phone || !this.email || !this.password || !this.role) {
        alert('모든 필드값을 채워주세요!');
        return;
      }

      const authInstance = getAuth(); // Firebase auth 인스턴스 가져오기
      createUserWithEmailAndPassword(authInstance, this.email, this.password)
        .then((userCredential) => {
          // 회원가입이 성공하면 데이터베이스에 사용자 정보 저장
          const user = userCredential.user;
          set(ref(database, 'users/' + user.uid), {
            name: this.name,
            adress: this.adress,
            phone: this.phone,
            email: this.email,
            role: this.role // 선택한 역할 저장
          })
            .then(() => {
              alert('회원가입이 성공적으로 완료되었습니다!');
              this.isSignedUp = true; // 회원가입 성공 상태 업데이트
              this.$router.push('/'); // 로그인 페이지로 리다이렉트
            })
            .catch((error) => {
              console.error('데이터베이스 저장 오류:', error);
            });
        })
        .catch((error) => {
          console.error('회원가입 오류:', error);
        });
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('@/assets/8740981%202.png'); /* 배경 이미지 */
  background-size: cover; /* Make background cover the entire div */
  background-position: center; /* Center the background */
}

/* 헤더 스타일 */
.header {
  margin-bottom: 20px; /* 마진을 줄임 */
  text-align: center;
}

.header h2 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 24px; /* 헤더 크기를 줄임 */
  color: #444;
}

/* 회원가입 박스 스타일 */
.signup-box {
  background-color: rgba(255, 255, 255, 0.9); /* Slight transparency */
  padding: 15px; /* padding을 줄임 */
  border-radius: 8px;
  width: 250px; /* 박스 크기 줄임 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left; /* 내용 왼쪽 정렬 */
}

label {
  display: block;
  width: 85%;
  font-weight: bold;
  font-size: 12px; /* 글자 크기 줄임 */
}

input, select {
  margin: 4px 0; /* 마진을 줄임 */
  padding: 6px; /* padding을 줄임 */
  border-radius: 4px; /* radius를 줄임 */
  border: 1px solid #ccc;
  width: 85%; /* 너비를 줄임 */
  font-size: 12px; /* 글자 크기 줄임 */
}

button {
  margin-top: 15px; /* 마진을 줄임 */
  width: 100%;
  padding: 8px; /* padding을 줄임 */
  background-color: #c7e5a8;
  color: #333;
  font-size: 14px; /* 글자 크기 줄임 */
  font-weight: bold;
  border: none;
  border-radius: 4px; /* radius를 줄임 */
  cursor: pointer;
}

button:hover {
  background-color: #b3d999;
}

p {
  margin-top: 15px; /* 마진을 줄임 */
  font-size: 12px; /* 글자 크기 줄임 */
}

p a {
  text-decoration: underline;
  cursor: pointer;
}

/* 회원가입 성공 시 메시지 스타일 */
.welcome-message {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px; /* padding을 줄임 */
  border-radius: 8px; /* radius를 줄임 */
  width: 250px; /* 박스 크기 줄임 */
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-message h2 {
  font-size: 20px; /* 글자 크기 줄임 */
  color: #333;
}

.welcome-message p {
  font-size: 12px; /* 글자 크기 줄임 */
  color: #555;
}
</style>
