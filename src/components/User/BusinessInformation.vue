<template>
  <div class="business-info-container">
    <h1>사업자 정보 등록</h1>
    <form @submit.prevent="submitBusinessInfo">
      <!-- 가게명 -->
      <div class="form-group">
        <label for="store-name">가게명</label>
        <input type="text" id="store-name" v-model="storeName" placeholder="가게명을 입력하세요" required />
      </div>

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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from '@/firebase.js';
import { ref, set, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  name: 'BusinessInformation',
  data() {
    return {
      storeName: '',
      ownerName: '',
      contact: '',
      registrationNumber: '',
      address: '',
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
    async submitBusinessInfo() {
      const auth = getAuth();
      const storage = getStorage();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;

          if (this.businessLicense && this.businessPermit && this.bankAccount) {
            try {
              // 파일을 업로드하고 URL을 가져오기
              const businessLicenseUrl = await this.uploadFileToStorage(storage, uid, 'businessLicense', this.businessLicense);
              const businessPermitUrl = await this.uploadFileToStorage(storage, uid, 'businessPermit', this.businessPermit);
              const bankAccountUrl = await this.uploadFileToStorage(storage, uid, 'bankAccount', this.bankAccount);

              // 기존 데이터를 불러오기
              const businessInfoRef = ref(database, 'store/' + uid);
              const existingDataSnapshot = await get(businessInfoRef);
              const existingData = existingDataSnapshot.exists() ? existingDataSnapshot.val() : {};

              // 새로운 데이터와 기존 데이터를 병합하여 저장
              const newData = {
                storeName: this.storeName,
                ownerName: this.ownerName,
                contact: this.contact,
                approved: 'no',
                registrant_uid: uid,
                businessLicenseUrl,
                businessPermitUrl,
                bankAccountUrl,
                store_address: this.address,
              };

              // 기존 데이터와 병합하여 Firebase에 저장
              await set(businessInfoRef, { ...existingData, ...newData });

              alert('사업자 정보가 등록되었습니다.');
            } catch (error) {
              console.error('사업자 정보 저장 중 오류 발생:', error);
              alert('사업자 정보를 저장하는 데 실패했습니다.');
            }
          } else {
            alert('필수 서류를 모두 업로드해 주세요.');
          }
        } else {
          alert('로그인이 필요합니다.');
        }
      });
    },
    async uploadFileToStorage(storage, uid, fieldName, file) {
      // 파일을 'store/{uid}/' 경로로 저장하도록 수정
      const fileRef = storageRef(storage, `store/${uid}/${fieldName}.${file.name.split('.').pop()}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      return fileUrl;
    }
  }
};
</script>


<style scoped>
/* 컨테이너 스타일 */
.business-info-container {
  max-width: 700px;
  margin: 50px auto;
  padding: 32px;
  border-radius: 16px;
  background-color: #ffffff; /* 표면 색상 */
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24); /* Elevation 효과 */
  font-family: 'Roboto', sans-serif;
  color: #1C1B1F; /* 표면 위 텍스트 색상 */
}

/* 제목 스타일 */
h1 {
  text-align: center;
  font-size: 28px;
  font-weight: 500;
  color: #6750A4; /* 주요 색상 */
  margin-bottom: 24px;
}

/* 폼 그룹 스타일 */
.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #49454F; /* 텍스트 보조 색상 */
  margin-bottom: 8px;
  display: block;
}

/* 입력 필드 스타일 */
input[type="text"],
input[type="tel"],
input[type="file"],
input[type="time"],
input[type="date"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #CAC4D0; /* 테두리 색상 */
  border-radius: 8px;
  font-size: 16px;
  background-color: #F4EFF4; /* 입력 필드 배경 색상 */
  color: #1C1B1F; /* 텍스트 색상 */
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus,
input[type="tel"]:focus,
input[type="file"]:focus,
input[type="time"]:focus,
input[type="date"]:focus {
  border-color: #6750A4; /* 포커스 상태 테두리 색상 */
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.32); /* 포커스 그림자 */
  outline: none;
}

/* 이미지 미리보기 */
.preview-container {
  margin-top: 12px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 150px;
  border: 1px solid #CAC4D0; /* 테두리 색상 */
  border-radius: 8px;
  background-color: #F4EFF4; /* 배경 색상 */
}

/* 버튼 스타일 */
.submit-button {
  display: block;
  width: 100%;
  padding: 14px;
  background-color: #6750A4; /* 버튼 배경색 */
  color: #FFFFFF; /* 버튼 텍스트 색상 */
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24); /* Elevation 효과 */
}

.submit-button:hover {
  background-color: #4A3780; /* 호버 상태 버튼 배경색 */
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.32); /* 호버 상태 그림자 */
}

/* 네비게이션 버튼 스타일 */
.nav-button {
  background-color: #625B71; /* 네비게이션 버튼 배경색 */
  color: #FFFFFF; /* 버튼 텍스트 색상 */
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24); /* Elevation 효과 */
}

.nav-button:hover {
  background-color: #4E4758; /* 네비게이션 버튼 호버 색상 */
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.32); /* 호버 상태 그림자 */
}

/* 공통 설정 */
* {
  box-sizing: border-box;
  
}
@font-face {
  font-family: 'IBMPlexSansKR';
  src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
}

* {
  font-family: 'IBMPlexSansKR', sans-serif;
}

</style>
