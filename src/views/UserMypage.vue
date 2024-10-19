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
      
      <!-- OrderHistoryComponent를 추가하여 하단에 보여주기 -->
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

// OrderHistoryComponent 파일을 불러옵니다
import OrderHistoryComponent from '@/components/OrderHistoryComponent.vue';

export default {
  name: 'UserMypage',
  components: {
    OrderHistoryComponent, // 컴포넌트를 등록
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
.mypage-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #F0F8F4;
  border-radius: 20px;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.1),
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.05);
}

.sidebar {
  margin-top: 0vh;
  width: 250px;
  background-color: #E1F0E4;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center; /* 텍스트 중앙 정렬 */
}

.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%; /* 리스트가 사이드바 넓이를 차지하게 설정 */
}

.no-bullets li {
  margin: 10px 0;
  width: 100%; /* 리스트 항목이 사이드바의 넓이를 차지하도록 설정 */
}

.sidebar-button {
  background-color: #D8F5E0;
  border: none;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  text-align: center;
  border-radius: 10px;
  width: 80%; /* 버튼이 사이드바 전체 넓이를 차지하도록 설정 */
  display: block;
  transition: background-color 0.3s ease;
}

.sidebar-button:hover {
  background-color: #C4E8D1;
}

.content {
  flex: 1;
  margin-left: 20px;
  max-width: 800px;
  padding: 30px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.user-info h3 {
  color: #4A6F5B;
  font-size: 22px;
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
  padding: 12px;
  margin-bottom: 10px;
  background-color: #F5FBF8;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.nav-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.home-button, .order-button {
  width: 48%;
  background-color: #D8F5E0;
  border: none;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover, .order-button:hover {
  background-color: #C4E8D1;
}

@font-face {
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFB.OTF') format('opentype');
}

* {
  font-family: 'NanumSquareRound', sans-serif;
}
</style>
