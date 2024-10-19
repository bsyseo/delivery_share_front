<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <ul class="no-bullets">
        <li>
          <button class="sidebar-button" @click="$router.push('/business_menu')">
            가게 정보 & 메뉴
          </button>
        </li>
        <li>
          <button @click="showUnderConstruction" class="sidebar-button">
            상품 관리
          </button>
        </li>
        <li>
          <button @click="showUnderConstruction" class="sidebar-button">
            판매 관리
          </button>
        </li>
        <li>
          <button @click="showUnderConstruction" class="sidebar-button">
            정산 관리
          </button>
        </li>
        <li>
          <button @click="showUnderConstruction" class="sidebar-button">
            문의 / 상담
          </button>
        </li>
        <li>
          <button class="sidebar-button" @click="navigateTo('order_status')">
            주문 현황
          </button>
        </li>
        <li>
          <button class="sidebar-button" @click="$router.push('/')">
            Home
          </button>
        </li>
      </ul>
    </div>

    <div class="content">
      <!-- 가게 정보 관리 -->
      <div class="store-info">
        <h2>가게 정보 관리</h2>
        <div class="info-section">
          <div class="info-box">
            <label for="storeName">스토어 이름 등록 / 변경</label>
            <div class="input-with-button">
              <input
                type="text"
                id="storeName"
                v-model="storeName"
                :disabled="storeNameRegistered && !editingStoreName"
                placeholder="가게 이름을 입력하세요"
              />
              <div>
                <button v-if="!storeNameRegistered" @click="registerStoreName">등록</button>
                <button v-if="storeNameRegistered && !editingStoreName" @click="enableStoreNameEditing">변경하기</button>
                <button v-if="editingStoreName" @click="saveStoreName">저장</button>
              </div>
            </div>
          </div>

          <!-- 영업시간 설정 -->
          <div class="info-box">
            <label>영업 시간</label>
            <div class="time-inputs-with-button">
              <label for="openTime">오픈 시간</label>
              <input 
                type="time" 
                id="openTime"
                v-model="openTime" 
                :disabled="!editingOperationHours"
              />
              <label for="closeTime">마감 시간</label>
              <input 
                type="time" 
                id="closeTime"
                v-model="closeTime" 
                :disabled="!editingOperationHours"
              />
              <button v-if="!editingOperationHours" @click="enableOperationHoursEditing" class="edit-button">
                변경하기
              </button>
              <button v-else @click="saveStoreInfo" class="edit-button">
                저장
              </button>
            </div>
          </div>

          <!-- 휴무일 설정 -->
          <div class="info-box">
            <label>휴무일 설정</label>
            <div class="day-selection">
              <label v-for="day in days" :key="day">
                <input type="checkbox" v-model="dayoff" :value="day" :disabled="!editingDayoff" />
                {{ day }}
              </label>
            </div>
            <div class="calendar-selection">
              <label>날짜 선택</label>
              <input type="date" v-model="selectedCloseDay" @change="addCloseDay" :disabled="!editingDayoff" />
            </div>
            <div class="selected-days-with-button">
              <p class="selected-days">선택된 휴무일: {{ dayoff.join(', ') }} / {{ closeDays.join(', ') }}</p>
              <button v-if="!editingDayoff" @click="enableDayoffEditing" class="edit-button">변경하기</button>
              <button v-else @click="saveStoreInfo" class="edit-button">저장</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 주문 내역 대시보드 -->
      <h2>주문 내역</h2>

      <!-- 달력 추가 -->
      <div class="calendar-section">
        <label for="order-date">주문 날짜 선택</label>
        <input type="date" v-model="selectedDate" @change="fetchOrdersByDate" class="date-picker" />
      </div>

      <div v-if="orders.length === 0" class="no-orders">
        <p>해당 날짜에 들어온 주문이 없습니다.</p>
      </div>
      <div v-else class="order-list">
        <div v-for="order in orders" :key="order.orderID" class="order-card">
          <div class="order-header">
            <p class="order-date">{{ formatDate(order.createdAt) }} 주문</p>
          </div>
          <p class="order-status">{{ order.status || '예약됨' }} ({{ statusDescriptions[order.status] || '주문 전송 상태' }})</p> <!-- 상태 설명 추가 -->
          <div class="order-details">
            <p>메뉴: {{ order.menu }}</p>
            <p>수량: {{ order.quantity }}</p>
            <p>예약 시간: {{ formatTime(order.reservationTime) }}</p> <!-- 예약 시간 추가 -->
          </div>
          <div class="order-actions">
            <button class="approve-button" @click="approveOrder(order.orderID)">승인</button> <!-- 승인 버튼 추가 -->
            <button class="reject-button" @click="rejectOrder(order.orderID)">거절</button> <!-- 거절 버튼 추가 -->
            <button v-if="order.status !== '주문처리완료'" class="reject-button" @click="cancelOrder(order.orderID)">취소</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, update, onValue, get } from 'firebase/database';
