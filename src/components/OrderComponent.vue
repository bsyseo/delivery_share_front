<template>
  <div class="main-container">
    <div class="rounded-inner-drop-shadow-box">
      <slot>
        <div class="order-box">
          <!-- 첫째 줄 이미지 -->
          <div class="image-grid">
            <div class="image-item" @click="showMenuDetails('한식')">
              <img src="@/assets/free-icon-bibimbap-2276931.png" alt="한식" />
              <p>한식</p>
            </div>
            <div class="image-item" @click="showMenuDetails('중식')">
              <img src="@/assets/free-icon-chinese-food-3449347.png" alt="중식" />
              <p>중식</p>
            </div>
            <div class="image-item" @click="showMenuDetails('일식')">
              <img src="@/assets/sushi_1f363.png" alt="일식" />
              <p>일식</p>
            </div>
            <div class="image-item" @click="showMenuDetails('치킨')">
              <img src="@/assets/poultry-leg_1f357.png" alt="치킨" />
              <p>치킨</p>
            </div>
            <div class="image-item" @click="showMenuDetails('피자')">
              <img src="@/assets/pizza_1f355.png" alt="피자" />
              <p>피자</p>
            </div>
          </div>

          <!-- 둘째 줄 이미지 -->
          <div class="image-grid">
            <div class="image-item" @click="showMenuDetails('아시안푸드')">
              <img src="@/assets/cooked-rice_1f35a.png" alt="아시안푸드" />
              <p>아시안푸드</p>
            </div>
            <div class="image-item" @click="showMenuDetails('패스트푸드')">
              <img src="@/assets/hamburger_1f354.png" alt="패스트푸드" />
              <p>패스트푸드</p>
            </div>
            <div class="image-item" @click="showMenuDetails('양식')">
              <img src="@/assets/spaghetti_1f35d.png" alt="양식" />
              <p>양식</p>
            </div>
            <div class="image-item" @click="showMenuDetails('디저트')">
              <img src="@/assets/shortcake_1f370.png" alt="디저트" />
              <p>디저트</p>
            </div>
            <div class="image-item" @click="showMenuDetails('건강식')">
              <img src="@/assets/green-salad_1f957.png" alt="건강식" />
              <p>건강식</p>
            </div>
          </div>
        </div>

        <div class="option">
          <div class="button-option">
            <button class="button green" @click="$router.push({ name: 'MakingOrder' })">예약 만들기</button>
            <button class="button green">가게 검색</button>
          </div>
        </div>

        <!-- 초록색 박스 내부의 네모 버튼 -->
        <div class="order-box2">
          <div class="white-box"></div>
        </div>

        <!-- 로고 박스와 타임 박스를 한 쌍으로 표시 -->
        <div v-if="selectedMenu" class="logo-time-wrapper">
          <div v-for="(orderList, storeUid) in orders" :key="storeUid" class="logo-time-pair">
            <!-- 상단 로고 박스 -->
            <div class="logo-box">
              <img v-if="logos[storeUid]" :src="logos[storeUid]" alt="Store Logo" />
              <div v-else>로고 없음</div>
            </div>

            <!-- 하단 시간표 박스 -->
            <div class="time-box">
              <p v-for="order in orderList.slice(0, 4)" :key="order.id" @click="showPopup(order)">
                {{ formatReservationTime(order.reservationTime) || '시간 없음' }}
              </p>
              <div v-if="orderList.length > 4" class="more-orders">
                <div v-for="order in orderList.slice(0, 4)" :key="order.id" @click="showPopup(order)">
                  {{ formatReservationTime(order.reservationTime) || '시간 없음' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>

    <!-- 첫 번째 팝업 -->
    <div v-if="isPopupVisible" class="popup-overlay" @click="closePopup">
      <div class="popup-content">
        <p>예약 정보</p>
        <p><strong>예약 시간:</strong> {{ formatReservationTime(selectedOrder?.reservationTime) }}</p>
        <p><strong>메뉴 이름:</strong> {{ selectedOrder?.menuName || '메뉴 정보 없음' }}</p>
        <p><strong>가격:</strong> {{ selectedOrder?.price ? selectedOrder.price + '원' : '가격 없음' }}</p>
        <p><strong>수량:</strong> {{ selectedOrder?.quantity }}</p>
        <p><strong>현재 배달비:</strong> 
          {{ selectedOrder?.deliveryFee && selectedOrder?.participantsCount 
            ? (selectedOrder.deliveryFee / selectedOrder.participantsCount).toFixed(0) + '원' 
            : '배달비 없음' }}
        </p>
        <p><strong>참여 인원:</strong> {{ selectedOrder?.participantsCount }}</p>
        <button class="button green2" @click="openMenuSelection" :disabled="isOrderClosed(selectedOrder)">참여하기</button>
        <button class="button green2" @click="closePopup">닫기</button>
      </div>
    </div>

    <!-- 두 번째 팝업 -->
    <div v-if="isMenuPopupVisible" class="popup-overlay" @click="closeMenuPopup">
      <div class="popup-content" @click.stop>
        <p>메뉴 선택</p>
        <p><strong>선택된 메뉴:</strong> {{ selectedMenu.name || '선택된 메뉴 없음' }}</p>

        <!-- 메뉴 선택 콤보박스 -->
        <select v-model="selectedMenuId" @change="updateSelectedMenu">
          <option v-for="menu in storeMenus" :key="menu.id" :value="menu.id">
            {{ menu.name }} - {{ menu.price }}원
          </option>
        </select>

        <!-- 수량 입력 -->
        <p>수량</p>
        <input type="number" v-model="menuQuantity" min="1" @click.stop />

        <!-- 결제하기 버튼 -->
        <button class="button green2" @click="initiateParticipationPayment">결제하기</button>
        <button class="button green2" @click.stop="closeMenuPopup">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone';
import { ref, query, orderByChild, get, update, push, set } from 'firebase/database';
import { database } from '@/firebase';
import { getAuth } from 'firebase/auth';

export default {
  name: 'OrderComponent',
  data() {
    return {
      selectedMenu: '',
      logos: [],
      orders: [],
      isPopupVisible: false,
      isMenuPopupVisible: false,
      storeMenus: [],
      selectedOrderId: null,
      selectedStoreName: '',
      selectedMenuId: '',
      menuQuantity: 1,
      currentUserId: null,
      selectedOrder: null,
    };
  },
  created() {
    this.setCurrentUser();
  },
  methods: {
    setCurrentUser() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        this.currentUserId = user.uid;
        console.log("Logged in user's UID:", this.currentUserId);
      } else {
        console.error('사용자가 로그인되어 있지 않습니다.');
      }
    },
    updateSelectedMenu() {
      const selectedMenu = this.storeMenus.find(menu => menu.id === this.selectedMenuId);
      if (selectedMenu) {
        this.selectedMenu = selectedMenu;
        console.log('Selected Menu:', selectedMenu.name);
      }
    },
    showMenuDetails(menuType) {
      this.selectedMenu = menuType;
      this.fetchOrders();
    },
    fetchOrders() {
      const ordersRef = query(ref(database, 'orders'), orderByChild('reservationTime'));
      get(ordersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const allOrders = snapshot.val();
            const currentKSTTime = moment().tz('Asia/Seoul');

            const groupedOrders = {};
            Object.keys(allOrders).forEach((key) => {
              const order = allOrders[key];
              const reservationTime = moment(order.reservationTime);

              if (order.storeType === this.selectedMenu && reservationTime.isAfter(currentKSTTime)) {
                const storeUid = order.storeUid;
                if (!groupedOrders[storeUid]) {
                  groupedOrders[storeUid] = [];
                }

                groupedOrders[storeUid].push({
                  id: key,
                  menuName: order.menu,
                  deliveryFee: order.deliveryFee,
                  quantity: order.quantity,
                  price: order.price,
                  reservationTime: reservationTime.format('YYYY-MM-DD HH:mm'),
                  closeTime: order.closeTime, // closeTime 추가
                  participantsCount: order.participantsCount,
                  people: order.people, // 희망 참여 인원

                  ...order
                });
              }
            });

            Object.keys(groupedOrders).forEach((storeUid) => {
              groupedOrders[storeUid].sort((a, b) => new Date(a.reservationTime) - new Date(b.reservationTime));
            });

            this.orders = groupedOrders;
            this.fetchLogos();
          } else {
            console.log('No orders found.');
            this.orders = {};
          }
        })
        .catch((error) => {
          console.error('주문 정보를 가져오는 데 실패했습니다:', error);
        });
    },
    fetchLogos() {
      Object.keys(this.orders).forEach((storeUid) => {
        const logoRef = ref(database, `store/${storeUid}/logo`);
        get(logoRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.logos = { ...this.logos, [storeUid]: snapshot.val() };
            } else {
              this.$set(this.logos, storeUid, '');
            }
          })
          .catch((error) => {
            console.error('로고를 가져오는 데 실패했습니다:', error);
          });
      });
    },
    formatReservationTime(reservationTime) {
      const time = new Date(reservationTime);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    showPopup(order) {
      this.selectedOrder = order;
      this.selectedOrderId = order.id;
      this.isPopupVisible = true;
    },
    closePopup() {
      this.isPopupVisible = false;
      this.selectedOrder = null;
    },
    openMenuSelection() {
      if (this.selectedOrder) {
        this.isMenuPopupVisible = true;
        this.fetchStoreMenus(this.selectedOrder.storeUid);
      }
    },
    fetchStoreMenus(storeUid) {
      const menusRef = ref(database, `store/${storeUid}/menu`);
      get(menusRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.storeMenus = Object.keys(snapshot.val()).map(key => ({
              id: key,
              ...snapshot.val()[key],
            }));
          } else {
            this.storeMenus = [];
          }
        })
        .catch((error) => {
          console.error('메뉴를 가져오는 데 실패했습니다:', error);
        });
    },
    initiateParticipationPayment() {
      const selectedMenu = this.storeMenus.find(menu => menu.id === this.selectedMenuId);
      if (!selectedMenu) {
        alert('유효한 메뉴가 선택되지 않았습니다.');
        return;
      }

      // 마감 조건 확인
      if (this.isOrderClosed(this.selectedOrder)) {
        alert('주문이 마감되었습니다.');
        return;
      }

      const totalAmount = selectedMenu.price * this.menuQuantity;
      
      var IMP = window.IMP;
      IMP.init('imp75487318');
      IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: `participation_${new Date().getTime()}`,
        amount: totalAmount,
        name: selectedMenu.name,
        buyer_name: '참여 사용자',
        buyer_tel: '010-1234-5678',
        buyer_email: 'test@example.com',
      }, rsp => {
        if (rsp.success) {
          this.confirmMenuSelection();
        } else {
          alert(`결제에 실패했습니다: ${rsp.error_msg}`);
        }
      });
    },
    confirmMenuSelection() {
      if (!this.selectedOrderId || !this.selectedMenuId) {
        alert('선택된 주문이나 메뉴가 없습니다.');
        return;
      }

      const selectedMenu = this.storeMenus.find(menu => menu.id === this.selectedMenuId);
      const currentKSTTime = moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ');

      const memberRef = push(ref(database, 'member'));
      const memberData = {
        uid: this.currentUserId,
        orderID: this.selectedOrderId,
        menu: selectedMenu.name,
        quantity: this.menuQuantity,
        price: selectedMenu.price,
        participate_time: currentKSTTime,
      };

      set(memberRef, memberData)
        .then(() => {
          const orderRef = ref(database, `orders/${this.selectedOrderId}`);
          return get(orderRef);
        })
        .then(snapshot => {
          if (snapshot.exists()) {
            const orderData = snapshot.val();
            const updatedParticipants = (orderData.participantsCount || 0) + 1;
            const isClosed = this.isOrderClosed(orderData);

            // 주문 상태 업데이트
            return update(ref(database, `orders/${this.selectedOrderId}`), { 
              participantsCount: updatedParticipants, 
              status: isClosed ? 'closed' : 'open' 
            });
          } else {
            throw new Error('해당 주문을 찾을 수 없습니다.');
          }
        })
        .then(() => {
          alert('참여 완료!');
          this.closeMenuPopup();
        })
        .catch(error => {
          console.error('참여 처리 중 오류 발생:', error);
        });
    },
    isOrderClosed(order) {
      if (!order || !order.closeTime) {
      return false; // 주문 또는 closeTime이 없으면 주문 마감 아님
    }

    const currentKSTTime = moment().tz('Asia/Seoul');
    const closeTime = moment(order.closeTime);
    const participantsReached = order.participantsCount >= order.people;

    // 마감 시간이 지났거나 참여 인원이 충족되면 주문 마감
    return currentKSTTime.isAfter(closeTime) || participantsReached;
  }
  },
};
</script>


