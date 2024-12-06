<template>
  <div class="home-container">
    <div class="main-content">
      <div class="intro-section">
        <div class="home-content">
          <h1>아이디 찾기 / 비밀번호 재설정</h1>
          <p>필요한 정보를 선택하고 입력해주세요.</p>
        </div>
      </div>

      <!-- 탭 전환 -->
      <div class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'findId' }"
          @click="activeTab = 'findId'"
        >
          아이디 찾기
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'resetPassword' }"
          @click="activeTab = 'resetPassword'"
        >
          비밀번호 재설정
        </button>
      </div>

      <!-- 탭 콘텐츠 -->
      <div class="form-section">
        <form v-if="activeTab === 'findId'" @submit.prevent="findId">
          <div class="form-group">
            <label for="name" class="input-label">이름</label>
            <input
              type="text"
              id="name"
              v-model="name"
              class="input-field"
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          <div class="form-group">
            <label for="email" class="input-label">이메일</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="input-field"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <button type="submit" class="submit-button">아이디 찾기</button>
          <p v-if="foundId" class="success-message">
            아이디: <strong>{{ foundId }}</strong>
          </p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>

        <form v-if="activeTab === 'resetPassword'" @submit.prevent="resetPassword">
          <div class="form-group">
            <label for="email" class="input-label">이메일</label>
            <input
              type="email"
              id="reset-email"
              v-model="email"
              class="input-field"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <button type="submit" class="submit-button">비밀번호 재설정</button>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';

export default {
  name: 'Reset_IDnPW',
  data() {
    return {
      activeTab: 'findId', // 기본 탭은 아이디 찾기
      name: '',
      email: '',
      foundId: '',
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    async findId() {
      try {
        const auth = getAuth();
        const methods = await fetchSignInMethodsForEmail(auth, this.email);
        if (methods && methods.length > 0) {
          this.foundId = methods[0];
          this.errorMessage = '';
        } else {
          this.errorMessage = '입력하신 정보로 등록된 아이디를 찾을 수 없습니다.';
        }
      } catch (error) {
        this.errorMessage = '오류가 발생했습니다. 다시 시도해주세요.';
      }
    },
    async resetPassword() {
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, this.email);
        this.successMessage = '비밀번호 재설정 이메일이 전송되었습니다.';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = '오류가 발생했습니다. 다시 시도해주세요.';
        this.successMessage = '';
      }
    },
  },
};
</script>

<style scoped>
/* 공통 레이아웃 */
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.submit-button {
  background-color: #6200ea;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3700b3;
}

.success-message {
  color: green;
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 20px;
}

/* 탭 스타일 */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f0f0f0;
  color: #333;
  transition: background-color 0.3s;
}

.tab-button.active {
  background-color: #6200ea;
  color: white;
}

.tab-button:hover {
  background-color: #ccc;
}
</style>
