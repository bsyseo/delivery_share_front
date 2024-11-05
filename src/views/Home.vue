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
        <h2>Today News</h2>
        <div class="cards-row">
          <div class="card small-card">
            <div class="card-content">
              <h3>New Sharing Feature Added</h3>
              <p>Now you can save on delivery fees with even more users.</p>
            </div>
          </div>
          <div class="card small-card">
            <div class="card-content">
              <h3>Version Updated</h3>
              <p>Ordering has become even more convenient with the new interface.</p>
            </div>
          </div>
        </div>
        <div class="featured-card">
          <div class="featured-content">
            <h3>Fresh Monday!</h3>
            <p>How about starting your week with a meal full of fresh vegetables? 
              Mondays are perfect for a healthy boost to set the tone for the rest of the week. 
              Imagine crisp, vibrant greens paired with your favorite flavors, 
              giving you the energy and nourishment you need to tackle the days ahead. 
              Make today a fresh start – enjoy a delicious and wholesome dish packed with nature’s best ingredients!</p>
          </div>
          <img src="@/assets/recommended-menu.png" alt="맞춤형 추천 메뉴" class="featured-media">
        </div><br>
        <div class="featured-card">
          <div class="featured-content">
            <h3>Kickstart Your Week with Fresh Energy</h3>
            <p>Begin your day with the perfect blend of coffee and fresh ingredients delivered right to your door. 
              Mondays are for setting a positive tone, and what better way than with a wholesome meal and your favorite brew? 
              Imagine the aroma of freshly brewed coffee complementing a nourishing dish made with the best ingredients – all designed to fuel your week. Let today be a fresh start, 
              where convenience meets quality, giving you everything you need to make each day exceptional!</p>
          </div>
          <video autoplay muted loop class="featured-media">
            <source :src="require('@/assets/video/home.mp4')" type="video/mp4" />
            동영상을 지원하지 않는 브라우저입니다.
          </video>
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

.login-section {
  margin-right: 50px;
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

/* 뉴스와 런칭 섹션 */
.section h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.cards-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.small-card {
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: left;
}

/* 추천 메뉴 스타일 */
.featured-card {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  align-items: center;
  padding: 20px;
  gap: 20px;
}

.featured-content {
  flex: 1;
  text-align: left;
}

.featured-content h3 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.featured-content p {
  font-size: 16px;
  color: #666;
}

/* 사진과 동영상 크기를 동일하게 설정 */
.featured-media {
  width: 300px;
  height: 400px;
  border-radius: 12px;
  object-fit: cover;
}

/* 카드 스타일 */
.horizontal-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.horizontal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 200px;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 20px;
  text-align: left;
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

.card-link {
  font-size: 14px;
  color: #1a73e8;
  text-decoration: none;
  margin-top: 10px;
  display: inline-block;
}

.card-link:hover {
  text-decoration: underline;
}

@font-face {
  font-family: 'IBMPlexSansKR';
  src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
}

* {
  font-family: 'IBMPlexSansKR', sans-serif;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .intro-section {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .home-content h1 {
    font-size: 36px;
  }

  .home-content p {
    font-size: 16px;
  }

  .login-section {
    margin-right: 0;
    margin-top: 20px;
    width: 100%;
  }

  .cards-row {
    flex-direction: column;
    gap: 15px;
  }

  .featured-card {
    flex-direction: column;
    text-align: center;
  }

  .featured-content h3 {
    font-size: 20px;
  }

  .featured-content p {
    font-size: 14px;
  }

  .featured-media {
    width: 100%;
    height: auto;
    max-width: 300px;
  }
}
</style>
