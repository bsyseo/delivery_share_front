<template>
  <div class="wrapper">
    <div class="making-order-form">
      <!-- 제목 섹션 -->
      <div class="header-section">
        <h1 class="dashboard-title">Making Order</h1>
        <p class="description-text">Select Categories, Stores, & Menus</p>
      </div>

      <!-- 주문 폼 -->
      <form @submit.prevent="initiatePayment">
        <!-- Category selection -->
        <div class="form-group">
          <label for="category" class="input-label">카테고리</label>
          <select id="category" v-model="selectedCategory" @change="fetchStores" class="input-field">
            <option value="">카테고리를 선택하세요</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>

        <!-- Store selection -->
        <div class="form-group">
          <label for="store" class="input-label">가게</label>
          <select id="store" v-model="selectedStore" @change="fetchMenusAndDeliveryFee" class="input-field">
            <option value="">가게를 선택하세요</option>
            <option v-for="store in stores" :key="store.id" :value="store">{{ store.name }}</option>
          </select>
        </div>

        <!-- Menu selection -->
        <div class="form-group">
          <label for="menu" class="input-label">메뉴</label>
          <select id="menu" v-model="selectedMenu" class="input-field">
            <option value="">메뉴를 선택하세요</option>
            <option v-for="menu in menus" :key="menu.id" :value="menu">{{ menu.name }} - {{ menu.price }}원</option>
          </select>
        </div>

        <!-- Pickup Zone selection -->
        <div class="form-group">
          <label for="pickup-zone" class="input-label">픽업존</label>
          <select id="pickup-zone" v-model="selectedPickupZone" class="input-field">
            <option value="">픽업존을 선택하세요</option>
            <option v-for="zone in pickupZones" :key="zone.id" :value="zone.detail">{{ zone.detail }}</option>
          </select>
        </div>

        <!-- Display the selected menu price -->
        <div class="price-display">
          <p>선택 메뉴 가격: {{ selectedMenu.price }}원</p>
        </div>

        <!-- Display the delivery fee -->
        <div class="price-display">
          <p>배달비: {{ deliveryFee }}원</p>
          <p>무료 배달 인원: {{ desiredParticipants }}명</p>
        </div>

        <!-- 주문 수량 선택 -->
        <div class="form-group">
          <label for="quantity" class="input-label">수량</label>
          <input type="number" id="quantity" v-model="menuQuantity" min="1" required class="input-field" />
        </div>

        <!-- 희망 인원 -->
        <div class="form-group">
          <label for="desired-participants" class="input-label">희망 인원</label>
          <input type="number" id="desired-participants" v-model="desiredParticipants" min="1" required class="input-field" />
        </div>

        <!-- 희망 마감 시간 -->
        <div class="form-group">
          <label for="desired-end-time" class="input-label">희망 마감 시간</label>
          <input type="datetime-local" id="desired-end-time" v-model="desiredEndTime" required class="input-field" />
        </div>

        <!-- Pickup time -->
        <div class="form-group">
          <label for="pickup-time" class="input-label">예약 시간</label>
          <input type="datetime-local" id="pickup-time" v-model="pickupTime" @input="validateTime" required class="input-field" />
          <p v-if="timeAdjustmentMessage" class="time-message">{{ timeAdjustmentMessage }}</p>
        </div>

        <button type="submit" class="submit-button" :disabled="!isFormValid">결제 및 예약하기</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
      pickupZones: [], // 픽업존 데이터를 저장할 배열
      selectedCategory: '',
      selectedStore: '',
      selectedMenu: '',
      selectedPickupZone: '', // 선택된 픽업존
      deliveryFee: 0,
      pickupTime: '',
      desiredParticipants: 0, // 희망 인원
      desiredEndTime: '', // 희망 마감 시간
      menuQuantity: 1,
      timeAdjustmentMessage: '',
    };
  },
  computed: {
    // 폼 유효성 검사
    isFormValid() {
      return (
        this.selectedCategory &&
        this.selectedStore &&
        this.selectedMenu &&
        this.selectedPickupZone &&
        this.pickupTime &&
        this.desiredParticipants &&
        this.desiredEndTime
      );
    },
  },
  mounted() {
    // 컴포넌트가 로드되면 가게 데이터와 픽업존 가져오기
    this.fetchStores();
    this.fetchPickupZones();
  },
  methods: {
    // 픽업존 데이터 가져오기
    fetchPickupZones() {
      const pickupZonesRef = ref(database, 'pickupZones');
      get(pickupZonesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const zones = snapshot.val();
            this.pickupZones = Object.keys(zones).map((key) => ({
              id: key,
              ...zones[key],
            }));
          } else {
            this.pickupZones = [];
          }
        })
        .catch((error) => {
          console.error('픽업존 데이터를 가져오는 데 실패했습니다:', error);
        });
    },

    // 카테고리에 따라 가게 가져오기
    fetchStores() {
      const storesRef = ref(database, 'store');
      get(storesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const allStores = snapshot.val();
            this.stores = Object.keys(allStores)
              .filter((key) => allStores[key].storeType === this.selectedCategory)
              .map((key) => ({
                id: key,
                name: allStores[key].storeName,
                address: allStores[key].address,
                phone: allStores[key].contact,
              }));
          } else {
            this.stores = [];
          }
        })
        .catch((error) => {
          console.error('가게 데이터를 가져오는 데 실패했습니다:', error);
        });
    },

    // 가게 선택에 따른 메뉴와 배달비 가져오기
    fetchMenusAndDeliveryFee() {
      const menuRef = ref(database, `store/${this.selectedStore.id}/menu`);
      get(menuRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.menus = Object.keys(snapshot.val()).map((key) => ({
              id: key,
              ...snapshot.val()[key],
              price: snapshot.val()[key].price,
            }));
          } else {
            this.menus = [];
          }
        })
        .catch((error) => {
          console.error('메뉴 데이터를 가져오는 데 실패했습니다:', error);
        });

      const storeRef = ref(database, `store/${this.selectedStore.id}`);
      get(storeRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const storeData = snapshot.val();
            this.deliveryFee = storeData.deliveryFee || 0;
            this.desiredParticipants = storeData.desiredParticipants || 0;
          } else {
            this.deliveryFee = 0;
            this.desiredParticipants = 0;
          }
        })
        .catch((error) => {
          console.error('배달비 및 희망 인원 데이터를 가져오는 데 실패했습니다:', error);
        });
    },

    // 시간 유효성 검사 및 조정
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

    // 결제 요청
    initiatePayment() {
      const totalAmount = this.selectedMenu.price * this.menuQuantity;

      var IMP = window.IMP;
      IMP.init('imp75487318'); // 아임포트 PG 초기화
      IMP.request_pay(
        {
          pg: 'html5_inicis',
          pay_method: 'card',
          merchant_uid: `order_${new Date().getTime()}`,
          amount: totalAmount,
          name: this.selectedMenu.name,
          buyer_name: '테스트 사용자',
          buyer_tel: '010-1234-5678',
          buyer_email: 'test@example.com',
        },
        (rsp) => {
          if (rsp.success) {
            this.submitOrder();
          } else {
            alert(`결제에 실패했습니다: ${rsp.error_msg}`);
          }
        }
      );
    },

    // 주문 저장
    async submitOrder() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const createdAt = moment().tz('Asia/Seoul').format();
          const reservationTime = moment.tz(this.pickupTime, 'Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ');
          const desiredEndTimeFormatted = moment.tz(this.desiredEndTime, 'Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ');
          const orderRef = ref(database, 'orders');
          const newOrderRef = push(orderRef);

          const orderData = {
            creatorUid: user.uid,
            createdAt: createdAt,
            storeUid: this.selectedStore.id,
            storeType: this.selectedCategory,
            pickupZone: this.selectedPickupZone,
            status: 'reserved',
            reservationTime: reservationTime,
            desiredParticipants: this.desiredParticipants,
            desiredEndTime: desiredEndTimeFormatted,
            participantsCount: 1,
            menu: this.selectedMenu.name,
            price: this.selectedMenu.price,
            quantity: this.menuQuantity,
            deliveryFee: this.deliveryFee,
          };

          await set(newOrderRef, orderData);

          this.saveMember(
            user.uid,
            newOrderRef.key,
            this.selectedMenu.name,
            this.selectedMenu.price,
            this.menuQuantity,
            this.selectedPickupZone
          );
        } else {
          alert('로그인이 필요합니다.');
        }
      });
    },

    // 참여자를 member 데이터베이스에 저장
    saveMember(uid, orderId, menu, price, quantity, pickupZone) {
      const memberRef = ref(database, 'member');
      const newMemberRef = push(memberRef);

      const participateTime = moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ');

      const memberData = {
        uid: uid,
        orderID: orderId,
        menu: menu,
        price: price,
        quantity: quantity,
        participate_time: participateTime,
        pickupZone: pickupZone || '픽업존 정보 없음',
      };

      set(newMemberRef, memberData)
        .then(() => {
          console.log(`Member saved successfully. Member ID: ${newMemberRef.key}`);
        })
        .catch((error) => {
          console.error('Error saving member data:', error);
        });
    },

    // 폼 초기화
    resetForm() {
      this.selectedCategory = '';
      this.selectedStore = '';
      this.selectedMenu = '';
      this.pickupTime = '';
      this.desiredParticipants = 0;
      this.desiredEndTime = '';
      this.menuQuantity = 1;
      this.timeAdjustmentMessage = '';
      this.selectedPickupZone = '';
    },
  },
};
</script>


