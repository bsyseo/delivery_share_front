<template>
    <div class="mypage-container">
      <div class="sidebar">
        <ul class="no-bullets">
          <li><router-link to="/order-history" class="sidebar-button">주문 기록</router-link></li>
          <li><router-link to="/edit-user-info" class="sidebar-button">사용자 정보 수정</router-link></li>
          <li><router-link to="/qna" class="sidebar-button">Q&A</router-link></li>
          <li><router-link to="/reviews" class="sidebar-button">리뷰</router-link></li>
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
      </div>
    </div>
  </template>
  
  <script>
  import { getDatabase, ref, get } from "firebase/database"; // Firebase import
  
  export default {
    name: 'MyPage',
    data() {
      return {
        userName: '', // Firebase에서 가져올 데이터
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
        const userRef = ref(db, `users/USER_ID`); // USER_ID는 실제 사용자 UID로 대체
  
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
  </style>
  