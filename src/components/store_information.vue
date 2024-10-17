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
            <button @click="navigateTo('order_status')" class="sidebar-button">
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
                <div v-if="!storeNameRegistered">
                  <button @click="registerStoreName">등록</button>
                </div>
                <div v-else>
                  <button v-if="!editingStoreName" @click="enableStoreNameEditing">변경하기</button>
                  <button v-if="editingStoreName" @click="saveStoreName">저장</button>
                </div>
              </div>
            </div>
            <div class="info-box centered">
              <label>영업 시간</label>
              <div class="time-inputs centered">
                <input type="time" v-model="openTime" placeholder="오픈 시간" />
                <input type="time" v-model="closeTime" placeholder="마감 시간" />
              </div>
            </div>
            <div class="info-box centered">
              <label>휴무일 설정</label>
              <div class="day-selection centered">
                <label v-for="day in days" :key="day">
                  <input type="checkbox" v-model="holidayDays" :value="day" />
                  {{ day }}
                </label>
              </div>
              <div class="calendar-selection">
                <label>날짜 선택</label>
                <input type="date" v-model="selectedHolidayDate" @change="addHolidayDate" />
              </div>
              <p class="selected-days">선택된 휴무일: {{ holidayDays.join(', ') }} / {{ selectedHolidayDates.join(', ') }}</p>
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="action-button save-button" @click="saveStoreInfo">가게 정보 저장</button>
        </div>
      </div>
    </div>
  
    <!-- 주문 현황 및 주문 받기/거절 기능을 추가하는 dashboard-container2 -->
    <div class="dashboard-container2">
      <h2>현재 들어온 주문</h2>
      <div v-if="orders.length === 0" class="no-orders">
        <p>들어온 주문이 없습니다.</p>
      </div>
      <div v-for="order in orders" :key="order.id" class="order-box">
        <p><strong>메뉴:</strong> {{ order.menuName }}</p>
        <p><strong>수량:</strong> {{ order.quantity }}</p>
        <p><strong>예약 시간:</strong> {{ order.reservationTime }}</p>
        <button @click="acceptOrder(order.id)" class="accept-button">주문 받기</button>
        <button @click="rejectOrder(order.id)" class="reject-button">거절하기</button>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { ref, set, onValue } from 'firebase/database';
  import { database } from '@/firebase';
  
  export default {
    name: 'BusinessComponent', // 컴포넌트 이름
    data() {
      return {
        storeName: '',
        storeNameRegistered: false, 
        editingStoreName: false, 
        openTime: '',
        closeTime: '',
        holidayDays: [], 
        selectedHolidayDates: [], 
        selectedHolidayDate: '', 
        days: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
        orders: [], 
      };
    },
    mounted() {
      this.fetchOrders();
    },
    methods: {
      // 가게 이름 등록 메서드
      registerStoreName() {
        if (this.storeName) {
          this.storeNameRegistered = true;
          alert('가게 이름이 등록되었습니다.');
        } else {
          alert('가게 이름을 입력하세요.');
        }
      },
      enableStoreNameEditing() {
        this.editingStoreName = true;
      },
      saveStoreName() {
        if (this.storeName) {
          this.editingStoreName = false;
          alert('가게 이름이 변경되었습니다.');
        } else {
          alert('가게 이름을 입력하세요.');
        }
      },
      // 휴무일 날짜 추가
      addHolidayDate() {
        if (this.selectedHolidayDate && !this.selectedHolidayDates.includes(this.selectedHolidayDate)) {
          this.selectedHolidayDates.push(this.selectedHolidayDate);
        }
      },
      // 가게 정보 저장
      saveStoreInfo() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const storeInfoRef = ref(database, `store/${user.uid}/info`);
            set(storeInfoRef, {
              name: this.storeName,
              openTime: this.openTime,
              closeTime: this.closeTime,
              holidays: this.holidayDays,
              holidayDates: this.selectedHolidayDates,
            })
              .then(() => {
                alert('가게 정보가 저장되었습니다.');
              })
              .catch((error) => {
                console.error('가게 정보 저장 실패:', error);
              });
          }
        });
      },
      // 주문 가져오기
      fetchOrders() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const ordersRef = ref(database, `store/${user.uid}/orders`);
            onValue(ordersRef, (snapshot) => {
              const data = snapshot.val();
              if (data) {
                this.orders = Object.keys(data).map(key => ({
                  id: key,
                  ...data[key],
                }));
              } else {
                this.orders = [];
              }
            });
          }
        });
      },
      // 주문 수락
      acceptOrder(orderId) {
        alert(`주문 ${orderId}을(를) 받았습니다.`);
        this.updateOrderStatus(orderId, 'accepted');
      },
      // 주문 거절
      rejectOrder(orderId) {
        alert(`주문 ${orderId}을(를) 거절했습니다.`);
        this.updateOrderStatus(orderId, 'rejected');
      },
      // 주문 상태 업데이트
      updateOrderStatus(orderId, status) {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const orderStatusRef = ref(database, `store/${user.uid}/orders/${orderId}/status`);
            set(orderStatusRef, status);
          }
        });
      },
      // 라우트 이동
      navigateTo(routeName) {
        this.$router.push({ name: routeName });
      },
      // 준비중인 기능 알림
      showUnderConstruction() {
        alert('준비중입니다.');
      },
    },
  };
  </script>
  
  <style scoped>
  /* 스타일링 유지 */
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
    margin-left:-150px;
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
  
  h2 {
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
  
  .selected-days {
    font-size: 14px;
    color: #555;
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
    background-color: #45a049;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  button:active {
    background-color: #3e8e41;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .order-box {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .no-orders {
    text-align: center;
    color: gray;
    font-size: 16px;
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
    background-color: #FF6347;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }
  .no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

@font-face {
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFB.OTF') format('opentype');
}

* {
  font-family: 'NanumSquareRound', sans-serif;
}
  </style>
  