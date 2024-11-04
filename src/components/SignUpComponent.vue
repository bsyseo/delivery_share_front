<template>
  <div class="home-container">
    <!-- 왼쪽 콘텐츠 영역 (회원가입 폼) -->
    <div class="content-section">
      <div class="signup-box">
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
        <input type="text" v-model="name" id="name" placeholder="이름을 입력하세요" /><br />
        <label for="address">주소</label>
        <input type="text" v-model="address" id="address" placeholder="주소를 입력하세요" /><br />
        <label for="phone">전화번호</label>
        <input type="phone" v-model="phone" id="phone" placeholder="전화번호를 입력하세요" /><br />
        <label for="email">Email</label>
        <input type="text" v-model="email" id="email" placeholder="이메일을 입력하세요" /><br />
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" placeholder="비밀번호를 입력하세요" /><br />
        <button @click="signUp">회원가입</button>
        <p>이미 계정이 있으신가요? <router-link to="/">로그인</router-link>하세요!</p>
      </div>
    </div>

    <!-- 오른쪽 동영상 영역 -->
    <div class="video-section">
      <video autoplay muted loop class="background-video">
        <source :src="require('@/assets/video/제목을-입력해주세요_.mp4')" type="video/mp4" />
        동영상을 지원하지 않는 브라우저입니다.
      </video>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { database } from '@/main';
import { ref, set } from 'firebase/database';

export default {
  name: 'SignUpComponent',
  data() {
    return {
      email: '',
      password: '',
      name: '',
      address: '',
      phone: '',
      role: 'consumer',
      isSignedUp: false
    }
  },
  methods: {
    signUp() {
      if (!this.name || !this.address || !this.phone || !this.email || !this.password || !this.role) {
        alert('모든 필드값을 채워주세요!');
        return;
      }

      const authInstance = getAuth();
      createUserWithEmailAndPassword(authInstance, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          // 사용자 정보와 함께 APPROVED 항목을 데이터베이스에 저장
          set(ref(database, 'users/' + user.uid), {
            name: this.name,
            address: this.address,
            phone: this.phone,
            email: this.email,
            role: this.role,
          })
          .then(() => {
            alert('회원가입이 성공적으로 완료되었습니다!');
            this.isSignedUp = true;
            this.$router.push('/');
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
/* 전체 레이아웃 */
.home-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
}

/* 왼쪽 콘텐츠 섹션 */
.content-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 회원가입 폼 스타일 */
.signup-box {
  width: 110%;
  max-width: 400px;
  background-color: #f9f9f9;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  transition: box-shadow 0.3s ease;
}

.signup-box:hover {
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.header {
  text-align: left;
  margin-bottom: 24px;
}

.header h2 {
  font-weight: 700;
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.subheader {
  font-size: 16px;
  color: #5f6368;
  margin-bottom: 24px;
}

label {
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #5f6368;
  margin-top: 12px;
  margin-bottom: 6px;
}

input, select {
  margin: 4px 0 16px 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  width: 80%;
  font-size: 16px;
  color: #333;
  background-color: #ffffff;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #6200ea;
  background-color: #f3e8ff;
}

button {
  margin-top: 24px;
  width: 100%;
  padding: 12px;
  background-color: #6200ea;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
  background-color: #3700b3;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

p {
  margin-top: 24px;
  font-size: 14px;
  color: #5f6368;
  text-align: center;
}

p a {
  color: #6200ea;
  font-weight: 500;
  text-decoration: none;
}

p a:hover {
  text-decoration: underline;
}

/* 오른쪽 동영상 섹션 */
.video-section {
  flex: 1;
  background-color: #81c784;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  overflow: hidden;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
