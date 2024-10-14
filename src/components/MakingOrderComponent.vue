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
import { ref, set, push, get } from 'firebase/database'; // Firebase Database 함수에 get 추가
import { database } from '@/firebase'; // Firebase 설정 파일 경로
import moment from 'moment-timezone';

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
      menuQuantity: 1,      // 주문 수량 기본값 추가
      timeAdjustmentMessage: '' // 예약 시간 변경 시 알림 메시지
    };
  },
  computed: {
    isFormValid() {
      return this.selectedCategory && this.selectedStore && this.selectedMenu && this.pickupTime;
    }
  },
  methods: {
    fetchStores() {
      // Firebase에서 store 데이터를 가져와서 선택된 카테고리와 일치하는 가게를 필터링
      const storesRef = ref(database, 'store');
      get(storesRef).then((snapshot) => {
        if (snapshot.exists()) {
          const allStores = snapshot.val();
          // 모든 store를 탐색하면서 storeType이 선택한 카테고리와 일치하는 가게를 필터링
          this.stores = Object.keys(allStores)
            .filter(key => allStores[key].storeType === this.selectedCategory)
            .map(key => ({
              id: key,
              name: allStores[key].storeName, // storeName 사용
              phone: allStores[key].contact,  // 필요에 따라 추가 정보도 가져옴
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

      this.selectedMenu = ''; // 기존 선택을 초기화
    },
    validateTime() {
      const inputTime = moment.tz(this.pickupTime, 'Asia/Seoul');

      // 분을 30분 단위로 맞추기
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
      const auth = getAuth(); // Firebase Auth를 이용해 사용자 확인
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // 현재 한국 시각을 반영한 시각 저장
          const createdAt = moment().tz('Asia/Seoul').format(); // 한국 시각으로 설정된 주문 생성 시각

          // 임의의 주문 번호를 생성
          const orderRef = ref(database, 'orders');
          const newOrderRef = push(orderRef); // 임의의 주문 번호 생성
          const orderId = newOrderRef.key; // 생성된 주문 번호 가져오기

          // 주문 데이터 구성
          const orderData = {
            creatorUid: user.uid, // 주문 생성자 UID
            createdAt: createdAt, // 주문 생성 시각 (한국 시각)
            storeUid: this.selectedStore.id, // 가게의 UID
            storeType: this.selectedCategory, // 카테고리 선택에서 입력된 값을 storeType으로 저장
            status: 'pending', // 주문 상태
            reservationTime: this.pickupTime // 예약 시간 추가
          };

          // 주문 정보 저장
          set(newOrderRef, orderData)
            .then(() => {
              console.log(`주문 정보가 저장되었습니다. 주문 번호: ${orderId}`);

              // member 테이블에 데이터 저장
              this.saveMember(user.uid, orderId, this.selectedMenu.name, this.menuQuantity);
            })
            .catch((error) => {
              console.error('주문 정보를 저장하는 중 오류 발생:', error);
            });
        } else {
          alert('로그인이 필요합니다.');
        }
      });
    },
    
    // member 테이블에 데이터를 저장하는 함수
    saveMember(uid, orderId, menu, quantity) {
      // member 테이블에 임의의 memberID를 생성하여 저장
      const memberRef = ref(database, 'member');
      const newMemberRef = push(memberRef); // 새로운 memberID 생성
      const memberId = newMemberRef.key; // 생성된 memberID 가져오기

      // member 데이터 구성
      const memberData = {
        uid: uid, // 사용자의 uid
        orderID: orderId, // 해당 주문의 ID
        menu: menu, // 선택된 메뉴
        quantity: quantity // 주문 수량
      };

      // member 테이블에 데이터 저장
      set(newMemberRef, memberData)
        .then(() => {
          console.log(`member 데이터가 저장되었습니다. member ID: ${memberId}`);
          alert('주문이 완료되었습니다.');
          this.resetForm(); // 폼 초기화
        })
        .catch((error) => {
          console.error('member 데이터를 저장하는 중 오류 발생:', error);
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

.time-adjustment-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
