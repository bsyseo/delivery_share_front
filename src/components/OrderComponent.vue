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
            <!-- 이미지 항목들 -->
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
          <div class="white-box"></div>
          <div class="white-box"></div>
          <div class="white-box"></div>
        </div>

        <!-- 옵션 -->
        <div class="option">
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

    <!-- 로고 박스와 타임 박스를 한 쌍으로 표시 -->
    <div v-if="selectedMenu" class="bottom-grid">
      <div v-for="(orderList, storeUid) in orders" :key="storeUid" class="logo-time-pair">
        <!-- 상단 로고 박스 -->
        <div class="logo-box">
          <!-- 로고 이미지가 있을 경우에만 표시 -->
          <img v-if="logos[storeUid]" :src="logos[storeUid]" alt="Store Logo" />
          <div v-else>로고 없음</div> <!-- 로고가 없을 때 빈 박스를 표시 -->
        </div>

        <!-- 하단 시간표 박스 -->
        <div class="time-box">
          <p v-for="order in orderList.slice(0, 4)" :key="order.id">
            {{ formatReservationTime(order.reservationTime) || '시간 없음' }}
          </p>
          <!-- 스크롤을 추가하여 4개 이상의 시간이 있을 경우 더 볼 수 있게 함 -->
          <div v-if="orderList.length > 4" class="more-orders">
            <p v-for="order in orderList.slice(4)" :key="order.id" class="scrollable-order">
              {{ formatReservationTime(order.reservationTime) || '시간 없음' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, query, orderByChild, get } from 'firebase/database';
import { database } from '@/firebase'; // Firebase 설정 파일 경로
import moment from 'moment-timezone'; // Moment.js 사용

export default {
  name: 'OrderComponent',
  data() {
    return {
      selectedMenu: '', // 선택된 메뉴
      logos: [], // Firebase에서 가져온 로고 URL 배열
      orders: [], // Firebase에서 가져온 주문 목록
    };
  },
  methods: {
    showMenuDetails(menuType) {
      this.selectedMenu = menuType;
      this.fetchOrders(); // 메뉴 타입이 선택되면 주문 목록 가져오기
    },
    fetchOrders() {
      const ordersRef = query(ref(database, 'orders'), orderByChild('reservationTime'));

      get(ordersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const allOrders = snapshot.val();
            const now = moment().tz('Asia/Seoul');
            const groupedOrders = {};

            Object.keys(allOrders).forEach((key) => {
              const order = allOrders[key];
              if (
                order.reservationTime &&
                order.storeType === this.selectedMenu && // 선택된 메뉴와 storeType이 일치하는 주문만 필터링
                order.reservationTime > now.toISOString() // 현재 시간 이후의 주문만 필터링
              ) {
                const storeUid = order.storeUid;
                if (!groupedOrders[storeUid]) {
                  groupedOrders[storeUid] = [];
                }
                groupedOrders[storeUid].push({
                  id: key,
                  ...order,
                });
              }
            });

            // 각 storeUid별로 시간순 정렬 후 최대 4개의 주문만 표시
            Object.keys(groupedOrders).forEach((storeUid) => {
              groupedOrders[storeUid].sort(
                (a, b) => new Date(a.reservationTime) - new Date(b.reservationTime)
              );
            });

            this.orders = groupedOrders;
            this.fetchLogos(); // 로고도 같이 가져옴
          } else {
            this.orders = {};
          }
        })
        .catch((error) => {
          console.error('주문 정보를 가져오는 데 실패했습니다:', error);
        });
    },
    
    fetchLogos() {
      Object.keys(this.orders).forEach((storeUid) => {
        const logoRef = ref(database, `store/${storeUid}/logo`);
        get(logoRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.logos = { ...this.logos, [storeUid]: snapshot.val() };
            } else {
              this.$set(this.logos, storeUid, '');
            }
          })
          .catch((error) => {
            console.error('로고를 가져오는 데 실패했습니다:', error);
            this.$set(this.logos, storeUid, '');
          });
      });
    },
    
    formatReservationTime(reservationTime) {
      const now = moment().tz('Asia/Seoul');
      const time = moment(reservationTime).tz('Asia/Seoul');
      const dayDiff = time.diff(now, 'days');

      const formattedTime = time.format('HH:mm');
      let dayIndicator = '';
      if (dayDiff === 1) {
        dayIndicator = ' (D+1)';
      } else if (dayDiff === 2) {
        dayIndicator = ' (D+2)';
      }

      return `${formattedTime}${dayIndicator}`;
    },
    goToMyPage() {
      this.$router.push({ name: 'MyPage' }); // MyPage로 라우팅
    },
  },
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
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25), /* drop shadow */
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25); /* inner shadow */
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
  border-radius: 2vw;
  box-shadow: 0px 3.14px 3.14px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 옵션 버튼 스타일 */
.option {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container {
  display: flex;
  grid-gap: 10px;
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
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25),
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25);
}

/* 상단 박스 스타일 */
.logo-box {
  height: 150px;
  width: 180px;
  background-color: white;
  border-radius: 17px;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25),
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-box img {
  width: 80%;
  height: 80%;
  object-fit: contain; /* 이미지를 비율을 맞추면서 박스에 맞추기 */
}

/* 하단 박스 스타일 */
.time-box {
  height: 120px;
  width: 180px;
  margin-top: 10px;
  overflow-y: auto; /* 스크롤 활성화 */
  background-color: #FAF3E0;
  border-radius: 17px;
  box-shadow: 
    0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25),
    inset 0px 3.53px 3.53px 0px rgba(0, 0, 0, 0.25);
}

.more-orders {
  max-height: 100px;
  overflow-y: auto;
}

.scrollable-order {
  color: #333;
  padding: 5px 0;
}

.rounded-inner-drop-shadow-box {
  width: 100%;
  height: 60vh;
  padding: 20px;
  background-color: #97B762;
  border-radius: 0 0 100px 100px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
}

/* 로고와 시간표를 한 쌍으로 표시 */
.logo-time-pair {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
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