import { database } from '@/firebase';
import moment from 'moment-timezone';

export default {
  name: 'OrderDashboard',
  data() {
    return {
      storeName: '',
      storeNameRegistered: false,
      editingStoreName: false,
      openTime: '',
      closeTime: '',
      editingOperationHours: false,
      dayoff: [],
      closeDays: [],
      editingDayoff: false,
      selectedCloseDay: '',
      days: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
      selectedDate: moment().format('YYYY-MM-DD'), // 기본값으로 오늘 날짜 설정
      orders: [],  // 필터링된 주문 데이터를 저장할 배열
      statusDescriptions: { // 상태 설명 추가
        '승인됨': '주문이 승인되었습니다.',
        '거절됨': '주문이 거절되었습니다.',
        'pending': '주문 전송 상태',
        '예약됨': '주문이 예약되었습니다.'
      }
    };
  },
  mounted() {
    this.fetchOrdersByDate(); // 페이지 로드 시 오늘 날짜 주문을 불러옴
    this.fetchBusinessInfo();
  },
  methods: {
    formatDate(date) {
      return moment(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm');
    },
    formatTime(time) {
      return moment(time, 'HH:mm').format('HH:mm'); // 예약 시간 형식
    },
    fetchOrdersByDate() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userUid = user.uid;
          const selectedDay = moment(this.selectedDate).format('YYYY-MM-DD');
          const ordersRef = ref(database, 'orders');
          
          onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const filteredOrders = [];
              Object.keys(data).forEach((orderId) => {
                const orderData = data[orderId];
                const orderDate = moment(orderData.createdAt).format('YYYY-MM-DD');
                
                if (orderData.storeUid === userUid && orderDate === selectedDay) {
                  filteredOrders.push({
                    orderID: orderId,
                    menu: orderData.menu,
                    quantity: orderData.quantity,
                    reservationTime: orderData.reservationTime,
                    createdAt: orderData.createdAt,
                    status: orderData.status || '예약됨'
                  });
                }
              });
              this.orders = filteredOrders;
            } else {
              this.orders = [];
            }
          });
        }
      });
    },
    approveOrder(orderID) {
      // 주문 승인 로직
      const orderRef = ref(database, `orders/${orderID}`);
      update(orderRef, { status: '승인됨' })
        .then(() => {
          alert(`주문 #${orderID}이(가) 승인되었습니다.`);
        })
        .catch((error) => {
          console.error('주문 승인 실패:', error);
        });
    },
    rejectOrder(orderID) {
      // 주문 거절 로직
      const orderRef = ref(database, `orders/${orderID}`);
      update(orderRef, { status: '거절됨' })
        .then(() => {
          alert(`주문 #${orderID}이(가) 거절되었습니다.`);
        })
        .catch((error) => {
          console.error('주문 거절 실패:', error);
        });
    },
    viewOrder(orderID) {
      // 주문 조회 로직
      alert(`주문 #${orderID}을(를) 조회합니다.`);
    },
    cancelOrder(orderID) {
      // 주문 취소 로직
      alert(`주문 #${orderID}을(를) 취소합니다.`);
    },
    registerStoreName() {
      if (this.storeName) {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const storeNameRef = ref(database, `store/${user.uid}/storeName`);
            update(storeNameRef, { storeName: this.storeName })
              .then(() => {
                this.storeNameRegistered = true;
                alert('가게 이름이 등록되었습니다.');
              })
              .catch((error) => {
                console.error('가게 이름 등록 실패:', error);
              });
          }
        });
      } else {
        alert('가게 이름을 입력하세요.');
      }
    },
    enableStoreNameEditing() {
      this.editingStoreName = true;
    },
    saveStoreName() {
      if (this.storeName) {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const storeNameRef = ref(database, `store/${user.uid}/storeName`);
            update(storeNameRef, { storeName: this.storeName })
              .then(() => {
                this.editingStoreName = false;
                alert('가게 이름이 변경되었습니다.');
              })
              .catch((error) => {
                console.error('가게 이름 변경 실패:', error);
              });
          }
        });
      } else {
        alert('가게 이름을 입력하세요.');
      }
    },
    enableOperationHoursEditing() {
      this.editingOperationHours = true;
    },
    enableDayoffEditing() {
      this.editingDayoff = true;
    },
    addCloseDay() {
      if (this.selectedCloseDay && !this.closeDays.includes(this.selectedCloseDay)) {
        this.closeDays.push(this.selectedCloseDay);
      }
    },
    async saveStoreInfo() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const storeInfoRef = ref(database, `store/${user.uid}`);
          const existingDataSnapshot = await get(storeInfoRef);
          const existingData = existingDataSnapshot.exists() ? existingDataSnapshot.val() : {};

          const newData = {
            operationHours: {
              open: this.openTime,
              close: this.closeTime,
            },
            dayoff: this.dayoff,
            closeDays: this.closeDays,
          };

          await update(storeInfoRef, { ...existingData, ...newData });
          alert('가게 정보가 저장되었습니다.');
          this.editingOperationHours = false;
          this.editingDayoff = false;
        }
      });
    },
    fetchBusinessInfo() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const businessInfoRef = ref(database, `store/${user.uid}`);
          get(businessInfoRef).then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              this.storeName = data.storeName || '';

              // 저장된 시간 정보가 있으면 불러오기
              this.openTime = (data.operationHours && data.operationHours.open) ? data.operationHours.open : '';
              this.closeTime = (data.operationHours && data.operationHours.close) ? data.operationHours.close : '';

              this.dayoff = data.dayoff || [];
              this.closeDays = data.closeDays || [];
            } else {
              // 데이터가 없을 경우 기본값 설정 (처음 설정 가능)
              this.openTime = '';
              this.closeTime = '';
              this.dayoff = [];
              this.closeDays = [];
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 20px;
  box-shadow: 
      0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25),
      inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25);
}

