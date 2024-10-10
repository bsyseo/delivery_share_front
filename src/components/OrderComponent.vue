<template>
  <div class="main-container">
    <!-- 초록색 배경 부분 -->
    <div class="rounded-inner-drop-shadow-box">
      <!-- 헤더 부분 -->
      <div class="header">
        <label for="address">주소: 경상남도 진주시 진주대로 501 경상국립대학교 항공우주산학협력관</label>
      </div>

      <slot>
        <div class="order-box">
          <!-- 첫째 줄 이미지 -->
          <div class="image-grid">
            <div class="image-item" @click="showMenuDetails('한식')">
              <img src="@/assets/free-icon-bibimbap-2276931.png" alt="한식">
              <p>한식</p>
            </div>
            <div class="image-item" @click="showMenuDetails('중식')">
              <img src="@/assets/free-icon-chinese-food-3449347.png" alt="중식">
              <p>중식</p>
            </div>
            <div class="image-item" @click="showMenuDetails('일식')">
              <img src="@/assets/sushi_1f363.png" alt="일식">
              <p>일식</p>
            </div>
            <div class="image-item" @click="showMenuDetails('치킨')">
              <img src="@/assets/poultry-leg_1f357.png" alt="치킨">
              <p>치킨</p>
            </div>
            <div class="image-item" @click="showMenuDetails('피자')">
              <img src="@/assets/pizza_1f355.png" alt="피자">
              <p>피자</p>
            </div>
          </div>
          <!-- 둘째 줄 이미지 -->
          <div class="image-grid">
            <div class="image-item" @click="showMenuDetails('아시안푸드')">
              <img src="@/assets/cooked-rice_1f35a.png" alt="아시안푸드">
              <p>아시안푸드</p>
            </div>
            <div class="image-item" @click="showMenuDetails('패스트푸드')">
              <img src="@/assets/hamburger_1f354.png" alt="패스트푸드">
              <p>패스트푸드</p>
            </div>
            <div class="image-item" @click="showMenuDetails('양식')">
              <img src="@/assets/spaghetti_1f35d.png" alt="양식">
              <p>양식</p>
            </div>
            <div class="image-item" @click="showMenuDetails('디저트')">
              <img src="@/assets/shortcake_1f370.png" alt="디저트">
              <p>디저트</p>
            </div>
            <div class="image-item" @click="showMenuDetails('건강식')">
              <img src="@/assets/green-salad_1f957.png" alt="건강식">
              <p>건강식</p>
            </div>
          </div>
        </div>

        <!-- 초록색 박스 내부의 네모 버튼 -->
        <div class="order-box2">

          <!-- 흰색 박스 -->
          <div class="white-box"></div>
          <div class="white-box"></div>
          <div class="white-box"></div>
        </div>
        <!--옵션-->
        <div class=option>
          <div class="button-container">
            <button class="button green" @click="$router.push({ name: 'MakingOrder' })">예약 만들기</button>
            <button class="button green">오늘의 이벤트</button>
            <button class="button green">배달비 무료</button>
            <button class="button green">우리 동네 인기 가게</button>
            <button class="button green">가게 검색</button>
          </div>
        </div>
      </slot>
    </div>

    <!-- 박스들 (상단 6개: 직사각형, 하단 6개: 직사각형) -->
    <div v-if="selectedMenu" class="bottom-grid">
      <!-- 상단 로고 박스 (6개) -->
      <div class="logo-box" v-for="(item, index) in menuDetails[selectedMenu].logos" :key="index">
        <p>{{ item }}</p>
      </div>

      <!-- 하단 시간표 박스 (6개) -->
      <div class="time-box" v-for="(item, index) in menuDetails[selectedMenu].times" :key="index">
        <p>{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoundedInnerDropShadowBox',
  data() {
    return {
      localMarkerName: '', // 초기 값
      selectedMenu: '', // 선택된 메뉴
      menuDetails: {
        '한식': { logos: ['Logo 1', 'Logo 2', 'Logo 3', 'Logo 4', 'Logo 5', 'Logo 6'], times: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00'] },
        '중식': { logos: ['Logo A', 'Logo B', 'Logo C', 'Logo D', 'Logo E', 'Logo F'], times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] },
        '일식': { logos: ['Logo X', 'Logo Y', 'Logo Z', 'Logo W', 'Logo V', 'Logo U'], times: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'] },
        '치킨': { logos: ['치킨 1', '치킨 2', '치킨 3', '치킨 4', '치킨 5', '치킨 6'], times: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'] },
        '피자': { logos: ['피자 1', '피자 2', '피자 3', '피자 4', '피자 5', '피자 6'], times: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
        '아시안푸드': { logos: ['Asian 1', 'Asian 2', 'Asian 3', 'Asian 4', 'Asian 5', 'Asian 6'], times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] },
        '패스트푸드': { logos: ['Fast 1', 'Fast 2', 'Fast 3', 'Fast 4', 'Fast 5', 'Fast 6'], times: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00'] },
        '양식': { logos: ['Western 1', 'Western 2', 'Western 3', 'Western 4', 'Western 5', 'Western 6'], times: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'] },
        '디저트': { logos: ['Dessert 1', 'Dessert 2', 'Dessert 3', 'Dessert 4', 'Dessert 5', 'Dessert 6'], times: ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00'] },
        '건강식': { logos: ['Healthy 1', 'Healthy 2', 'Healthy 3', 'Healthy 4', 'Healthy 5', 'Healthy 6'], times: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00'] }
      }
    };
  },
  methods: {
    showMenuDetails(menu) {
      this.selectedMenu = menu;
    }
  },
  created() {
    // 마운트될 때 params로 전달된 주소 데이터를 받아 localMarkerName에 할당
    if (this.$route.params.markerName) {
      this.localMarkerName = this.$route.params.markerName;
    }
  }
};
</script>

<style scoped>
.main-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 헤더 스타일 */
.header {
  width: 100%;
  height: 5vh;
  padding: 5px;
  background-color: #EFFAD6;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25), /* drop shadow */
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25); /* inner shadow */
  display: flex;
  justify-content: center;
  align-items: center;
}

.header label {
  margin-right: 10px;
}

.header input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 60%;
  background-color: #f5f5f5;
}

/* 초록색 박스 내부 스타일 */
.order-box {
  width: 80%;
  margin: 5px auto;
  padding: 5px;
  background-color: #BFDC99;
  border-radius: 25px;
  box-shadow: 0px 3.14px 3.14px 0px rgba(0, 0, 0, 0.25);
}

/* 이미지 그리드 스타일 */
.image-grid {
  display: flex;
  justify-content: space-around;
  margin-bottom: 3px;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.image-item img {
  width: 40px; 
  height: 40px;
  object-fit: cover;
}

.image-item p {
  margin-top: 3px;
  font-size: 14px;
  text-align: center;
}

/* 초록색 박스 내부 버튼 스타일 */
.order-box2 {
  width: 60%;
  margin: 2vh auto; 
  padding: 1vh 3vw; 
  height: 20vh; 
  background-color: #BFDC99;
  border-radius: 2vw; /* 반지름도 비율에 따라 조정 */
  box-shadow: 0px 3.14px 3.14px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container {
  display: flex;
  grid-gap: 10px;
  width: auto;
  padding: 5px;
}

.button {
  background-color: #C8E6C9;
  color: #333;
  border: none;
  border-radius: 10px;
  padding: 7px;
  font-size: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.button.green {
  background-color: #EFFAD6;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25), /* drop shadow */
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25); /* inner shadow */
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.15);
}

.white-box {
  width: 30%;
  height: 120px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25), /* drop shadow */
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25); /* inner shadow */
}

/* 상단 박스 스타일 (세로 폭을 줄임) */
.logo-box {
  height: 150px;
  width: 180px;
  background-color: white;
  border-radius: 17px;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25), /* drop shadow */
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25); /* inner shadow */
}

/* 하단 박스 스타일 */
.time-box {
  height: 250px;
  width: 180px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #FAF3E0;
  border-radius: 17px;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25), /* drop shadow */
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25); /* inner shadow */
}

.rounded-inner-drop-shadow-box {
  width: 100%;
  height: 60vh;
  padding: 20px;
  background-color: #97B762;
  border-radius: 0 0 100px 100px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
}

.bottom-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 큰 화면에서는 6개의 열 */
  grid-gap: 20px;
  width: 90%; /* 너비를 고정값이 아닌 비율로 설정 */
  max-width: 1200px; /* 큰 화면에서의 최대 너비 설정 */
  margin: 30px auto;
}

</style>
