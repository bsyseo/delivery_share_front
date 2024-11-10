<template>
  <div class="business-container">
    <!-- 대시보드 그리드 레이아웃 -->
    <div class="dashboard-grid">
      <!-- Map Introduction Section -->
      <div class="intro-section">
        <h2>Delivery Spot Map</h2>
        <p>Is there a delivery spot nearby?<br>
          Check it out!</p>
        <div class="button-group">
          <router-link to="/" class="custom-button">Home</router-link>
          <router-link to="/store_information" class="custom-button">Store Info</router-link>
          <router-link to="/Order" class="custom-button">Order</router-link>
        </div>
      </div>

      <!-- Map Section -->
      <div class="map-section">
        <MapComponent @select-address="updateSelectedAddress" />
      </div>
    </div>

    <!-- 가게 타입 선택 -->
    <div class="form-section">
      <label for="store-type">가게 타입 선택</label>
      <select id="store-type" v-model="selectedStoreType" @change="saveStoreType" class="material-dropdown">
        <option disabled value="">가게 타입을 선택하세요</option>
        <option value="한식">한식</option>
        <option value="일식">일식</option>
        <option value="치킨">치킨</option>
        <option value="피자">피자</option>
        <option value="아시안푸드">아시안푸드</option>
        <option value="패스트푸드">패스트푸드</option>
        <option value="양식">양식</option>
        <option value="디저트">디저트</option>
        <option value="건강식">건강식</option>
      </select>
    </div>

    <!-- 가게 주소 입력 -->
    <div class="form-section">
      <label for="address">사장님 가게 주소 입력</label>
      <p>현재 저장된 가게 주소: <strong>{{ storeAddress ? storeAddress : '입력 필요' }}</strong></p>
      <div class="address-input">
        <input id="address" v-model="newAddress" placeholder="새로운 가게 주소를 입력하세요" />
        <button @click="saveAddress" class="save-button">저장하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';
import { auth, database } from '@/firebase';

export default {
  name: 'BusinessComponent',
  components: {
    MapComponent
  },
  data() {
    return {
      newAddress: '', 
      selectedStoreType: '', 
      storeAddress: null
    };
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, 'users/' + user.uid + '/name');
        onValue(userRef, (snapshot) => {
          this.userName = snapshot.val();
        });
      }
    });

    this.loadStoreAddress();
    this.loadStoreType();
  },
  methods: {
    loadStoreAddress() {
      const auth = getAuth();
      const db = getDatabase();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const addressRef = ref(db, `store/${user.uid}/store_address`);
          get(addressRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                this.storeAddress = snapshot.val(); 
              } else {
                this.storeAddress = null; 
              }
            })
            .catch((error) => {
              console.error('주소를 불러오는 중 오류 발생:', error);
              this.storeAddress = null;
            });
        }
      });
    },
    saveAddress() {
      const auth = getAuth();
      const db = getDatabase();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const addressRef = ref(db, `store/${user.uid}/store_address`);
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
    saveStoreType() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const typeRef = ref(database, `store/${user.uid}/storeType`);
          set(typeRef, this.selectedStoreType)
            .then(() => {
              alert('가게 타입이 저장되었습니다.');
            })
            .catch((error) => {
              console.error('가게 타입 저장 실패:', error);
            });
        }
      });
    },
    loadStoreType() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const typeRef = ref(database, `store/${user.uid}/storeType`);
          get(typeRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                this.selectedStoreType = snapshot.val();
              }
            });
        }
      });
    },
    updateSelectedAddress(address) {
      this.newAddress = address;
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'IBMPlexSansKR';
  src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
}

* {
  font-family: 'IBMPlexSansKR', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.business-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.intro-section {
  padding: 40px;
  background-color: #f4f3fd;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 텍스트 중앙 정렬 */
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.intro-section h2 {
  font-size: 28px;
  color: #4a4a68;
  font-weight: bold;
}

.intro-section p {
  font-size: 16px;
  color: #6c6c8c;
  margin-top: 8px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.custom-button {
  background-color: #5b34b1;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #3e2196;
}

.map-section {
  padding: 20px;
  border-radius: 16px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-section label {
  font-size: 16px;
  font-weight: 500;
  color: #4a4a68;
}

.material-dropdown {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  appearance: none;
  background-color: #f9f9f9;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236c6c8c"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  transition: border-color 0.3s ease;
}

.material-dropdown:focus {
  border-color: #5b34b1;
}

.address-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.address-input input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  flex: 1;
  transition: border-color 0.3s ease;
}

.address-input input:focus {
  border-color: #5b34b1;
}

.save-button {
  padding: 10px 16px;
  background-color: #5b34b1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #3e2196;
}
</style>