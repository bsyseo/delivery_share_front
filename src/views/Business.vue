<template>
  <div class="business-view-container">
    <!-- BusinessComponent에 storeAddress와 이벤트를 전달 -->
    <BusinessComponent :storeAddress="storeAddress" @update-address="updateStoreAddress" />
  </div>
</template>

<script>
import BusinessComponent from '@/components/User/BusinessComponent.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

export default {
  name: 'BusinessView',
  components: {
    BusinessComponent
  },
  data() {
    return {
      storeAddress: null // 저장된 가게 주소
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
    updateStoreAddress(newAddress) {
      this.storeAddress = newAddress; // 자식 컴포넌트로부터 받은 새로운 주소 업데이트
    }
  },
  mounted() {
    this.fetchStoreAddress();
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
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.business-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
}

.business-view-container h2 {
  font-size: 28px;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
}

.business-view-container p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.button-section {
  display: flex;
  gap: 16px;
}

.button-section button {
  background-color: #007aff;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-section button:hover {
  background-color: #0063cc;
}

.input-field {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 8px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007aff;
  outline: none;
}

.error-message {
  color: #e84118;
  font-size: 14px;
  margin-top: 4px;
}

.nav-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.nav-buttons button {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.nav-buttons .previous-button {
  background-color: #f1f3f5;
  color: #222;
}

.nav-buttons .next-button {
  background-color: #007aff;
  color: white;
}

.nav-buttons .previous-button:hover {
  background-color: #e9ecef;
}

.nav-buttons .next-button:hover {
  background-color: #0063cc;
}
</style>
