<template>
  <div class="find-id-container">
    <div class="header">
      <h2>ID 찾기</h2>
    </div>
    <div class="find-id-box">
      <label for="name">이름</label>
      <input type="text" v-model="name" id="name" placeholder="이름을 입력하세요" /><br />
      <label for="phone">전화번호</label>
      <input type="text" v-model="phone" id="phone" placeholder="전화번호를 입력하세요" /><br />
      <button @click="findId">ID 찾기</button>
      <p v-if="foundId">{{ foundId }}</p>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { ref, get, child } from 'firebase/database';
import { database } from '@/main';

export default {
  name: 'FindIdComponent',
  data() {
    return {
      name: '',
      phone: '',
      foundId: '',
      message: ''
    };
  },
  methods: {
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
              this.foundId = `해당하는 ID는: ${user.email} 입니다.`;
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
    }
  }
};
</script>

<style scoped>
.find-id-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f2f2f2;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.header h2 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: #444;
}

.find-id-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  font-size: 12px;
  margin-top: 10px;
}

input {
  margin: 4px 0;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
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

p {
  margin-top: 15px;
  font-size: 12px;
  color: green;
}
</style>
