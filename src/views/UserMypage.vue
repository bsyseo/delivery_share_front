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
        <ul class="order-list">
          <li v-for="order in recentOrders" :key="order.id" class="order-item">
            <p>메뉴: {{ order.menuName }}</p>
            <p>가격: {{ order.price }} 원</p>
            <p>수량: {{ order.quantity }}</p>
          </li>
        </ul>
        <h3>예약 진행 중인 주문</h3>
        <ul class="order-list">
          <li v-for="reservation in ongoingReservations" :key="reservation.id" class="reservation-item">
            <p>{{ reservation.details }}</p>
          </li>
        </ul>
      </div>
      
      <OrderHistoryComponent />

      <div class="nav-buttons">
        <button class="home-button" @click="goToHome">홈으로 가기</button>
        <button class="order-button" @click="goToOrderPage">주문 페이지로 가기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebase';
import OrderHistoryComponent from '@/components/OrderHistoryComponent.vue';

export default {
  name: 'UserMypage',
  components: {
    OrderHistoryComponent,
  },
  data() {
    return {
      userName: '',
      userPhone: '',
      recentOrders: [],
      ongoingReservations: [],
      userUid: '',
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
          this.fetchRecentOrders();
          this.fetchOngoingReservations();
        }
      }).catch((error) => {
        console.error('사용자 데이터를 불러오는 중 오류 발생:', error);
      });
    },
    fetchRecentOrders() {
      const db = getDatabase();
      const ordersRef = query(ref(db, 'orders'), orderByChild('creatorUid'), equalTo(this.userUid));
      
      get(ordersRef).then((snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          this.recentOrders = Object.keys(ordersData).map((key) => ({
            id: key,
            ...ordersData[key],
          }));
        } else {
          this.recentOrders = [];
        }
      }).catch((error) => {
        console.error('주문 내역을 불러오는 중 오류 발생:', error);
      });
    },
    fetchOngoingReservations() {
      const db = getDatabase();
      const reservationsRef = ref(db, `reservations/${this.userUid}/ongoing`);
      get(reservationsRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.ongoingReservations = snapshot.val();
        } else {
          this.ongoingReservations = [];
        }
      }).catch((error) => {
        console.error('진행 중인 예약을 불러오는 중 오류 발생:', error);
      });
    },
    goToHome() {
      this.$router.push('/');
    },
    goToOrderPage() {
      this.$router.push('/Order');
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
