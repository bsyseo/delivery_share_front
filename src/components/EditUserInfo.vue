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
  padding: 20px;
  background-color: #ffffff; /* 배경색 흰색 */
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: auto;
  font-family: Arial, sans-serif;
}

h2 {
  font-size: 1.8em;
  margin-bottom: 1em;
  text-align: center;
  color: #6c4fbd; /* 보라색 */
}

h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #6c4fbd; /* 보라색 */
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 70%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.update-button {
  margin-left: 10px;
  background-color: #6c4fbd; /* 보라색 */
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.update-button:hover {
  background-color: #5a3c9a; /* 다크 보라색 */
}

.submit-button {
  margin-top: 20px;
  background-color: #6c4fbd;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #5a3c9a; /* 다크 보라색 */
}
</style>
