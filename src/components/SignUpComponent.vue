<template>
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
    <input type="text" v-model="name" id="name" placeholder="name" /><br />
    <label for="address">주소</label>
    <input type="text" v-model="address" id="address" placeholder="address" /><br />
    <label for="phone">전화번호</label>
    <input type="phone" v-model="phone" id="phone" placeholder="phone" /><br />
    <label for="email">Email</label>
    <input type="text" v-model="email" id="email" placeholder="Email" /><br />
    <label for="password">Password</label>
    <input type="password" v-model="password" id="password" placeholder="Password" /><br />
    <button @click="signUp">회원가입</button>
    <p>이미 계정이 있으신가요? <router-link to="/">로그인</router-link>하세요!</p>
  </div>
</template>

<script>
import { auth, database } from "@/firebase"; // firebase.js에서 auth와 database를 가져옴
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

export default {
  data() {
    return {
      name: "",
      adress: "",
      email: "",
      password: "",
      role: "",
      phone: "",
    };
  },
  methods: {
    async signUp() {
      try {
        // Firebase Authentication을 통해 유저 생성
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);

        // 유저 정보
        const userId = userCredential.user.uid;

        // Realtime Database에 추가 정보 저장
        await set(ref(database, 'users/' + userId), {
          name: this.name,
          address: this.address,
          role: this.role,
          phone: this.phone,
          email: this.email
        });

        alert('Sign up successful!');
      } catch (error) {
        console.error("Error during sign up:", error);
        alert(error.message);
      }
    }
  }
};
</script>

<style scoped>
.signup-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 20px;
  width: 280px;
  height: 60vh;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
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

label {
  display: block;
  width: 85%;
  font-weight: bold;
  font-size: 12px;
}

input, select {
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

p {
  margin-top: 15px;
  font-size: 12px;
}

p a {
  text-decoration: underline;
  cursor: pointer;
}
</style>
