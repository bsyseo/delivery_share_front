<template>
  <div class="wrapper">
    <div class="making-order-form">
      <form @submit.prevent="submitOrder">
        <!-- Category selection -->
        <div class="form-group">
          <label for="category">카테고리 선택</label>
          <select id="category" v-model="selectedCategory" @change="fetchStores">
            <option value="">카테고리를 선택하세요</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>

        <!-- Store selection -->
        <div class="form-group" v-if="selectedCategory">
          <label for="store">가게 선택</label>
          <select id="store" v-model="selectedStore" @change="fetchMenus">
            <option value="">가게를 선택하세요</option>
            <option v-for="store in stores" :key="store.id" :value="store">{{ store.name }}</option>
          </select>
        </div>

        <!-- Menu selection -->
        <div class="form-group" v-if="selectedStore">
          <label for="menu">메뉴 선택</label>
          <select id="menu" v-model="selectedMenu">
            <option value="">메뉴를 선택하세요</option>
            <option v-for="menu in menus" :key="menu.id" :value="menu">{{ menu.name }}</option>
          </select>
        </div>

        <!-- Pickup time -->
        <div class="form-group" v-if="selectedMenu">
          <label for="pickup-time">예약 시간 선택</label>
          <input type="datetime-local" id="pickup-time" v-model="pickupTime" required />
        </div>

        <button type="submit" class="submit-button" :disabled="!isFormValid">예약하기</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, get } from 'firebase/database';
import { database } from '@/firebase'; // Firebase 설정 파일 경로

export default {
  name: 'MakingOrderComponent',
  data() {
    return {
      categories: ['한식', '중식', '일식', '치킨', '피자', '아시안푸드', '패스트푸드', '양식', '디저트', '건강식'],
      stores: [], // 가게 목록
      menus: [],  // 선택된 가게의 메뉴 목록
      selectedCategory: '', // 선택된 카테고리
      selectedStore: '',    // 선택된 가게
      selectedMenu: '',     // 선택된 메뉴
      pickupTime: '',       // 예약 시간
    };
  },
  computed: {
    isFormValid() {
      return this.selectedCategory && this.selectedStore && this.selectedMenu && this.pickupTime;
    }
  },
  methods: {
    fetchStores() {
      // Firebase에서 모든 사용자 데이터를 가져온 후, 선택된 카테고리와 일치하는 가게를 필터링
      const usersRef = ref(database, 'users');
      get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
          const allUsers = snapshot.val();
          // 모든 사용자를 탐색하면서 storeType이 선택한 카테고리와 일치하는 가게를 필터링
          this.stores = Object.keys(allUsers)
            .filter(key => allUsers[key].storeInfo && allUsers[key].storeInfo.storeType === this.selectedCategory)
            .map(key => ({
              id: key,
              name: allUsers[key].storeInfo.storeName, // storeInfo에 저장된 storeName 사용
              phone: allUsers[key].phone, // 필요에 따라 추가 정보도 가져옴
            }));
        } else {
          this.stores = [];
        }
      }).catch((error) => {
        console.error('가게 목록을 불러오는 데 실패했습니다:', error);
      });

      this.selectedStore = ''; // 기존 선택을 초기화
      this.menus = [];
    },
    fetchMenus() {
      // Firebase에서 선택된 가게의 메뉴를 가져오는 로직
      const menuRef = ref(database, `users/${this.selectedStore.id}/menus`);
      get(menuRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.menus = Object.keys(snapshot.val()).map(key => ({
            id: key,
            ...snapshot.val()[key]
          }));
        } else {
          this.menus = [];
        }
      }).catch((error) => {
        console.error('메뉴 목록을 불러오는 데 실패했습니다:', error);
      });

      this.selectedMenu = ''; // 기존 선택을 초기화
    },
    submitOrder() {
      console.log('주문 세부 정보:', this.selectedCategory, this.selectedStore.storeName, this.selectedMenu.name);
      console.log('예약 시간:', this.pickupTime);

      // 주문 데이터 처리 로직
      this.$emit('orderSubmitted', {
        category: this.selectedCategory,
        store: this.selectedStore.storeName, // storeName 사용
        menu: this.selectedMenu.name,
        time: this.pickupTime
      });

      alert('주문 예약이 완료되었습니다.');
    }
  }
};
</script>

<style scoped>
/* 스타일 부분은 기존 코드와 동일하게 유지 */
.wrapper {
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  height: 100vh; /* 화면 전체 높이를 차지 */
}

.making-order-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  background-color: #BFDC99;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.form-group {
  background-color: white; /* 각 입력 폼의 배경을 하얗게 */
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  margin-bottom: 20px;
  width: 100%;
}

label {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  margin-top: 10px;
  box-sizing: border-box;
}

input:focus, select:focus, textarea:focus {
  border-color: #4CAF50; /* 초록색 포커스 테두리 */
  outline: none;
}

.submit-button {
  padding: 12px;
  margin-top: 15px;
  
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.submit-button:hover {
  background-color: #45a049;
  transform: translateY(-3px); /* 버튼이 살짝 떠오르는 효과 */
}

.submit-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}
</style>
