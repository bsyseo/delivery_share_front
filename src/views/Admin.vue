<template>
  <div class="admin-container">
    <!-- Header 영역 - 홈으로 돌아가기 및 로그아웃 버튼 -->
    <div class="header">
      <button class="back-button" @click="$router.push('/')">홈 화면으로 돌아가기</button>
      <button class="logout-button" @click="logout">로그아웃</button>
    </div>

    <h1>관리자 대시보드</h1>
    <div class="nav-tabs">
      <!-- 네비게이션 탭 -->
      <button @click="currentView = 'orderManagement'">주문 관리</button>
      <button @click="currentView = 'couponManagement'">쿠폰 관리</button>
      <button @click="currentView = 'advertisementManagement'">광고 관리</button>
      <button @click="currentView = 'qnaManagement'">Q&A 관리</button>
      <button @click="currentView = 'pickUpZoneManagement'">픽업존 관리</button>
      <button @click="currentView = 'userManagement'">사용자 관리</button>
      <button @click="currentView = 'storeManagement'">스토어 관리</button>
      <button @click="currentView = 'connectionStatistics'">접속 통계</button>
    </div>

    <!-- 현재 선택된 컴포넌트를 보여주는 영역 -->
    <component :is="currentViewComponent"></component>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth"; // Firebase 로그아웃을 위해 import

import AdminOrderManagement from '@/components/AdminOrderManagement.vue';
import AdminCouponManagement from '@/components/AdminCouponManagement.vue';
import AdminAdvertisementManagement from '@/components/AdminAdvertisementManagement.vue';
import AdminQnAManagement from '@/components/AdminQnAManagement.vue';
import AdminPickUpZoneManagement from '@/components/AdminPickUpZoneManagement.vue';
import AdminUserManagement from '@/components/AdminUserManagement.vue';
import AdminStoreManagement from '@/components/AdminStoreManagement.vue';
import AdminConnectionStatistics from '@/components/AdminConnectionStatistics.vue';

export default {
  name: 'AdminView',
  data() {
    return {
      currentView: 'AdminOrderManagement'
    };
  },
  computed: {
    currentViewComponent() {
      switch (this.currentView) {
        case 'orderManagement': return AdminOrderManagement;
        case 'couponManagement': return AdminCouponManagement;
        case 'advertisementManagement': return AdminAdvertisementManagement;
        case 'qnaManagement': return AdminQnAManagement;
        case 'pickUpZoneManagement': return AdminPickUpZoneManagement;
        case 'userManagement': return AdminUserManagement;
        case 'storeManagement': return AdminStoreManagement;
        case 'connectionStatistics': return AdminConnectionStatistics;
        default: return AdminOrderManagement;
      }
    }
  },
  methods: {
    logout() {
      const authInstance = getAuth();
      signOut(authInstance)
        .then(() => {
          // 로그아웃 후 localStorage 정리 및 홈 페이지로 이동
          localStorage.removeItem('role');
          localStorage.removeItem('userName');
          localStorage.removeItem('lastLoginTime');
          this.$router.push('/'); // 홈으로 이동
        })
        .catch(error => {
          console.error("로그아웃 실패:", error);
          alert("로그아웃에 실패했습니다.");
        });
    }
  },
  components: {
    AdminOrderManagement,
    AdminCouponManagement,
    AdminAdvertisementManagement,
    AdminQnAManagement,
    AdminPickUpZoneManagement,
    AdminUserManagement,
    AdminStoreManagement,
    AdminConnectionStatistics
  }
};
</script>


<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f0f8f4;
  color: #333;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.back-button,
.logout-button {
  background-color: #c4e8d1;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.back-button:hover,
.logout-button:hover {
  background-color: #a8d1b7;
  transform: translateY(-3px);
}

.back-button:active,
.logout-button:active {
  transform: translateY(0);
}

h1 {
  font-size: 32px;
  color: #4a6f5b;
  margin: 30px 0;
  font-weight: bold;
  text-align: center;
}

.nav-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

button:hover {
  background-color: #45a049;
  transform: translateY(-3px);
}

button:active {
  transform: translateY(0);
}
</style>