<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
}

.making-order-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: rgba(255, 255, 255, 0.4); /* 반투명 효과 */
  backdrop-filter: blur(12px); /* 배경 흐림 효과 */
  border-radius: 20px;
  padding: 32px;
  width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* 입체적인 그림자 */
}

.header-section {
  text-align: center;
  margin-bottom: 24px;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  margin-bottom: 8px;
}

.description-text {
  font-size: 1.1rem;
  color: #666;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 6px;
  font-weight: 500;
}

.input-field {
  padding: 12px;
  font-size: 1rem;
  color: #333;
  border: 1px solid rgba(200, 200, 255, 0.6);
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.6); /* 반투명 효과 */
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 500px;
  margin-left: 50px;
}

.input-field:focus {
  border-color: #6750A4;
  box-shadow: 0 4px 10px rgba(103, 80, 164, 0.2); /* 포커스 시 강조 */
}

.price-display p {
  font-size: 0.9rem;
  color: #555;
}

.time-message {
  font-size: 0.85rem;
  color: #888;
  margin-top: 6px;
}

.submit-button {
  padding: 12px;
  background-color: #6750A4;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 14px rgba(103, 80, 164, 0.3); 
  margin-top: 3vh;
}

.submit-button:hover {
  background-color: #7F67BE;
  box-shadow: 0 8px 16px rgba(103, 80, 164, 0.4);
}

.submit-button:disabled {
  background-color: #D1C4E9;
  cursor: not-allowed;
}
</style>