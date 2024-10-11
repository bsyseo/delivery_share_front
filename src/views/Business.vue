<template>
  <div>
    <!-- BusinessComponent에 storeAddress와 이벤트를 전달 -->
    <BusinessComponent :storeAddress="storeAddress" @update-address="updateStoreAddress" />
  </div>
</template>

<script>
import BusinessComponent from '@/components/BusinessComponent.vue';
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
          const addressRef = ref(db, `users/${user.uid}/storeAddress`); // 백틱으로 수정
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
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFL.OTF') format('opentype');
}

.head {

  font-family: 'NanumSquareRound', sans-serif;
}
</style>