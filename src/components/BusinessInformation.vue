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

      <!-- 사업자등록증 -->
      <div class="form-group">
        <label for="business-license">사업자등록증 업로드</label>
        <input type="file" id="business-license" @change="handleFileUpload" accept="image/*" required />
        <div v-if="businessLicensePreview" class="preview-container">
          <img :src="businessLicensePreview" alt="사업자등록증 미리보기" class="preview-image" />
        </div>
      </div>

      <!-- 등록 버튼 -->
      <button type="submit" class="submit-button">등록</button>
    </form>
  </div>
</template>

<script>
// Firebase 관련 기능 가져오기
import { database } from '@/firebase.js'; // firebase.js에서 database 가져오기
import { ref, set } from "firebase/database"; // Firebase Database에서 ref, set 함수 사용

export default {
  name: 'BusinessInformation',
  data() {
    return {
      businessName: '',
      ownerName: '',
      contact: '',
      registrationNumber: '',
      address: '',
      businessLicense: null, // 사업자등록증 파일 저장
      businessLicensePreview: null, // 미리보기 이미지 저장
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.businessLicense = file;

        // 미리보기 이미지 생성
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.businessLicensePreview = e.target.result;
        };
      }
    },
    async submitBusinessInfo() {
      if (this.businessLicense) {
        try {
          // Firebase에 데이터 저장하기
          const businessInfoRef = ref(database, 'businesses/' + this.registrationNumber); // 등록번호를 키로 사용
          await set(businessInfoRef, {
            businessName: this.businessName,
            ownerName: this.ownerName,
            contact: this.contact,
            registrationNumber: this.registrationNumber,
            address: this.address
          });

          alert('사업자 정보가 등록되었습니다.');
          console.log('사업자명:', this.businessName);
          console.log('대표자명:', this.ownerName);
          console.log('연락처:', this.contact);
          console.log('등록번호:', this.registrationNumber);
          console.log('주소:', this.address);
          console.log('사업자등록증 파일:', this.businessLicense.name);
        } catch (error) {
          console.error('사업자 정보 저장 중 오류 발생:', error);
          alert('사업자 정보를 저장하는 데 실패했습니다.');
        }
      } else {
        alert('사업자등록증을 업로드해 주세요.');
      }
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
  padding: 5px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="tel"],
input[type="file"] {
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 15px;
  outline: none;
}

input[type="file"] {
  padding: 5px;
  font-size: 14px;
}

.preview-container {
  margin-top: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
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
