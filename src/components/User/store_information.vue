<template>
  <div class="dashboard-container">
    <!-- Sidebar Navigation -->
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

    <!-- Main Content Area -->
    <div class="content">
      <!-- Store Information Management -->
      <div class="store-info">
        <h2>가게 정보 관리</h2>
        
        <!-- Store Name Registration -->
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
                class="input-box"
              />
              <div>
                <button v-if="!storeNameRegistered" @click="registerStoreName" class="action-button">등록</button>
                <button v-if="storeNameRegistered && !editingStoreName" @click="enableStoreNameEditing" class="action-button">변경하기</button>
                <button v-if="editingStoreName" @click="saveStoreName" class="action-button">저장</button>
              </div>
            </div>
          </div>

          <div class="info-box">
          <label>영업 시간</label>
          <div class="time-inputs-with-button">
            <label for="openTime">오픈 시간</label>
            <select 
              id="openTime"
              v-model="openTime" 
              :disabled="!editingOperationHours"
              class="time-select"
            >
              <option v-for="time in timeOptions" :key="time" :value="time">
                {{ time }}
              </option>
            </select>

            <label for="closeTime">마감 시간</label>
            <select 
              id="closeTime"
              v-model="closeTime" 
              :disabled="!editingOperationHours"
              class="time-select"
            >
              <option v-for="time in timeOptions" :key="time" :value="time">
                {{ time }}
              </option>
            </select>

            <button v-if="editingOperationHours" @click="saveOperationHours" class="edit-button">저장</button>
            <button v-else @click="enableOperationHoursEditing" class="edit-button">변경하기</button>
          </div>
        </div>
          <!-- Day Off Setting -->
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
              <input type="date" v-model="selectedDate" @change="fetchOrdersByDate" class="date-picker" />
            </div>
            <div class="selected-days-with-button">
              <p class="selected-days">선택된 휴무일: {{ dayoff.join(', ') }} / {{ closeDays.join(', ') }}</p>
              <button v-if="!editingDayoff" @click="enableDayoffEditing" class="edit-button">변경하기</button>
              <button v-else @click="saveStoreInfo" class="edit-button">저장</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order History Dashboard -->
      <h2>주문 내역</h2>

      <div class="info-box">
      <label>영업 시간</label>
      <div class="time-inputs-with-button">
        <!-- 오픈 시간 설정 -->
        <label for="openTime">오픈 시간</label>
        <select 
          id="openTime"
          v-model="openTime" 
          :disabled="!editingOperationHours"
          class="time-select"
        >
          <option v-for="time in timeOptions" :key="time" :value="time">
            {{ time }}
          </option>
        </select>

        <!-- 마감 시간 설정 -->
        <label for="closeTime">마감 시간</label>
        <select 
          id="closeTime"
          v-model="closeTime" 
          :disabled="!editingOperationHours"
          class="time-select"
        >
          <option v-for="time in timeOptions" :key="time" :value="time">
            {{ time }}
          </option>
        </select>

        <!-- 저장/변경 버튼 -->
        <button v-if="editingOperationHours" @click="setOperationHours" class="edit-button">저장</button>
        <button v-else @click="enableOperationHoursEditing" class="edit-button">변경하기</button>
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
      },
      // 시간 선택 옵션 (30분 단위)
      timeOptions: [
        '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
        '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
        '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
      ]
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
    setOrChangeTime() {
      if (this.openTime && this.closeTime) {
        alert('영업 시간이 변경되었습니다.');
      } else {
        alert('영업 시간이 설정되었습니다.');
      }
    },
    enableOperationHoursEditing() {
      this.editingOperationHours = true;
    },
    setOperationHours() {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (!this.openTime || !this.closeTime) {
        alert('오픈 시간과 마감 시간을 모두 선택하세요.');
        return;
      }

      try {
        // Firebase 데이터베이스 경로
        const storeInfoRef = ref(database, `store/${user.uid}`);

        // 기존 데이터 가져오기
        const existingDataSnapshot = await get(storeInfoRef);
        const existingData = existingDataSnapshot.exists() ? existingDataSnapshot.val() : {};

        // 새로운 데이터 구성
        const updatedData = {
          ...existingData,
          operationHours: {
            open: this.openTime,
            close: this.closeTime,
          },
        };

        // 데이터 업데이트
        await update(storeInfoRef, updatedData);

        // 성공 메시지
        alert('영업 시간이 성공적으로 저장되었습니다.');
        this.editingOperationHours = false;
      } catch (error) {
        console.error('영업 시간 저장 실패:', error);
        alert('영업 시간 저장에 실패했습니다. 관리자에게 문의하세요.');
      }
    } else {
      alert('로그인이 필요합니다.');
    }
  });
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
    async fetchBusinessInfo() {
  try {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const businessInfoRef = ref(database, `store/${user.uid}`);
        const snapshot = await get(businessInfoRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.storeName = data.storeName || '';
          this.openTime = data.operationHours?.open || '';
          this.closeTime = data.operationHours?.close || '';
          this.dayoff = data.dayoff || [];
          this.closeDays = data.closeDays || [];
        } else {
          // 데이터가 없을 경우 기본값 설정
          this.resetBusinessInfo();
        }
      }
    });
  } catch (error) {
    console.error('가게 정보 불러오기 실패:', error);
    this.resetBusinessInfo(); // 오류가 발생해도 기본값 설정
  }
},
resetBusinessInfo() {
  // 기본값 설정
  this.storeName = '';
  this.openTime = '';
  this.closeTime = '';
  this.dayoff = [];
  this.closeDays = [];
}

  }
};
</script>

