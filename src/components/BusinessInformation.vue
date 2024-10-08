<template>
  <div class="business-info-container">
    <h1>사업자 정보 등록</h1>
    <form @submit.prevent="submitBusinessInfo">
      <!-- 대표자명 -->
      <div class="form-group">
        <label for="owner-name">대표자명</label>
        <input type="text" id="owner-name" v-model="ownerName" placeholder="대표자명을 입력하세요" required />
      </div>

      <!-- 연락처 -->
      <div class="form-group">
        <label for="contact">연락처</label>
        <input type="tel" id="contact" v-model="contact" placeholder="010-0000-0000" required />
      </div>

      <!-- 사업자 등록번호 -->
      <div class="form-group">
        <label for="registration-number">사업자 등록번호</label>
        <input type="text" id="registration-number" v-model="registrationNumber" placeholder="등록번호 10자리" required />
      </div>

      <!-- 사업장 주소 -->
      <div class="form-group">
        <label for="address">사업장 주소</label>
        <input type="text" id="address" v-model="address" placeholder="사업장 주소를 입력하세요" required />
      </div>

      <!-- 운영 시간 -->
      <div class="form-group">
        <label for="operation-hours">운영 시간</label>
        <input type="text" id="operation-hours" v-model="operationHours" placeholder="예: 오전 9시 ~ 오후 6시" required />
      </div>

      <!-- 휴무일 선택 -->
      <div class="form-group">
        <label for="closed-days">휴무일</label>
        <input type="date" id="closed-days" v-model="selectedClosedDay" @change="addClosedDay" placeholder="휴무일을 선택하세요" />
        <ul>
          <li v-for="(day, index) in closedDays" :key="index">
            {{ day }} <button @click="removeClosedDay(index)">삭제</button>
          </li>
        </ul>
      </div>

      <!-- 사업자등록증 -->
      <div class="form-group">
        <label for="business-license">사업자등록증 업로드</label>
        <input type="file" id="business-license" @change="handleFileUpload('businessLicense')" accept="image/*, application/pdf" required />
        <div v-if="businessLicensePreview" class="preview-container">
          <img :src="businessLicensePreview" alt="사업자등록증 미리보기" class="preview-image" />
        </div>
      </div>

      <!-- 영업신고증 -->
      <div class="form-group">
        <label for="business-permit">영업신고증 업로드</label>
        <input type="file" id="business-permit" @change="handleFileUpload('businessPermit')" accept="image/*, application/pdf" required />
        <div v-if="businessPermitPreview" class="preview-container">
          <img :src="businessPermitPreview" alt="영업신고증 미리보기" class="preview-image" />
        </div>
      </div>

      <!-- 통장사본 -->
      <div class="form-group">
        <label for="bank-account">통장사본 업로드</label>
        <input type="file" id="bank-account" @change="handleFileUpload('bankAccount')" accept="image/*, application/pdf" required />
        <div v-if="bankAccountPreview" class="preview-container">
          <img :src="bankAccountPreview" alt="통장사본 미리보기" class="preview-image" />
        </div>
      </div>

      <!-- 등록 버튼 -->
      <button type="submit" class="submit-button">등록</button>
    </form>
  </div>
</template>

<script>
import { database } from '@/firebase.js';
import { ref, set } from "firebase/database";

export default {
  name: 'BusinessInformation',
  data() {
    return {
      ownerName: '',
      contact: '',
      registrationNumber: '',
      address: '',
      operationHours: '', // 사용자가 직접 입력할 운영 시간 필드
      selectedClosedDay: '',
      closedDays: [],
      businessLicense: null,
      businessLicensePreview: null,
      businessPermit: null,
      businessPermitPreview: null,
      bankAccount: null,
      bankAccountPreview: null,
    };
  },
  methods: {
    handleFileUpload(field) {
      const file = event.target.files[0];
      if (file) {
        this[field] = file;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this[`${field}Preview`] = e.target.result;
        };
      }
    },
    addClosedDay() {
      if (this.selectedClosedDay && !this.closedDays.includes(this.selectedClosedDay)) {
        this.closedDays.push(this.selectedClosedDay);
      }
      this.selectedClosedDay = '';
    },
    removeClosedDay(index) {
      this.closedDays.splice(index, 1);
    },
    async submitBusinessInfo() {
      if (this.businessLicense && this.businessPermit && this.bankAccount) {
        try {
          const businessInfoRef = ref(database, 'businesses/' + this.registrationNumber);
          await set(businessInfoRef, {
            ownerName: this.ownerName,
            contact: this.contact,
            registrationNumber: this.registrationNumber,
            address: this.address,
            operationHours: this.operationHours, // 사용자가 입력한 운영 시간을 저장
            closedDays: this.closedDays
          });

          alert('사업자 정보가 등록되었습니다.');
        } catch (error) {
          console.error('사업자 정보 저장 중 오류 발생:', error);
          alert('사업자 정보를 저장하는 데 실패했습니다.');
        }
      } else {
        alert('필수 서류를 모두 업로드해 주세요.');
      }
    }
  }
};
</script>

<style scoped>
.business-info-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 15px;
  background-color: #f1f1f1;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  font-family: 'NanumSquareRound', sans-serif;
}

h1 {
  text-align: center;
  font-size: 28px;
  color: #4A4A4A;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

input[type="text"],
input[type="tel"],
input[type="file"],
input[type="time"],
input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
}

input[type="file"] {
  padding: 8px;
  font-size: 14px;
}

.preview-container {
  margin-top: 10px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 150px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #4CAF50;
  color: #fff;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45A049;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
}

* {
  box-sizing: border-box;
}
</style>
