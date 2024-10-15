<template>
  <div class="edit-user-info">
    <h2>사용자 정보 수정</h2>

    <form @submit.prevent="submitUserInfo">
      <!-- 사용자 이름 변경 -->
      <div class="form-group">
        <label for="user-name">사용자 이름 변경</label>
        <input type="text" id="user-name" v-model="userName" placeholder="새로운 사용자 이름을 입력하세요" required />
      </div>

      <!-- 아이디 변경 -->
      <div class="form-group">
        <label for="user-id">아이디 변경</label>
        <input type="text" id="user-id" v-model="userId" placeholder="새로운 아이디를 입력하세요" required />
      </div>

      <!-- 대표 이메일 변경 -->
      <div class="form-group">
        <label for="email">대표 이메일 변경</label>
        <input type="email" id="email" v-model="email" placeholder="새로운 이메일을 입력하세요" required />
      </div>

      <!-- 비밀번호 변경 -->
      <div class="form-group">
        <label for="password">비밀번호 변경</label>
        <input type="password" id="password" v-model="password" placeholder="새로운 비밀번호를 입력하세요" required />
      </div>

      <!-- 등록 버튼 -->
      <button type="submit" class="submit-button">정보 수정</button>
    </form>
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
    submitUserInfo() {
      // 사용자 정보 수정 로직을 여기에 추가
      alert(`사용자 이름: ${this.userName}, 아이디: ${this.userId}, 이메일: ${this.email}, 비밀번호: ${this.password}`);
      // 실제로는 API 호출 등을 통해 사용자 정보를 업데이트해야 합니다.
    }
  }
};
</script>

<style scoped>
.edit-user-info {
  padding: 20px;
  background-color: #f4f9e9; /* 전체 배경색 */
  border-radius: 15px; /* 테두리 둥글게 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 내용 가운데 정렬 */
}

.form-group {
  margin-bottom: 15px;
  width: 100%; /* 입력 필드 너비 100% */
}

label {
  font-size: 16px;
  margin-bottom: 5px;
  display: block;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #fff; /* 입력 필드 배경색 */
}

.submit-button {
  background-color: #4CAF50; /* 버튼 배경색 */
  color: white;
  padding: 10px 20px;
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
