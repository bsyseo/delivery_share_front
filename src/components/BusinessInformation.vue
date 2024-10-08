<template>
  <div class="business-info-container">
    <h1>사업자 정보 등록 페이지</h1>
    <form @submit.prevent="submitBusinessInfo">
      <!-- 사업자명 -->
      <div class="form-group">
        <label for="business-name">사업자명</label>
        <input type="text" id="business-name" v-model="businessName" placeholder="사업자명을 입력하세요" required />
      </div>

      <!-- 대표자명 -->
      <div class="form-group">
        <label for="owner-name">대표자명</label>
        <input type="text" id="owner-name" v-model="ownerName" placeholder="대표자명을 입력하세요" required />
      </div>

      <!-- 연락처 -->
      <div class="form-group">
        <label for="contact">연락처</label>
        <input type="tel" id="contact" v-model="contact" placeholder="연락처를 입력하세요 (010-0000-0000)" required />
      </div>

      <!-- 사업자 등록번호 -->
      <div class="form-group">
        <label for="registration-number">사업자 등록번호</label>
        <input type="text" id="registration-number" v-model="registrationNumber" placeholder="등록번호를 입력하세요 (10자리)" required />
      </div>

      <!-- 사업장 주소 -->
      <div class="form-group">
        <label for="address">사업장 주소</label>
        <input type="text" id="address" v-model="address" placeholder="주소를 입력하세요" required />
      </div>

      <!-- 등록 버튼 -->
      <button type="submit" class="submit-button">등록</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'BusinessInformation',
  data() {
    return {
      businessName: '',
      ownerName: '',
      contact: '',
      registrationNumber: '',
      address: ''
    };
  },
  methods: {
    submitBusinessInfo() {
      // 폼 제출 시 처리할 로직
      alert('사업자 정보가 등록되었습니다.');
      console.log('사업자명:', this.businessName);
      console.log('대표자명:', this.ownerName);
      console.log('연락처:', this.contact);
      console.log('등록번호:', this.registrationNumber);
      console.log('주소:', this.address);
      // 필요한 경우 추가적인 처리
    }
  }
};
</script>

<style scoped>
.business-info-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 30px;
  background-color: #f9f9f9;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25), /* drop shadow */
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25); /* inner shadow */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-group {
  text-align: left;
  padding:5px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 15px;
}

.submit-button {
  width: 60%;
  margin-top: 2vh;
  padding: 12px;
  font-size: 18px;
  color: #fff;
  background-color: #BFDC99;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #97B762;
}

@font-face {
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUARER.OTF') format('opentype');
}

* {
  font-family: 'NanumSquareRound', sans-serif;
}
</style>
