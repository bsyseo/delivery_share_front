<template>
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
      <h2>마이페이지</h2>
      <div class="user-info">
        <h3>{{ userName }}님</h3>
        <p>전화번호: {{ userPhone }}</p>
        <h3>최근 주문 내역</h3>
        <ul class="order-list">
          <li v-for="order in recentOrders" :key="order.id">{{ order.details }}</li>
        </ul>
        <h3>예약 진행 중인 주문</h3>
        <ul class="order-list">
          <li v-for="reservation in ongoingReservations" :key="reservation.id">{{ reservation.details }}</li>
        </ul>
      </div>
      <div class="nav-buttons">
        <button class="home-button" @click="goToHome">홈으로 가기</button>
        <button class="order-button" @click="goToOrderPage">주문 페이지로 가기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";

export default {
  name: 'UserMypage',
  data() {
    return {
      userName: '',
      userPhone: '',
      recentOrders: [],
      ongoingReservations: [],
    };
  },
  created() {
    this.fetchUserData();
    this.fetchRecentOrders();
    this.fetchOngoingReservations();
  },
  methods: {
    fetchUserData() {
      const db = getDatabase();
      const userRef = ref(db, `users/USER_ID`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.userName = data.name;
          this.userPhone = data.phone;
        }
      });
    },
    fetchRecentOrders() {
      const db = getDatabase();
      const ordersRef = ref(db, `orders/USER_ID/recentOrders`);
      get(ordersRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.recentOrders = snapshot.val();
        }
      });
    },
    fetchOngoingReservations() {
      const db = getDatabase();
      const reservationsRef = ref(db, `reservations/USER_ID/ongoing`);
      get(reservationsRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.ongoingReservations = snapshot.val();
        }
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
.mypage-container {
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

.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.no-bullets li {
  margin: 10px 0;
  color: #000;
}

.sidebar {
  margin-top: 7vh;
  width: 250px;
  background-color: #BFDC99;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sidebar-button {
  background-color: #EFFAD6;
  border: none;
  padding: 10px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  width: 80%;
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.sidebar-button:hover {
  background-color: #D5F2C1;
}

h2 {
  font-size: 28px;
  color: #444;
  font-weight: bold;
  margin-bottom: 20px;
}

.order-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.order-list li {
  padding: 12px 0;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
}

.order-list li:hover {
  background-color: #f9f9f9;
}

.content {
  flex: 1;
  margin-left: 20px;
  max-width: 800px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.nav-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  width: auto;
  padding-top: 20px;
}

.home-button,
.order-button {
  background-color: #EFFAD6;
  border: none;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 8px;
  width: 45%;
  text-align: center;
  transition: background-color 0.3s ease;
}

.home-button:hover,
.order-button:hover {
  background-color: #D5F2C1;
}
</style>
