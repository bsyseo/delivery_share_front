<template>
  <div class="order-history">
    <h2>주문 기록</h2>
    <p v-if="orders.length === 0">주문 기록이 없습니다.</p>

    <!-- 최신 3개 주문 -->
    <h3>최근 주문 기록</h3>
    <ul v-if="recentOrders.length">
      <li v-for="(order, index) in recentOrders" :key="order.orderID" class="order-item">
        <div class="order-header">
          <strong>주문 {{ index + 1 }}</strong> <!-- 순서 표시 -->
        </div>
        <strong>주문 번호:</strong>
        <a href="#" @click.prevent="openOrderPopup(order.orderID)" class="order-link">{{ order.orderID }}</a> <!-- 주문 번호 클릭 -->
        <br />
        <strong>메뉴 이름:</strong> {{ order.menu || '정보 없음' }}<br />
        <strong>수량:</strong> {{ order.quantity || '정보 없음' }}<br />
        <strong>예약 시간:</strong> {{ formatReservationTime(order.participate_time) || '정보 없음' }}<br />
        <strong>음식 금액:</strong> {{ calculateOrderTotal(order) || '정보 없음' }}원
        <strong>배달비:</strong> {{ order.personalDeliveryFee || '정보 없음' }}원<br />
      </li>
    </ul>

    <!-- "주문 기록 보기" 버튼 -->
    <button @click="showAllOrders = !showAllOrders" v-if="recentOrders.length > 0">주문 기록 보기</button>

    <!-- 전체 주문 기록 표시 -->
    <div v-if="showAllOrders">
      <h3>전체 주문 기록</h3>
      <ul>
        <li v-for="(order, index) in orders" :key="order.orderID" class="order-item">
          <div class="order-header">
            <strong>주문 {{ index + 1 }}</strong>
          </div>
          <strong>주문 번호:</strong>
          <a href="#" @click.prevent="openOrderPopup(order.orderID)" class="order-link">{{ order.orderID }}</a>
          <br />
          <strong>메뉴 이름:</strong> {{ order.menu || '정보 없음' }}<br />
          <strong>수량:</strong> {{ order.quantity || '정보 없음' }}<br />
          <strong>예약 시간:</strong> {{ formatReservationTime(order.participate_time) || '정보 없음' }}<br />
          <strong>음식 금액:</strong> {{ calculateOrderTotal(order) || '정보 없음' }}원
          <strong>배달비:</strong> {{ order.personalDeliveryFee || '정보 없음' }}원<br />
        </li>
      </ul>
    </div>

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
      orders: [], // 전체 주문 기록 배열
      recentOrders: [], // 최신 3개의 주문 기록 배열
      selectedOrder: null, // 선택된 주문
      storeDetails: {}, // 가게 정보
      showAllOrders: false, // 전체 주문 보기 여부
    };
  },
  mounted() {
    this.fetchOrders(); // 컴포넌트가 마운트될 때 주문 기록 가져오기
  },
  methods: {
    async fetchOrders() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      try {
        const memberRef = ref(database, 'member');
        onValue(memberRef, async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const allOrders = Object.keys(data)
              .map((key) => {
                const member = data[key];
                if (member.uid === user.uid) {
                  return {
                    orderID: member.orderID,
                    menu: member.menu,
                    quantity: member.quantity,
                    price: member.price,
                    participate_time: member.participate_time,
                  };
                }
                return null;
              })
              .filter((order) => order !== null);

            allOrders.sort((a, b) => new Date(b.participate_time) - new Date(a.participate_time));

            // 전체 주문 기록
            this.orders = await Promise.all(
              allOrders.map(async (order) => {
                const personalDeliveryFee = await this.fetchLatestPersonalDeliveryFee(order.orderID);
                return {
                  ...order,
                  personalDeliveryFee, // 최신 personalDeliveryFee 추가
                };
              })
            );

            // 최신 3개의 주문만 가져오기
            this.recentOrders = this.orders.slice(0, 3);
          } else {
            this.orders = [];
            this.recentOrders = [];
          }
        });
      } catch (error) {
        console.error('주문 기록을 가져오는 중 오류가 발생했습니다:', error);
        alert('주문 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    },

    async fetchLatestPersonalDeliveryFee(orderID) {
      try {
        const memberRef = ref(database, 'member');
        const snapshot = await get(memberRef);

        if (snapshot.exists()) {
          const members = Object.values(snapshot.val())
            .filter((member) => member.orderID === orderID) // 동일한 orderID를 가진 데이터 필터링
            .sort((a, b) => new Date(b.participate_time) - new Date(a.participate_time)); // 참여 시간 기준 내림차순 정렬

          if (members.length > 0) {
            return members[0].personalDeliveryFee || '정보 없음'; // 가장 최신 데이터의 personalDeliveryFee 반환
          }
        }
        return '정보 없음';
      } catch (error) {
        console.error('배달비 정보를 가져오는 중 오류가 발생했습니다:', error);
        return '정보 없음';
      }
    },

    calculateOrderTotal(order) {
      if (!order.price || !order.quantity) {
        return '정보 없음'; // 가격 또는 수량이 누락된 경우
      }
      return order.price * order.quantity; // 총 금액 계산
    },

    async openOrderPopup(orderID) {
      try {
        // orders/{orderID}에서 주문 정보 가져오기
        const orderRef = ref(database, `orders/${orderID}`);
        const orderSnapshot = await get(orderRef);

        if (orderSnapshot.exists()) {
          this.selectedOrder = orderSnapshot.val();

          // store/{storeUid} 경로에서 가게 정보 가져오기
          const storeUid = this.selectedOrder.storeUid;
          const storeRef = ref(database, `store/${storeUid}`);
          const storeSnapshot = await get(storeRef);

          if (storeSnapshot.exists()) {
            this.storeDetails = storeSnapshot.val();
          } else {
            console.warn('가게 정보를 찾을 수 없습니다.');
            alert('가게 정보를 불러오는 중 오류가 발생했습니다.');
          }
        } else {
          console.warn('주문 정보를 찾을 수 없습니다.');
          alert('주문 정보를 불러오는 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('주문 상세 정보를 가져오는 중 오류가 발생했습니다:', error);
        alert('주문 상세 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    },
    closeOrderPopup() {
      this.selectedOrder = null; // 팝업 닫기
      this.storeDetails = {}; // 가게 정보 초기화
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