.sidebar {
  margin-top: 4vh;
  width: 250px;
  background-color: #BFDC99;
  padding: 20px;
  border-radius: 12px;
  color: black;
  margin-right: 100px;
  margin-left: -150px;
}

.sidebar-button {
  background-color: #EFFAD6;
  border: none;
  padding: 10px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  width: 80%;
  margin-top: 2vh;
}

.sidebar-button:hover {
  background-color: #D5F2C1;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  padding: 15px;
  background-color: #EFFAD6;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.order-status {
  color: #4CAF50;
}

.order-details {
  font-size: 14px;
  color: #555;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.approve-button {
  background-color: #98cbae;
  color: white;
}

h2, h3 {
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.info-section {
  margin-bottom: 30px;
}

.info-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="text"], input[type="time"], input[type="date"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

input[type="text"]:focus, input[type="time"]:focus, input[type="date"]:focus {
  border-color: #4CAF50;
}

.time-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.time-inputs-with-button {
  display: flex;
  align-items: center;
  gap: 20px;
}

.day-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.calendar-selection label {
  margin-right: 10px;
}

.calendar-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}

.selected-days-with-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.selected-days {
  font-size: 14px;
  color: #555;
  margin-right: 10px;
}

.edit-button {
  padding: 10px 18px;
  background-color: #EFFAD6;
  color: gray;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-button:hover {
  background-color: #3D9970;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.edit-button:active {
  background-color: #2E7D58;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-box {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}


.accept-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.reject-button {
  background-color: #ff6b51;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.no-orders {
  text-align: center;
  color: gray;
  font-size: 16px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.action-button {
  padding: 10px 18px;
  background-color: #EFFAD6;
  color: gray;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #D5F2C1;
}

button {
  padding: 12px 24px;
  background-color: #EFFAD6;
  color: gray;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:hover {
  background-color: #3D9970;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  background-color: #2E7D58;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.calendar-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.date-picker {
  padding: 10px;
  border: 1px solid #D5F2C1; 
  border-radius: 12px;
  background-color: #EFFAD6; 
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  transition: border-color 0.3s, box-shadow 0.3s;
}

.date-picker:focus {
  border-color: #4CAF50; 
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); 
}

@font-face {
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFB.OTF') format('opentype');
}

* {
  font-family: 'NanumSquareRound', sans-serif;
}
</style>
