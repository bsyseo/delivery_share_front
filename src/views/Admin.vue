<template>
    <div>
      <!-- AdminComponent를 메인 화면에 표시 -->
      <AdminComponent />
  
      <h1>Admin Dashboard</h1>
      <div>
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
    }
  };
  </script>
  
  <style scoped>
  /* 기본 스타일 */
  button {
    margin: 5px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  h1 {
    margin-top: 20px;
    text-align: center;
  }
  
  div {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
  