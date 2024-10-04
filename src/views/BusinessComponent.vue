<template>
  <div class="business-component">
    <div class="header">
      <h2>사장님, 환영합니다.</h2>
      <p>가게를 등록해 주세요!</p>
    </div>
    
    <div class="map-section">
      <!-- 여기서 네이버 맵 API를 사용하여 지도를 표시합니다 -->
      <MapComponent />
    </div>
    
    <div class="address-section">
      <h3>사장님 가게 주소 입력</h3>
      
      <!-- 현재 저장된 storeAddress 출력 -->
      <p>현재 저장된 가게 주소: <strong>{{ storeAddress ? storeAddress : '입력 필요' }}</strong></p>

      <div class="address-input">
        <input v-model="newAddress" placeholder="새로운 가게 주소를 입력하세요" />
        <button @click="saveAddress">저장하기</button>
      </div>
    </div>

    <div class="button-section">
      <button @click="navigateTo('business_information')">사업자 정보 등록</button>
      <button @click="navigateTo('business_menu')">메뉴 수정</button>
      <button @click="navigateTo('business_typeselect')">가게 타입 선택</button>
      <button @click="navigateTo('business_advertisement')">광고 신청</button>
    </div>
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';

export default {
  components: {
    MapComponent
  },
  data() {
    return {
      storeAddress: null, // 저장된 가게 주소
      newAddress: ''      // 새로운 가게 주소 입력 필드
    };
  },
  methods: {
    async fetchStoreAddress() {
      const auth = getAuth();
      const db = getDatabase();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const addressRef = ref(db, `users/${user.uid}/storeAddress`);
          onValue(addressRef, (snapshot) => {
            if (snapshot.exists()) {
              this.storeAddress = snapshot.val();
            } else {
              this.storeAddress = '입력 필요';
            }
          });
        }
      });
    },
    async saveAddress() {
      const auth = getAuth();
      const db = getDatabase();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const addressRef = ref(db, `users/${user.uid}/storeAddress`);
          set(addressRef, this.newAddress)
            .then(() => {
              alert('주소가 저장되었습니다.');
              this.storeAddress = this.newAddress;
            })
            .catch((error) => {
              console.error('주소 저장 실패:', error);
            });
        }
      });
    },
    navigateTo(route) {
      this.$router.push({ name: route });
    }
  },
  mounted() {
    this.fetchStoreAddress();
  }
};
</script>

<style scoped>
.business-component {
  text-align: center;
}

.header {
  margin-bottom: 20px;
}

.map-section {
  margin: 20px 0;
}

.address-section {
  margin: 20px 0;
}

.address-input {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.address-input input {
  padding: 10px;
  width: 300px;
  margin-right: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.address-input button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.address-input button:hover {
  background-color: #45a049;
}

.button-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.button-section button {
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.button-section button:hover {
  background-color: #45a049;
}
</style>
