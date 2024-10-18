<template>
  <div class="wrapper">
    <div class="top-navigation">
      <button class="nav-button" @click="$router.push('/')">홈 화면으로 돌아가기</button>
      <button class="nav-button" @click="$router.push('/order')">주문 페이지로 돌아가기</button>
    </div>

    <div class="rounded-inner-drop-shadow-box making-order-form">
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
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const createdAt = moment().tz('Asia/Seoul').format();
          const reservationTime = moment.tz(this.pickupTime, 'Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ');  // 웹에서 입력한 예약 시간도 한국 시간으로 변환
          const orderRef = ref(database, 'orders');
          const newOrderRef = push(orderRef);
          const orderId = newOrderRef.key;

          const orderData = {
            creatorUid: user.uid,
            createdAt: createdAt,
            storeUid: this.selectedStore.id,
            storeType: this.selectedCategory,
            status: 'pending',
            reservationTime: reservationTime,  // 한국 시간으로 변환된 예약 시간
            participantsCount: 1,
          };

          // `orders/` 경로에 저장
          set(newOrderRef, orderData)
            .then(() => {
              // `member/` 경로에 참여자 정보 저장
              this.saveMember(user.uid, orderId, this.selectedMenu.name, this.menuQuantity);
            })
            .catch((error) => {
              console.error('Error saving the order:', error);
            });
        } else {
          alert('로그인이 필요합니다.');
        }
      });
    },
    
    // member 테이블에 데이터를 저장하는 함수
    saveMember(uid, orderId, menu, quantity) {
      const memberRef = ref(database, 'member');
      const newMemberRef = push(memberRef);
      
      // 현재 한국 시각으로 participate_time 설정
      const participateTime = moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ');
      
      const memberData = {
        uid: uid,  // 사용자의 UID
        orderID: orderId,  // 해당 주문의 ID
        menu: menu,  // 선택된 메뉴
        quantity: quantity,  // 주문 수량
        participate_time: participateTime,  // 참여 시각 (한국 시각)
      };

      // `member/` 경로에 저장
      set(newMemberRef, memberData)
        .then(() => {
          console.log(`Member saved successfully. Member ID: ${newMemberRef.key}`);
        })
        .catch((error) => {
          console.error('Error saving member data:', error);
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
.wrapper {
  background: #B2D8B6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
}

.top-navigation {
  width: 50%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #EFFAD6;
  border-radius: 10px;
  margin-bottom: 3vh;
}

.nav-button {
  background-color: #A3C09A;
  color: #FFF;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: #8FB28A;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.making-order-form {
  background-color: #F3F6ED;
  border-radius: 20px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  transition: transform 0.3s ease;
}

.making-order-form:hover {
  transform: scale(1.02);
}

.form-group {
  margin-bottom: 24px;
  text-align: left;
}

label {
  display: block;
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
  font-weight: 600;
}

select, input[type="number"], input[type="datetime-local"] {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #C8E6C9;
  border-radius: 10px;
  background-color: #F3F6ED;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  transition: all 0.3s ease;
  appearance: none;
  outline: none;
}

select:hover, input[type="number"]:hover, input[type="datetime-local"]:hover {
  background-color: #EFFAD6;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
}

select:focus, input[type="number"]:focus, input[type="datetime-local"]:focus {
  border-color: #A3C09A;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}

select option {
  background-color: #FFFFFF;
  color: #333;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* select 아이콘 커스터마이즈 (콤보박스의 화살표) */
select {
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23333" d="M2 0L0 2h4z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px;
}

.submit-button {
  background-color: #A3C09A;
  color: #FFF;
  border: none;
  border-radius: 10px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
  background-color: #8FB28A;
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

.submit-button:disabled {
  background-color: #A5D6A7;
  cursor: not-allowed;
}

.time-adjustment-message {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

* {
  font-family: 'NanumSquareRound', sans-serif;
  box-sizing: border-box;
}

</style>