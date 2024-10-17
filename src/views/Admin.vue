<template>
  <div class="admin-container">
    <!-- 홈 화면으로 돌아가기 버튼 -->
    <div class="header">
      <button class="back-button" @click="$router.push('/')">홈 화면으로 돌아가기</button>
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

/* 상단 중앙에 버튼 위치 조정 */
.header {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

/* 홈으로 돌아가기 버튼 */
.back-button {
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

.back-button:hover {
  background-color: #a8d1b7;
  transform: translateY(-3px);
}

.back-button:active {
  transform: translateY(0);
}

/* Admin Dashboard 제목 스타일 */
h1 {
  font-size: 32px;
  color: #4a6f5b;
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

.component-area {
  text-align: center;
  margin-top: 20px;
}


</style>
