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
      password: ''
    };
  },
  methods: {
    submitUserInfo() {
      // 사용자 정보 수정 로직을 여기에 추가
      alert(`사용자 이름: ${this.userName}, 아이디: ${this.userId}, 비밀번호: ${this.password}`);
      // 실제로는 API 호출 등을 통해 사용자 정보를 업데이트해야 합니다.
    }
  }
};
</script>

<style scoped>
.edit-user-info {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 16px;
  margin-bottom: 5px;
  display: block;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45A049;
}
</style>

  
