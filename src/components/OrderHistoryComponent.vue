<template>
  <div class="order-history">
    <h2>주문 기록</h2>
    <p v-if="orders.length === 0">주문 기록이 없습니다.</p>
    <ul v-else>
      <li v-for="(order, index) in orders" :key="order.orderID" class="order-item">
        <div class="order-header">
          <strong>주문 {{ index + 1 }}</strong> <!-- 순서 표시 -->
        </div>
        <strong>주문 번호:</strong>
        <a href="#" @click.prevent="openOrderPopup(order.orderID)" class="order-link">{{ order.orderID }}</a> <!-- 주문 번호 클릭 -->
        <br />
        <strong>메뉴 이름:</strong> {{ order.menu || '정보 없음' }}<br />
        <strong>수량:</strong> {{ order.quantity || '정보 없음' }}<br />
        <strong>예약 시간:</strong> {{ formatReservationTime(order.participate_time) || '정보 없음' }}<br />
      </li>
    </ul>

    <!-- 주문 상세 팝업 -->
    <div v-if="selectedOrder" class="popup-overlay" @click="closeOrderPopup">
      <div class="popup-content" @click.stop>
        <h3>주문 상세 정보</h3>
        <p><strong>예약 시간:</strong> {{ formatReservationTime(selectedOrder.reservationTime) }}</p>
        <p><strong>가게 타입:</strong> {{ selectedOrder.storeType }}</p>
        <p><strong>가게 이름:</strong> {{ storeDetails.storeName }}</p>
        <p><strong>가게 주소:</strong> {{ storeDetails.store_address }}</p>
        <p><strong>가게 연락처:</strong> {{ storeDetails.contact }}</p>
        <button @click="closeOrderPopup" class="close-popup-btn">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onValue, get } from 'firebase/database';
import { database } from '@/firebase';
import { getAuth } from 'firebase/auth';

export default {
  name: 'OrderHistory',
  data() {
    return {
      orders: [], // 주문 기록 배열
      selectedOrder: null, // 선택된 주문
      storeDetails: {}, // 가게 정보
    };
  },
  mounted() {
    this.fetchOrders(); // 컴포넌트가 마운트될 때 주문 기록 가져오기
  },
  methods: {
    fetchOrders() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const memberRef = ref(database, 'member'); // member 경로에서 데이터 가져오기
        onValue(memberRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // 로그인된 사용자의 주문 기록만 필터링
            this.orders = Object.keys(data).map((key) => {
              const member = data[key];
              if (member.uid === user.uid) {
                return {
                  orderID: member.orderID,
                  menu: member.menu,
                  quantity: member.quantity,
                  participate_time: member.participate_time,
                };
              }
              return null;
            }).filter(order => order !== null);

            // 예약 시간을 기준으로 오름차순 정렬
            this.orders.sort((a, b) => new Date(a.participate_time) - new Date(b.participate_time));
          } else {
            this.orders = [];
          }
        });
      } else {
        alert('로그인이 필요합니다.');
      }
    },
    openOrderPopup(orderID) {
      // orders/{orderID}에서 주문 정보 가져오기
      const orderRef = ref(database, `orders/${orderID}`);
      get(orderRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.selectedOrder = snapshot.val();

          // store/{storeUid} 경로에서 가게 정보 가져오기
          const storeUid = this.selectedOrder.storeUid;
          const storeRef = ref(database, `store/${storeUid}`);
          get(storeRef).then((storeSnapshot) => {
            if (storeSnapshot.exists()) {
              this.storeDetails = storeSnapshot.val();
            }
          });
        }
      });
    },
    closeOrderPopup() {
      this.selectedOrder = null; // 팝업 닫기
    },
    formatReservationTime(reservationTime) {
      if (!reservationTime) return '정보 없음';
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Seoul',
        hour12: false,
      };
      return new Date(reservationTime).toLocaleString('ko-KR', options);
    },
  },
};
</script>

<style scoped>
.order-history {
  padding: 20px;
  background-color: #ffffff; /* 배경색 흰색 */
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

.order-item {
  margin: 15px 0;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-header {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #6c4fbd; /* 보라색 */
}

strong {
  color: #333;
}

.order-link {
  color: #6c4fbd;
  text-decoration: none;
}

.order-link:hover {
  text-decoration: underline;
}

/* 팝업 스타일 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.close-popup-btn {
  margin-top: 15px;
  background-color: #6c4fbd;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-popup-btn:hover {
  background-color: #5a3c9a; /* 다크 보라색 */
}
</style>
