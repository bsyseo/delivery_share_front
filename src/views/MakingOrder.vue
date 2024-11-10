<template>
  <div class="spot-order-dashboard">
    <!-- 상단 네비게이션 -->
    <nav class="top-navigation">
      <button class="nav-button" @click="$router.push('/')">홈 화면으로 돌아가기</button>
      <button class="nav-button" @click="$router.push('/order')">주문 페이지로 돌아가기</button>
    </nav>

    <!-- 메인 컨텐츠 -->
    <div class="main-content">
      <!-- 왼쪽 이미지 및 설명 섹션 -->
      <div class="info-section">
        <img src="@/assets/makingorder.png" alt="Order Illustration" class="info-image" />
        <p class="info-description">
          Gather people through delivery reservations to lower the delivery cost!
You can enjoy receiving food with reduced delivery fees.
If enough people join, you might even get free delivery!
        </p>
      </div>

      <!-- 주문 섹션 -->
      <div class="order-section">
        <div class="dashboard-item">
          <MakingOrderComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MakingOrderComponent from '@/components/MakingOrderComponent.vue';

export default {
  name: 'SpotOrderDashboard',
  components: {
    MakingOrderComponent
  }
};
</script>

<style scoped>
.spot-order-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #f3f4f6;
}

.top-navigation {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.nav-button {
  background-color: #6750A4;
  color: #FFFFFF;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-button:hover {
  background-color: #7F67BE;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-top: 20px;
  width: 100%;
  max-width: 1200px;
}

.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  text-align: center;
  padding: 16px;
}

.info-image {
  width: 400px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.info-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.info-description {
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
}

.order-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.dashboard-item {
  width: 700px;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
