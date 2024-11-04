<template>
    <div class="home-container">
      <!-- 왼쪽 콘텐츠 -->
      <section class="main-content">
        <!-- 소개 및 로그인 섹션 -->
        <div class="intro-section">
          <div class="home-content">
            <h1>DELIVERY SHARE</h1>
            <p>배달비를 함께 나누고, 더 많은 사람과 음식을 즐기세요. <br />배달비 공유 플랫폼과 함께 편리한 주문 경험을 누려보세요!</p>
          </div>
          <div class="login-section">
            <LoginComponent />
          </div>
        </div>
  
        <!-- 뉴스와 런칭 섹션 -->
        <section class="section">
          <h2>뉴스 & 런칭</h2>
          <div class="cards">
            <div class="card">
              <h3>새로운 공유 기능 추가</h3>
              <p>이제 더 많은 사용자와 함께 배달비를 절약할 수 있습니다.</p>
            </div>
            <div class="card">
              <h3>업데이트된 주문 시스템</h3>
              <p>새로운 인터페이스로 주문이 더욱 편리해졌습니다.</p>
            </div>
            <div class="card">
              <h3>맞춤형 추천 메뉴</h3>
              <p>개인의 선호도에 맞는 메뉴를 추천받으세요.</p>
            </div>
          </div>
        </section>
  
        <!-- 플랫폼 업데이트 섹션 -->
        <section class="section">
          <h2>플랫폼 업데이트</h2>
          <div class="cards">
            <div class="card">
              <h3>커뮤니티 기능</h3>
              <p>배달비 공유 사용자들과 소통할 수 있는 커뮤니티 기능이 추가되었습니다.</p>
            </div>
            <div class="card">
              <h3>새로운 가게 등록</h3>
              <p>다양한 새로운 가게들이 플랫폼에 추가되었습니다.</p>
            </div>
            <div class="card">
              <h3>리뷰 시스템 강화</h3>
              <p>고객들의 리뷰를 통해 가게의 신뢰성을 확인하세요.</p>
            </div>
            <div class="card">
              <h3>개인화 설정</h3>
              <p>사용자마다 개별 맞춤형 설정이 가능해졌습니다.</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  </template>
  
  <script>
  import LoginComponent from '@/components/LoginComponent.vue';
  
  export default {
    name: 'HomeView',
    components: {
      LoginComponent
    }
  };
  </script>
  
  <style scoped>
  /* 전체 레이아웃 */
  .home-container {
    padding: 20px;
    background-color: #fafafa;
    min-height: 100vh;
  }
  
  /* 메인 콘텐츠 영역 */
  .main-content {
    max-width: 1200px;
    width: 100%;
    margin: auto;
  }
  
  /* 소개 및 로그인 섹션 */
  .intro-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f3ff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
  }
  
  .home-content {
    max-width: 600px;
  }
  
  .home-content h1 {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .home-content p {
    font-size: 18px;
    color: #666;
  }
  
  /* 로그인 섹션 */
  .login-section {
    max-width: 450px;
    width: 100%;
  }
  
  /* 카드 섹션 */
  .section {
    margin-bottom: 40px;
  }
  
  .section h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .card {
    flex: 1 1 calc(33.333% - 20px);
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
  }
  
  .card h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }
  
  .card p {
    font-size: 16px;
    color: #666;
  }
  
  @font-face {
    font-family: 'IBMPlexSansKR';
    src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
  }
  
  * {
    font-family: 'IBMPlexSansKR', sans-serif;
  }
  </style>
  