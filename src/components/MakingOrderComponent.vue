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

        <!-- 주문 수량 선택 -->
        <div class="form-group" v-if="selectedMenu">
          <label for="quantity">주문 수량</label>
          <input type="number" id="quantity" v-model="menuQuantity" min="1" required />
        </div>

        <!-- Pickup time -->
        <div class="form-group" v-if="selectedMenu">
          <label for="pickup-time">예약 시간 선택 (30분 단위)</label>
          <input type="datetime-local" id="pickup-time" v-model="pickupTime" @input="validateTime" required />
          <p class="time-adjustment-message" v-if="timeAdjustmentMessage">{{ timeAdjustmentMessage }}</p>
        </div>

        <button type="submit" class="submit-button" :disabled="!isFormValid">예약하기</button>
      </form>
    </div>
  </div>
</template>

<script>
// Firebase 관련 함수들 import
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth 함수
import { ref, set, push, get } from 'firebase/database'; 
import { database } from '@/firebase';
import moment from 'moment-timezone';

export default {
  name: 'MakingOrderComponent',
  data() {
    return {
      categories: ['한식', '중식', '일식', '치킨', '피자', '아시안푸드', '패스트푸드', '양식', '디저트', '건강식'],
      stores: [],
      menus: [],
      selectedCategory: '',
      selectedStore: '',
      selectedMenu: '',
      pickupTime: '',
      menuQuantity: 1,
      timeAdjustmentMessage: ''
    };
  },
  computed: {
    isFormValid() {
      return this.selectedCategory && this.selectedStore && this.selectedMenu && this.pickupTime;
    }
  },
  methods: {
    fetchStores() {
      const storesRef = ref(database, 'store');
      get(storesRef).then((snapshot) => {
        if (snapshot.exists()) {
          const allStores = snapshot.val();
          this.stores = Object.keys(allStores)
            .filter(key => allStores[key].storeType === this.selectedCategory)
            .map(key => ({
              id: key,
              name: allStores[key].storeName,
            }));
        } else {
          this.stores = [];
        }
      }).catch((error) => {
        console.error('가게 목록을 불러오는 데 실패했습니다:', error);
      });

      this.selectedStore = '';
      this.menus = [];
    },
    fetchMenus() {
      const menuRef = ref(database, `store/${this.selectedStore.id}/menu`);
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

      this.selectedMenu = '';
    },
    validateTime() {
      const inputTime = moment.tz(this.pickupTime, 'Asia/Seoul');
      const minutes = inputTime.minutes();
      if (minutes < 15) {
        inputTime.minutes(0);
      } else if (minutes < 45) {
        inputTime.minutes(30);
      } else {
        inputTime.minutes(0).add(1, 'hours');
      }
      this.pickupTime = inputTime.format('YYYY-MM-DDTHH:mm');
      this.timeAdjustmentMessage = `${inputTime.format('HH:mm')}으로 설정되었습니다.`;
    },
    submitOrder() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const createdAt = moment().tz('Asia/Seoul').format();
          const orderRef = ref(database, 'orders');
          const newOrderRef = push(orderRef);
          const orderId = newOrderRef.key;
          const orderData = {
            creatorUid: user.uid,
            createdAt: createdAt,
            storeUid: this.selectedStore.id,
            storeType: this.selectedCategory,
            status: 'pending',
            reservationTime: this.pickupTime
          };
          set(newOrderRef, orderData).then(() => {
            const memberRef = ref(database, `orders/${orderId}/member/${user.uid}`);
            const memberData = {
              menu: this.selectedMenu.name,
              quantity: this.menuQuantity
            };
            set(memberRef, memberData).then(() => {
              alert('주문이 완료되었습니다.');
              this.resetForm();
              this.$emit('orderCreated', orderData);
            }).catch((error) => {
              console.error('주문자 데이터를 저장하는 중 오류 발생:', error);
            });
          }).catch((error) => {
            console.error('주문 정보를 저장하는 중 오류 발생:', error);
          });
        } else {
          alert('로그인이 필요합니다.');
        }
      });
    },
    resetForm() {
      this.selectedCategory = '';
      this.selectedStore = '';
      this.selectedMenu = '';
      this.pickupTime = '';
      this.menuQuantity = 1;
      this.timeAdjustmentMessage = '';
    }
  }
};
</script>

<style scoped>
/* 기존 스타일 유지 */
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  background-color: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
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
  border-color: #4CAF50;
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
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.submit-button:hover {
  background-color: #45a049;
  transform: translateY(-3px);
}
.submit-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}
.time-adjustment-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
