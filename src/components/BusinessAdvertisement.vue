<template>
  <div class="business-advertisement-container">
    <h1>사업자 광고 신청 페이지</h1>
    
    <form @submit.prevent="submitAdvertisement">
      <!-- 광고주 이름 -->
      <div class="form-group">
        <label for="business-name">광고주 이름</label>
        <input type="text" id="business-name" v-model="businessName" placeholder="광고주 이름을 입력하세요" required />
      </div>

      <!-- 연락처 -->
      <div class="form-group">
        <label for="contact">연락처</label>
        <input type="tel" id="contact" v-model="contact" placeholder="010-0000-0000" required />
      </div>

      <!-- 사업자 등록번호 -->
      <div class="form-group">
        <label for="registration-number">사업자 등록번호</label>
        <input type="text" id="registration-number" v-model="registrationNumber" placeholder="등록번호를 입력하세요" required />
      </div>

      <!-- 광고 유형 선택 -->
      <div class="form-group">
        <label for="ad-type">광고 유형</label>
        <select id="ad-type" v-model="adType" @change="calculateBudget" required>
          <option value="" disabled>광고 유형을 선택하세요</option>
          <option value="banner">배너 광고 (10% 추가)</option>
          <option value="popup">팝업 광고 (20% 추가)</option>
          <option value="search">검색 광고 (5% 추가)</option>
        </select>
      </div>

      <!-- 광고 노출 기간 -->
      <div class="form-group">
        <label for="ad-duration">광고 노출 기간</label>
        <select id="ad-duration" v-model="adDuration" @change="calculateBudget" required>
          <option value="" disabled>광고 기간을 선택하세요</option>
          <option value="1week">1주일</option>
          <option value="1month">1개월</option>
          <option value="3months">3개월</option>
        </select>
      </div>

      <!-- 광고 이미지 업로드 -->
      <div class="form-group">
        <label for="ad-image">광고 이미지 업로드</label>
        <input type="file" id="ad-image" @change="handleFileUpload" accept="image/*" required />
        <div v-if="adImagePreview" class="preview-container">
          <img :src="adImagePreview" alt="광고 이미지 미리보기" class="preview-image" />
        </div>
      </div>

      <!-- 광고 링크 -->
      <div class="form-group">
        <label for="ad-link">광고 링크</label>
        <input type="url" id="ad-link" v-model="adLink" placeholder="광고 클릭 시 연결될 링크(URL)를 입력하세요" required />
      </div>

      <!-- 광고 메시지 -->
      <div class="form-group">
        <label for="ad-message">광고 메시지</label>
        <textarea id="ad-message" v-model="adMessage" placeholder="광고 메시지를 입력하세요" required></textarea>
      </div>

      <!-- 결제 정보 -->
      <div class="form-group">
        <label for="payment-method">결제 방법</label>
        <select id="payment-method" v-model="paymentMethod" required>
          <option value="" disabled>결제 방법을 선택하세요</option>
          <option value="credit-card">신용카드</option>
          <option value="bank-transfer">계좌이체</option>
        </select>
      </div>

      <!-- 자동 갱신 여부 -->
      <div class="form-group">
        <label for="auto-renew">자동 갱신 여부</label>
        <input type="checkbox" id="auto-renew" v-model="autoRenew" @change="calculateBudget" /> 자동 갱신 (10% 추가)
      </div>

      <!-- 약관 동의 -->
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="termsAgreed" required />
          광고 신청 약관에 동의합니다.
        </label>
      </div>

      <!-- 총 금액 표시 -->
      <div class="total-budget">
        <label for="ad-budget">예상 광고 예산:</label>
        <input type="text" id="ad-budget" :value="adBudget" readonly />
      </div>

      <!-- 등록 버튼 -->
      <button type="submit" class="submit-button">광고 신청</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'BusinessAdvertisement',
  data() {
    return {
      businessName: '',
      contact: '',
      registrationNumber: '',
      adType: '',
      adDuration: '',
      adBudget: '0원', // 초기 값을 '0원'으로 설정
      adImage: null,
      adImagePreview: null,
      adLink: '',
      adMessage: '',
      paymentMethod: '',
      autoRenew: false,
      termsAgreed: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.adImage = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.adImagePreview = e.target.result;
        };
      }
    },
    calculateBudget() {
      let basePrice = 0;

      // 광고 기간에 따른 기본 가격 설정
      if (this.adDuration === '1week') {
        basePrice = 50000;
      } else if (this.adDuration === '1month') {
        basePrice = 150000;
      } else if (this.adDuration === '3months') {
        basePrice = 400000;
      }

      // 광고 유형에 따른 추가 비용 설정
      let typeMultiplier = 1;
      if (this.adType === 'banner') {
        typeMultiplier = 1.1; // 배너 광고 10% 추가
      } else if (this.adType === 'popup') {
        typeMultiplier = 1.2; // 팝업 광고 20% 추가
      } else if (this.adType === 'search') {
        typeMultiplier = 1.05; // 검색 광고 5% 추가
      }

      // 자동 갱신 여부에 따른 추가 비용
      let renewalMultiplier = this.autoRenew ? 1.1 : 1; // 자동 갱신 10% 추가

      // 최종 금액 계산
      const finalPrice = basePrice * typeMultiplier * renewalMultiplier;
      this.adBudget = finalPrice.toLocaleString() + '원'; // 계산된 금액을 문자열로 표시
    },
    submitAdvertisement() {
      if (this.termsAgreed) {
        const adData = {
          businessName: this.businessName,
          contact: this.contact,
          registrationNumber: this.registrationNumber,
          adType: this.adType,
          adDuration: this.adDuration,
          adBudget: this.adBudget,
          adLink: this.adLink,
          adMessage: this.adMessage,
          paymentMethod: this.paymentMethod,
          autoRenew: this.autoRenew,
        };
        console.log('광고 신청 데이터:', adData);
        alert('광고 신청이 완료되었습니다.');
        // 여기에서 Firebase나 다른 서버에 데이터를 전송하는 코드를 추가할 수 있습니다.
      } else {
        alert('약관에 동의해야 광고 신청을 완료할 수 있습니다.');
      }
    },
  },
};
</script>

<style scoped>
.business-advertisement-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 15px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.total-budget {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.total-budget label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group {
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
input[type="file"],
input[type="url"],
textarea,
select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;
}

textarea {
  resize: vertical;
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
  padding: 12px;
  font-size: 18px;
  background-color: #BFDC99;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25); /* drop shadow */
  color: #2d2d2d;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
}

.submit-button:hover {
  background-color: #BFDC99;
}
</style>
