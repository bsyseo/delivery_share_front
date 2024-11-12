<template>
  <h2>마이페이지</h2>
  <div class="mypage-container">
    <div class="sidebar">
      <ul class="no-bullets">
        <li><router-link to="/OrderHistory" class="sidebar-button">주문 기록</router-link></li>
        <li><router-link to="/EditUserInfo" class="sidebar-button">사용자 정보 수정</router-link></li>
        <li><router-link to="/qna" class="sidebar-button">Q&A</router-link></li>
        <li><router-link to="/review" class="sidebar-button">리뷰</router-link></li>
      </ul>
    </div>
    <div class="content">
      <div class="user-info">
        <h3>{{ userName }}님</h3>
        <p>전화번호: {{ userPhone }}</p>

        <h3>최근 주문 내역</h3>
        
        <!-- Date Picker for Orders -->
        <div class="calendar-section">
          <label for="order-date">주문 날짜 선택</label><br>
          <input type="date" v-model="selectedDate" @change="fetchOrdersByDate" class="date-picker" />
          <button @click="fetchAllOrders">모든 주문 보기</button>
        </div>
        
        <div v-if="orders.length === 0" class="no-orders">
          <p>해당 날짜에 들어온 주문이 없습니다.</p>
        </div>
        <div v-else class="order-list">
          <div v-for="order in orders" :key="order.orderID" class="order-card">
            <div class="order-header">
              <p class="order-date">{{ formatDate(order.createdAt) }} 주문</p>
            </div>
            <p class="order-status">{{ order.status || '예약됨' }} ({{ statusDescriptions[order.status] || '주문 전송 상태' }})</p>
            <div class="order-details">
              <p>메뉴: {{ order.menu }}</p>
              <p>수량: {{ order.quantity }}</p>
              <p>가격: {{ order.price }} 원</p>
            </div>
          </div>
        </div>
        <div class="nav-buttons">
          <button class="home-button" @click="goToHome">홈으로 가기</button>
          <button class="order-button" @click="goToOrderPage">주문 페이지로 가기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import moment from 'moment';
import { auth } from '@/firebase';

export default {
  name: 'UserMypage',

  data() {
    return {
      userName: '',
      userPhone: '',
      recentOrders: [],
      ongoingReservations: [],
      userUid: '', // 사용자의 UID 저장
      selectedDate: moment().format('YYYY-MM-DD'), // 기본값으로 오늘 날짜 설정
      orders: [], // 선택된 날짜의 주문을 저장하는 배열
      statusDescriptions: { 
        '승인됨': '주문이 승인되었습니다.',
        '거절됨': '주문이 거절되었습니다.',
        'pending': '주문 전송 상태',
        '예약됨': '주문이 예약되었습니다.'
      }
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.fetchUserUid(user.uid);
      }
    });
  },
  methods: {
    fetchUserUid(authUid) {
      const db = getDatabase();
      const userRef = ref(db, `users/${authUid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.userUid = data.uid;
          this.userName = data.name;
          this.userPhone = data.phone;
          this.fetchOrdersByDate(); // 페이지 로드 시 기본적으로 오늘 날짜 주문을 불러옵니다.
        }
      }).catch((error) => {
        console.error('사용자 데이터를 불러오는 중 오류 발생:', error);
      });
    },
    fetchOrdersByDate() {
      if (!this.userUid) {
        console.warn('userUid가 정의되지 않았습니다.');
        return;
      }

      const db = getDatabase();
      const selectedDay = moment(this.selectedDate).format('YYYY-MM-DD');
      const ordersRef = query(ref(db, 'orders'), orderByChild('creatorUid'), equalTo(this.userUid));

      get(ordersRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const filteredOrders = Object.keys(data).map((orderId) => {
            const orderData = data[orderId];
            const orderDate = moment(orderData.createdAt).format('YYYY-MM-DD');
            if (orderDate === selectedDay) {
              return {
                orderID: orderId,
                ...orderData
              };
            }
            return null;
          }).filter(order => order !== null);
          
          this.orders = filteredOrders;
        } else {
          this.orders = [];
        }
      }).catch((error) => {
        console.error('선택된 날짜의 주문 내역을 불러오는 중 오류 발생:', error);
      });
    },
    fetchAllOrders() {
      if (!this.userUid) {
        console.warn('userUid가 정의되지 않았습니다.');
        return;
      }

      const db = getDatabase();
      const ordersRef = query(ref(db, 'orders'), orderByChild('creatorUid'), equalTo(this.userUid));

      get(ordersRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.orders = Object.keys(data).map((orderId) => {
            return {
              orderID: orderId,
              ...data[orderId]
            };
          });
        } else {
          this.orders = [];
        }
      }).catch((error) => {
        console.error('모든 주문을 불러오는 중 오류 발생:', error);
      });
    },
    goToHome() {
      this.$router.push('/');
    },
    goToOrderPage() {
      this.$router.push('/Order');
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD');
    }
  },
};
</script>


<style scoped>
@font-face {
  font-family: 'IBMPlexSansKR';
  src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
}

* {
  font-family: 'IBMPlexSansKR', sans-serif;
}

.mypage-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f7f3ff;
  border-radius: 16px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
}

.sidebar {
  width: 250px;
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.no-bullets li {
  margin: 10px 0;
  width: 100%;
}

.sidebar-button {
  background-color: #6750A4;
  border: none;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  width: 100%;
  display: block;
  transition: background-color 0.3s ease;
}

.sidebar-button:hover {
  background-color: #7f67be;
}

.content {
  flex: 1;
  margin-left: 20px;
  max-width: 800px;
  padding: 30px;
  background-color: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-info h3 {
  color: #4A6F5B;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.user-info p {
  font-size: 16px;
  color: #666;
}

.order-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.order-item, .reservation-item {
  padding: 16px;
  margin-bottom: 10px;
  background-color: #f3e8ff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.nav-buttons {
  margin-top: 30px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.home-button, .order-button {
  width: 150px;
  background-color: #6750A4;
  border: none;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover, .order-button:hover {
  background-color: #7f67be;
}
</style>
