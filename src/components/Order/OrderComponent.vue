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
              <div class="store-info">
                <p class="store-name">{{ storeNames[storeUid] || '가게 이름 없음' }}</p>
                <!-- 리뷰 보기 버튼 -->
                <button class="review-button" @click="$router.push({ name: 'BrowseReview', params: { storeUid } })">[리뷰 보기]</button>
              </div>
            </div>

            <!-- 하단 시간표 박스 -->
            <div class="time-box">
              <p v-for="order in orderList" :key="order.id" @click="showPopup(order)">
                <span :style="getDayIndicatorStyle(order.reservationTime)">
                  {{ getDayIndicator(order.reservationTime) }}
                </span>
                {{ formatReservationTime(order.reservationTime) || '시간 없음' }}
              </p>
            </div>
          </div>
        </div>
      </slot>
    </div>

    <!-- 첫 번째 팝업 -->
    <div v-if="isPopupVisible" class="popup-overlay" @click="closePopup">
      <div class="popup-content">
        <p>예약 정보</p>
        <!-- 예약 시간 -->
        <p><strong>예약 시간:</strong> {{ formatFullReservationTime(selectedOrder?.reservationTime) }}</p>
        <!-- 주소 -->
        <p><strong>주소:</strong> {{ selectedOrder?.pickupZone || '주소 정보 없음' }}</p>
        <!-- 현재 배달비 -->
        <p><strong>현재 배달비:</strong> 
          {{ selectedOrder?.deliveryFee && selectedOrder?.participantsCount 
            ? (selectedOrder.deliveryFee / selectedOrder.participantsCount).toFixed(0) + '원' 
            : '배달비 없음' }}
        </p>
        <!-- 참여 인원 -->
        <p><strong>참여 인원:</strong> {{ selectedOrder?.participantsCount }}</p>

        <!-- 무료 배송 인원 -->
        <p><strong>무료 배송 인원:</strong> {{ selectedOrder?.desiredParticipants || '정보 없음' }}</p>

        <!-- 참여하기 버튼 -->
        <button class="button green2" @click="openMenuSelection">참여하기</button>

        <!-- 닫기 버튼 -->
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
import { ref, query, orderByChild, get, set, push } from 'firebase/database';
import { database } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { reactive } from 'vue';

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
      participantSummary: [], // 참여자 메뉴 요약
      totalPrice: 0, // 총 가격
      storeNames: reactive({}), // 반응형 객체로 변경
    };
  },
  created() {
    if (!this.currentUserId) {
        console.error('사용자가 로그인되지 않았습니다. 초기화를 중단합니다.');
        return;
    }
    this.setCurrentUser();
  },
 
  methods: {
    // 예약 시간 포맷 함수 (날짜 포함)
    formatFullReservationTime(reservationTime) {
      if (!reservationTime) return '정보 없음';
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Seoul',
        hour12: false,
      };
      return new Date(reservationTime).toLocaleString('ko-KR', options);
    },
    setCurrentUser() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!auth.currentUser) {
        console.error('Firebase 인증 문제1: 로그인되지 않은 사용자입니다.');
        return;
      }

      if (!user) {
        console.error('Firebase 인증 문제2: 로그인되지 않은 사용자입니다.');
      } else {
        console.log('인증된 사용자 UID:', user.uid);
      }

      this.currentUserId = user.uid;
      console.log('Logged in user UID:', this.currentUserId);

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

                console.log('Order StoreUid:', order.storeUid);

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
                  pickupZone: order.pickupZone || '픽업존 정보 없음', // 픽업존 추가
                  ...order
                });

                // 가게 이름 가져오기
                if (!this.storeNames[storeUid]) {
                  const storeNameRef = ref(database, `store/${storeUid}/storeName`);
                  get(storeNameRef)
                    .then((storeSnapshot) => {
                      if (storeSnapshot.exists()) {
                        this.storeNames[storeUid] = storeSnapshot.val(); // 직접 설정
                      } else {
                        this.storeNames[storeUid] = '가게 이름 없음';
                      }
                    })
                    .catch((error) => {
                      console.error(`Failed to fetch store name for ${storeUid}:`, error);
                    });
                }
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
  // 기존 기능 유지
  this.selectedOrder = { ...order, desiredParticipants: '정보 로딩 중...' }; // 기본값 추가
  this.selectedOrderId = order.id;
  this.isPopupVisible = true;

  // 가게의 무료 배송 인원(desiredParticipants) 가져오기
  const storeRef = ref(database, `store/${this.selectedOrder.storeUid}/desiredParticipants`);
  get(storeRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        this.selectedOrder.desiredParticipants = snapshot.val(); // 무료 배송 인원 저장
      } else {
        this.selectedOrder.desiredParticipants = '정보 없음';
      }
    })
    .catch((error) => {
      console.error('무료 배송 인원 정보를 가져오는 데 실패했습니다:', error);
      this.selectedOrder.desiredParticipants = '정보 없음';
    });

  // 추가 데이터 가져오기 로직
  const participantRef = ref(database, `member/${this.selectedOrderId}/participants`);
  const orderDataRef = ref(database, `orders/${this.selectedOrderId}`);

  // 초기 데이터를 가져오기
  get(orderDataRef)
    .then((orderSnapshot) => {
      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.val();

        // orderID 데이터를 초기값으로 설정
        const initialSummary = {
          menu: orderData.menu || "메뉴 정보 없음",
          quantity: orderData.quantity || 0,
          price: orderData.price || 0,
        };

        // 참여자 데이터를 가져오기
        return get(participantRef).then((participantSnapshot) => {
          const menuSummary = {};
          let totalPrice = 0;

          // orderID 데이터를 합산 시작점으로 설정
          if (!menuSummary[initialSummary.menu]) {
            menuSummary[initialSummary.menu] = 0;
          }
          menuSummary[initialSummary.menu] += initialSummary.quantity;
          totalPrice += initialSummary.price;

          if (participantSnapshot.exists()) {
            const participants = participantSnapshot.val();

            // participants 데이터 합산
            Object.values(participants).forEach((participant) => {
              if (!menuSummary[participant.menu]) {
                menuSummary[participant.menu] = 0;
              }
              menuSummary[participant.menu] += participant.quantity;
              totalPrice += participant.price * participant.quantity;
            });
          }

          // 병합된 데이터를 participantSummary와 totalPrice에 반영
          this.participantSummary = Object.entries(menuSummary).map(([menu, quantity]) => ({
            menu,
            quantity,
          }));

          this.totalPrice = totalPrice;
        });
      } else {
        // orderID 데이터가 없는 경우 기본값 설정
        this.participantSummary = [];
        this.totalPrice = 0;
      }
    })
    .catch((error) => {
      console.error("데이터를 가져오는 데 실패했습니다:", error);
      this.participantSummary = [];
      this.totalPrice = 0;
    });
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
        console.error('선택된 주문 또는 메뉴가 없습니다. 작업을 중단합니다.');
        return;
      }

      const selectedMenu = this.storeMenus.find((menu) => menu.id === this.selectedMenuId);
      const currentKSTTime = moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ');

      // orders/{선택된 주문 ID}/participantsCount 증가
      const orderRef = ref(database, `orders/${this.selectedOrderId}`);
      get(orderRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const orderData = snapshot.val();
            const currentCount = orderData.participantsCount || 0;
            const newCount = currentCount + 1;

            // participantsCount 업데이트
            return set(ref(database, `orders/${this.selectedOrderId}/participantsCount`), newCount).then(() => ({
              ...orderData,
              participantsCount: newCount, // 업데이트된 participantsCount 포함
            }));
          } else {
            throw new Error('Order not found.');
          }
        })
        .then((updatedOrder) => {
          // personalDeliveryFee 계산
          const personalDeliveryFee =
            updatedOrder.deliveryFee && updatedOrder.participantsCount
              ? updatedOrder.deliveryFee / updatedOrder.participantsCount
              : 0;

          // 참여자의 정보 저장 경로: member/{임의의 key}/
          const memberRef = ref(database, 'member');
          const newMemberRef = push(memberRef); // 새로운 key 생성

          const participantData = {
            orderID: this.selectedOrderId,
            menu: selectedMenu.name,
            price: selectedMenu.price,
            quantity: this.menuQuantity,
            participate_time: currentKSTTime,
            uid: this.currentUserId,
            personalDeliveryFee, // 계산된 personalDeliveryFee 추가
          };

          return set(newMemberRef, participantData);
        })
        .then(() => {
          alert('참여 완료!');
          this.closeMenuPopup();
        })
        .catch((error) => {
          console.error('참여 처리 중 오류 발생:', error);
        });
    },

    closeMenuPopup() {
      this.isMenuPopupVisible = false;
      this.selectedMenuId = '';
      this.menuQuantity = 1;
    },
    getDayIndicator(reservationTime) {
      const currentKST = moment().tz('Asia/Seoul').startOf('day'); // 현재 한국 시각 기준으로 00:00 기준
      const reservationDay = moment(reservationTime).startOf('day');
      const dayDifference = reservationDay.diff(currentKST, 'days');

      if (dayDifference === 0) return 'Today';
      if (dayDifference > 0) return `Day +${dayDifference}`;
      return ''; // 과거 날짜는 표시하지 않음
    },
    getDayIndicatorStyle(reservationTime) {
      const dayIndicator = this.getDayIndicator(reservationTime);
      if (dayIndicator) {
        return {
          color: 'red',
          marginRight: '8px',
          fontWeight: 'bold',
        };
      }
      return {}; // 표시할 내용이 없으면 스타일 없음
    },
  },
  fetchStoreNames() {
    Object.keys(this.orders).forEach((storeUid) => {
      const storeNameRef = ref(database, `store/${storeUid}/storeName`);
      get(storeNameRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.$set(this.storeNames, storeUid, snapshot.val());
          } else {
            this.$set(this.storeNames, storeUid, '가게 이름 없음');
          }
        })
        .catch((error) => {
          console.error('가게 이름을 가져오는 데 실패했습니다:', error);
        });
    });
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
  align-items: flex-start; /* 수직 정렬을 상단 기준으로 */
  margin-top: 20px;
  gap: 20px;
}

