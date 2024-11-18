<template>
  <div class="spot-order-dashboard">
    <!-- 대시보드 그리드 레이아웃 -->
    <div class="dashboard-grid">
      <!-- Map Introduction Section -->
      <div class="dashboard-item intro-section">
        <h2>Delivery Spot Map</h2>
        <p>지도를 사용하여 원하는 배달 장소를 선택하고 설정하세요.</p>
        <!-- 홈 및 마이페이지 버튼 추가 -->
        <div class="button-group">
          <router-link to="/" class="custom-button">홈으로 가기</router-link>
          <router-link to="/UserMypage" class="custom-button">마이페이지로 가기</router-link>
        </div>
      </div>

      <!-- Map Section -->
      <div class="dashboard-item map-section">
        <MapComponent @select-address="updateSelectedAddress" />
      </div>
    </div>

    <!-- 주문 페이지 섹션 -->
    <div class="order-section">
      <h2>주문 하기</h2>
      
      <!-- 선택된 주소 표시 -->
      <div class="selected-address">
        <strong>주소:</strong> {{ selectedAddress || "주소 정보가 없습니다." }}
      </div>
      
      <OrderComponent />
    </div>
  </div>
</template>

<script>
import MapComponent from '@/components/Order/MapComponent.vue';
import OrderComponent from '@/components/Order/OrderComponent.vue';
import { database, ref, onValue } from '@/firebase';

export default {
  name: 'SpotOrderDashboard',
  components: {
    MapComponent,
    OrderComponent
  },
  data() {
    return {
      selectedAddress: "" // 선택된 주소를 저장할 변수, 초기값은 빈 문자열
    };
  },
  methods: {
    fetchSelectedAddress() {
      const placeDetailRef = ref(database, 'pickupZones');
      onValue(placeDetailRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const firstDetail = Object.values(data)[0]?.detail;
          this.selectedAddress = firstDetail || '주소 정보가 없습니다.';
        }
      });
    },
    updateSelectedAddress(detail) {
      this.selectedAddress = detail;
    }
  },
  mounted() {
    this.fetchSelectedAddress();
  }
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

.spot-order-dashboard {
  font-family: 'IBMPlexSansKR', sans-serif;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
}

.dashboard-item {
  background-color: #f7f3ff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
}

.intro-section h2 {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.intro-section p {
  font-size: 18px;
  color: #666;
}

/* 홈 및 마이페이지 버튼 스타일 */
.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
}

.custom-button {
  background-color: #6750A4;
  color: #ffffff;
  padding: 12px 0;
  width: 150px; /* 버튼의 크기를 같게 설정 */
  border-radius: 20px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.custom-button:hover {
  background-color: #7f67be;
}

/* 지도 영역 스타일 */
.map-section {
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
}

#map {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 16px;
}

/* 주문 섹션 스타일 */
.order-section {
  width: 100%;
  max-width: 1200px;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  margin-top: 40px;
}

.order-section h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.order-section p {
  font-size: 18px;
  color: #666;
  margin-bottom: 24px;
}

/* 선택된 주소 스타일 */
.selected-address {
  font-size: 16px;
  color: #333;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  display: inline-block;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .intro-section h2 {
    font-size: 28px;
  }

  .intro-section p {
    font-size: 16px;
  }

  .order-section h2 {
    font-size: 24px;
  }

  .order-section p {
    font-size: 16px;
  }
}
</style>
