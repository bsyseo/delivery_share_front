<template>
  <div class="edit-user-info">
    <h2>사용자 정보 수정</h2>

    <!-- 사용자 이름 변경 -->
    <div class="form-group">
      <label for="user-name">사용자 이름 변경</label>
      <div class="input-container">
        <input type="text" id="user-name" v-model="userName" placeholder="새로운 사용자 이름을 입력하세요" />
        <button v-on:click="updateUserName" class="update-button">수정</button>
      </div>
    </div>

    <!-- 아이디 변경 -->
    <div class="form-group">
      <label for="user-id">아이디 변경</label>
      <div class="input-container">
        <input type="text" id="user-id" v-model="userId" placeholder="새로운 아이디를 입력하세요" />
        <button v-on:click="updateUserId" class="update-button">수정</button>
      </div>
    </div>

    <!-- 대표 이메일 변경 -->
    <div class="form-group">
      <label for="email">대표 이메일 변경</label>
      <div class="input-container">
        <input type="email" id="email" v-model="email" placeholder="새로운 이메일을 입력하세요" />
        <button v-on:click="updateEmail" class="update-button">수정</button>
      </div>
    </div>

    <!-- 비밀번호 변경 -->
    <div class="form-group">
      <label for="password">비밀번호 변경</label>
      <div class="input-container">
        <input type="password" id="password" v-model="password" placeholder="새로운 비밀번호를 입력하세요" />
        <button v-on:click="updatePassword" class="update-button">수정</button>
      </div>
    </div>

    <button class="submit-button" @click="submitAll">전체 정보 수정</button>
  </div>
</template>

<script>
export default {
  name: 'EditUserInfo',
  data() {
    return {
      userName: '',
      userId: '',
      email: '',
      password: ''
    };
  },
  methods: {
    updateUserName() {
      alert(`사용자 이름이 ${this.userName}으로 수정되었습니다.`);
    },
    updateUserId() {
      alert(`아이디가 ${this.userId}로 수정되었습니다.`);
    },
    updateEmail() {
      alert(`이메일이 ${this.email}로 수정되었습니다.`);
    },
    updatePassword() {
      alert('비밀번호가 수정되었습니다.');
    },
    submitAll() {
      const missingFields = [];

      if (!this.userName) missingFields.push('사용자 이름');
      if (!this.userId) missingFields.push('아이디');
      if (!this.email) missingFields.push('이메일');
      if (!this.password) missingFields.push('비밀번호');

      if (missingFields.length > 0) {
        alert(`${missingFields.join(', ')}을(를) 수정해야 합니다.`);
      } else {
        alert('모든 정보가 수정되었습니다.');
        // 실제로는 API 호출 등을 통해 사용자 정보를 업데이트해야 합니다.
      }
    }
  }
};
</script>

<style scoped>
.edit-user-info {
  padding: 15px; /* 패딩을 줄여 크기 조정 */
  background-color: #f4f9e9; /* 전체 배경색 */
  border-radius: 15px; /* 테두리 둥글게 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 내용 가운데 정렬 */
  width: 90%; /* 너비 조정 */
  max-width: 400px; /* 최대 너비 조정 */
  margin: auto; /* 가운데 정렬을 위한 마진 */
}

.form-group {
  margin-bottom: 10px; /* 간격 조정 */
  width: 100%; /* 입력 필드 너비 100% */
}

label {
  font-size: 14px; /* 폰트 크기 조정 */
  margin-bottom: 5px;
  display: block;
}

.input-container {
  display: flex;
  align-items: center; /* 버튼과 입력 필드 수직 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 70%; /* 입력 필드 너비 조정 */
  padding: 8px; /* 패딩 줄이기 */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px; /* 폰트 크기 조정 */
}

.update-button {
  margin-left: 10px; /* 버튼과 입력 필드 사이 여백 */
  background-color: #4CAF50; /* 버튼 배경색 */
  color: white;
  padding: 8px 15px; /* 패딩 줄이기 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px; /* 폰트 크기 조정 */
  transition: background-color 0.3s;
}

.update-button:hover {
  background-color: #45A049; /* 버튼 호버 색상 */
}

.submit-button {
  margin-top: 15px; /* 상단 여백 추가 */
  background-color: #4CAF50; /* 버튼 배경색 */
  color: white;
  padding: 10px 20px; /* 패딩 추가 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45A049; /* 버튼 호버 색상 */
}
</style>
