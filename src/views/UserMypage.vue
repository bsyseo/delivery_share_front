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
        <p>주소: {{ userAddress }}</p>

        <h3>최근 주문 내역</h3>

        <!-- OrderHistory 컴포넌트를 사용하여 주문 내역 표시 -->
        <order-history :selected-date="selectedDate" @update-orders="updateOrders" />

        <div v-if="orders.length === 0" class="no-orders">
          <p>해당 날짜에 들어온 주문이 없습니다.</p>
        </div>
        <div v-else class="order-list">
          <div v-for="order in orders" :key="order.orderID" class="order-card">
            <div class="order-header">
              <p class="order-date">{{ formatDate(order.createdAt) }} 주문</p>
            </div>
            <p class="order-status">
              {{ order.status || '예약됨' }}
              ({{ statusDescriptions[order.status] || '주문 전송 상태' }})
            </p>
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
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database"; // Realtime Database 관련 함수 가져오기
import { auth, database } from "@/firebase"; // Firebase Realtime Database 초기화된 모듈 가져오기
import moment from "moment";
import OrderHistory from "@/components/Order/OrderHistoryComponent.vue";

export default {
  name: "UserMypage",

  components: {
    OrderHistory,
  },

  data() {
    return {
      userName: "", // 사용자 이름 저장
      userPhone: "", // 사용자 전화번호 저장
      userAddress: "", // 사용자 주소 저장
      userUid: "", // 현재 사용자의 UID
      selectedDate: moment().format("YYYY-MM-DD"), // 기본값으로 오늘 날짜 설정
      orders: [], // 선택된 날짜의 주문 데이터 저장
      statusDescriptions: {
        승인됨: "주문이 승인되었습니다.",
        거절됨: "주문이 거절되었습니다.",
        pending: "주문 전송 상태",
        예약됨: "주문이 예약되었습니다.",
      },
    };
  },

  created() {
    // Firebase 인증 상태 확인
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userUid = user.uid; // 사용자 UID 설정
        await this.fetchUserInfo(); // Realtime Database에서 사용자 정보 가져오기
      } else {
        console.warn("로그인이 필요합니다.");
        this.$router.push("/login"); // 로그인 페이지로 리다이렉트
      }
    });
  },

  methods: {
    async fetchUserInfo() {
      try {
        // Realtime Database에서 사용자 정보 가져오기
        const userRef = ref(database, `users/${this.userUid}`); // 'users' 경로 아래 사용자 UID 사용
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          this.userName = userData.name || "사용자"; // Realtime Database에서 이름 가져오기
          this.userPhone = userData.phone || "전화번호 없음"; // Realtime Database에서 전화번호 가져오기
          this.userAddress = userData.address || "주소 없음"; // Realtime Database에서 주소 가져오기
        } else {
          console.warn("사용자 정보가 없습니다.");
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
      }
    },

    updateOrders(orders) {
      // OrderHistory 컴포넌트에서 전달된 주문 데이터를 저장
      this.orders = orders;
    },

    goToHome() {
      this.$router.push("/");
    },

    goToOrderPage() {
      this.$router.push("/Order");
    },

    formatDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
  },
};
</script>

<style scoped>
/* 스타일은 기존과 동일 */
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