<style scoped>
/* Pane Layout 전체 레이아웃 */
.dashboard-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 20px;
    box-shadow: 
        0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25),
        inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25);
}

/* Sidebar styling */
.sidebar {
    margin-top: 4vh;
    width: 250px;
    background-color: #f7f3ff;
    padding: 24px;
    border-radius: 12px;
    color: black;
    margin-right: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    transition: all 0.3s ease;
}

.sidebar ul {
    list-style-type: none; /* 점 모양 제거 */
    padding: 0;
    margin: 0;
}

/* Sidebar button styling */
.sidebar-button {
    background-color: #ffffff;
    border: none;
    padding: 12px 0;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    width: 100%;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
    border-radius: 8px;
}

.sidebar-button:hover {
    background-color: #ece7ff;
    transform: translateY(-3px);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
}

/* Main content area styling */
.main-content {
    flex: 1;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Typography */
h1, h2, h3 {
    color: #333;
}

h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
}

p {
    font-size: 16px;
    color: #666;
}

/* Order card styling */
.order-card {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
}

/* Date picker styling (주문 날짜 선택 박스) */
.date-picker {
    padding: 12px 16px;
    font-size: 16px;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fafafa;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s, box-shadow 0.3s;
    width: 100%;
    max-width: 320px;
    margin-top: 8px; /* 위아래 여백 추가 */
}

.date-picker:hover {
    border-color: #1a73e8;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.date-picker:focus {
    border-color: #1a73e8;
    outline: none;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 휴무일 설정 영역 스타일 */
.day-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 12px; /* 항목 간 간격 조정 */
    padding: 12px;
    background-color: #f8f8ff;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 16px;
    margin-top: 10px; /* 위아래 여백 추가 */
}

/* Combo box styling */
select {
    padding: 10px;
    font-size: 16px;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fafafa;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s, box-shadow 0.3s;
    appearance: none;
}

select:hover, select:focus {
    border-color: #1a73e8;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* General button styling */
button {
    padding: 14px 28px;
    background-color: #ffffff;
    color: #333;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    margin-right: 8px; /* 버튼과 텍스트 간 여백 추가 */
}

button:hover {
    background-color: #ece7ff;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

button:active {
    background-color: #e0dafc;
}

/* Action button styling */
.action-button {
    margin: 3px;
    padding: 10px 20px;
    margin-top: 2vh;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
    background-color: #166bb5;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Specific button styling */
.approve-button {
    background-color: #1a73e8;
    color: white;
    margin-right: 10px;
}

.reject-button {
    background-color: #ff6b51;
    color: white;
    margin-left: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .dashboard-container {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        margin-bottom: 20px;
        flex-direction: row;
        order: 1;
        gap: 10px;
    }
    
    .sidebar-button {
        flex: 1;
        font-size: 14px;
    }
}

/* Input fields styling */
.store-name-section, .business-hours {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-box, .time-input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    width: 200px;
}

/* Font family */
@font-face {
    font-family: 'IBMPlexSansKR';
    src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
}

* {
    font-family: 'IBMPlexSansKR', sans-serif;
}
</style>