.logo-time-pair {
  display: flex;
  flex-direction: column; /* 상단 로고와 하단 박스를 수직 정렬 */
  justify-content: flex-start; /* 상단 정렬 */
  align-items: center; /* 중앙 정렬 */
}

.logo-box {
  width: 150px;
  height: auto; /* 높이를 내용에 맞게 자동 설정 */
  background-color: #F0F4FF;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* 로고와 텍스트 수직 정렬 */
  justify-content: center; /* 내부 요소 중앙 정렬 */
  align-items: center; /* 내부 요소 중앙 정렬 */
  text-align: center;
  padding: 10px;
}
.time-box {
  width: 150px;
  height: 220px; /* 높이를 고정 */
  background-color: #F0F4FF;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 상단 정렬 */
  align-items: center; /* 중앙 정렬 */
  text-align: center;
  overflow-y: auto; /* 스크롤 가능 */
  padding: 10px;
  margin-top: 20px; /* 로고와 시간표 간의 간격 */
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
  margin: 5px 0; /* 항목 간 간격 설정 */
}

.time-box::-webkit-scrollbar {
  width: 8px; /* 스크롤바 너비 */
}

.time-box::-webkit-scrollbar-thumb {
  background-color: #B3C5FF; /* 스크롤바 색상 */
  border-radius: 4px; /* 스크롤바 둥글게 */
}

.time-box::-webkit-scrollbar-thumb:hover {
  background-color: #8DA4FF; /* 스크롤바 호버 색상 */
}

.time-box::-webkit-scrollbar-track {
  background-color: #F0F4FF; /* 스크롤 트랙 색상 */
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
.logo-box .store-info {
  margin-top: 8px; /* 로고와 이름 간 간격 */
  text-align: center;
}
.logo-box .store-name {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 4px;
}

.logo-box .review-button {
  background-color: transparent;
  border: none;
  color: #007BFF;
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
}

.logo-box .review-button:hover {
  color: #0056b3;
}

.popup-content h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.popup-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.popup-content ul li {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #444;
}

</style>