<style scoped>
.main-container {
  background: #FAFAFF;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.1);
}

/* 헤더 스타일 */
.header {
  width: 100%;
  padding: 15px;
  background-color: #EFF4FF;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 20px;
  box-shadow: inset 0px 2px 4px rgba(255, 255, 255, 0.5);
}

.button-option .button {
  background-color: #B3C5FF;
  color: #333;
  border: none;
  border-radius: 10px;
  padding: 8px 20px;
  font-size: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  margin: 5px;
}

.button-option .button:hover {
  background-color: #8DA4FF;
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.order-box {
  width: 100%;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  width: 100%;
  justify-content: center;
  margin-top: 2vh;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 15px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.image-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-item img {
  width: 45px;
  height: 45px;
  object-fit: cover;
  margin-bottom: 8px;
}

.image-item p {
  font-size: 0.9rem;
  color: #333;
}

.white-box {
  width: 100%;
  height: 150px;
  background-color: #FAFAFF;
  border-radius: 20px;
  margin: 20px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #333;
}

/* 로고 박스와 타임 박스 일직선 배치 */
.logo-time-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
}

.logo-box{
  width: 150px;
  margin: 2vh;
  height: 120px;
  background-color: #F0F4FF;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.time-box{
  width: 150px;
  margin: 2vh;
  height: 220px;
  background-color: #F0F4FF;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.logo-box img, .time-box p {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.button {
  background-color: #AFCBFF;
  color: #333;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: #8DA4FF;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.option {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: #FFFFFF;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

.popup-content button {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #8DA4FF;
  color: #FFF;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin: 6px;
}

.popup-content button:hover {
  background-color: #6D8BFF;
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

.bottom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
}

.time-box {
  background-color: #EFF4FF;
  border-radius: 17px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.time-box p {
  font-size: 0.9rem;
  color: #333;
}

select,
input[type="number"] {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #C3D7FF;
  border-radius: 10px;
  background-color: #F7FAFF;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  color: #333;
  transition: all 0.3s ease;
  appearance: none;
  outline: none;
}

select:hover,
input[type="number"]:hover {
  background-color: #EBF3FF;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
}

select:focus,
input[type="number"]:focus {
  border-color: #8DA4FF;
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

.popup-content p {
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

@font-face {
    font-family: 'IBMPlexSansKR';
    src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
}
  
* {
    font-family: 'IBMPlexSansKR', sans-serif;
}
</style>