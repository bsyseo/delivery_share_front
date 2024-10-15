<template>
  <div class="admin-container">
    <!-- 홈 화면으로 돌아가기 버튼 -->
    <div class="header">
      <button class="back-button" @click="goBack">홈 화면으로 돌아가기</button>
    </div>

    <!-- AdminComponent를 메인 화면에 표시 -->
    <AdminComponent />

    <h1>Admin Dashboard</h1>
    <div class="nav-tabs">
      <!-- 네비게이션 탭 -->
      <button @click="currentView = 'orderManagement'">Order Management</button>
      <button @click="currentView = 'couponManagement'">Coupon Management</button>
      <button @click="currentView = 'advertisementManagement'">Advertisement Management</button>
      <button @click="currentView = 'qnaManagement'">Q&A Management</button>
      <button @click="currentView = 'pickUpZoneManagement'">Pick-up Zone Management</button>
      <button @click="currentView = 'userManagement'">User Management</button>
      <button @click="currentView = 'storeManagement'">Store Management</button>
      <button @click="currentView = 'connectionStatistics'">Connection Statistics</button>
    </div>

    <!-- 현재 선택된 컴포넌트를 보여주는 영역 -->
    <component :is="currentViewComponent"></component>
  </div>
</template>

<script>
// 필요한 컴포넌트들을 모두 불러옵니다.
import AdminComponent from '@/components/AdminComponent.vue';
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
      currentView: 'AdminComponent' // 기본 선택 페이지로 'Order Management' 설정
    };
  },
  computed: {
    // 현재 선택된 컴포넌트 반환
    currentViewComponent() {
      switch (this.currentView) {
        case 'orderManagement':
          return AdminOrderManagement;
        case 'couponManagement':
          return AdminCouponManagement;
        case 'advertisementManagement':
          return AdminAdvertisementManagement;
        case 'qnaManagement':
          return AdminQnAManagement;
        case 'pickUpZoneManagement':
          return AdminPickUpZoneManagement;
        case 'userManagement':
          return AdminUserManagement;
        case 'storeManagement':
          return AdminStoreManagement;
        case 'connectionStatistics':
          return AdminConnectionStatistics;
        default:
          return AdminOrderManagement;
      }
    }
  },
  components: {
    AdminComponent, // 메인 화면에 보여줄 AdminComponent
    AdminOrderManagement,
    AdminCouponManagement,
    AdminAdvertisementManagement,
    AdminQnAManagement,
    AdminPickUpZoneManagement,
    AdminUserManagement,
    AdminStoreManagement,
    AdminConnectionStatistics
  },
  methods: {
    goBack() {
      this.$router.push('/'); // 홈 화면으로 돌아가기
    }
  }
};
</script>

<style scoped>
/* 기본 컨테이너 */
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
  min-height: 100vh;
}

/* 상단 중앙에 버튼 위치 조정 */
.header {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

/* 홈으로 돌아가기 버튼 */
.back-button {
  background-color: #EFFAD6;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #D5F2C1;
  transform: translateY(-3px);
}

.back-button:active {
  transform: translateY(0);
}

/* Admin Dashboard 제목 스타일 */
h1 {
  font-size: 32px;
  color: #333;
  margin: 30px 0;
  font-weight: bold;
  text-align: center;
}

/* 네비게이션 탭 스타일 */
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

/* 컴포넌트 영역 스타일 */
div {
  text-align: center;
  margin-bottom: 20px;
}
</style>
