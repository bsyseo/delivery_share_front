<template>
  <div class="reviews-container">
    <h2>리뷰</h2>

    <!-- 주문 기록 목록 -->
    <div class="order-history">
      <h3>주문 목록</h3>
      <ul v-if="orders.length">
        <li v-for="order in orders" :key="order.orderID" class="order-item">
          <strong>주문 번호:</strong> {{ order.orderID }}
          <p><strong>주문 날짜:</strong> {{ formatReservationTime(order.participate_time) || '정보 없음' }}</p>
          <p><strong>메뉴:</strong> {{ order.menu }}</p>
          <p><strong>수량:</strong> {{ order.quantity }}</p>
          <!-- 각 주문에 대한 리뷰 작성 버튼 -->
          <button @click="selectOrderForReview(order)">이 주문에 리뷰 작성</button>
        </li>
      </ul>
      <p v-else>주문 기록이 없습니다.</p>
    </div>

    <!-- 리뷰 작성 섹션 -->
    <div v-if="selectedOrder" class="write-review">
      <h3>리뷰 작성</h3>
      <p><strong>주문 번호:</strong> {{ selectedOrder.orderID }}</p>
      <p><strong>메뉴:</strong> {{ selectedOrder.menu }}</p>
      <p><strong>예약 날짜:</strong> {{ formatReservationTime(selectedOrder.participate_time) }}</p>
      <!-- 리뷰 작성 입력란 -->
      <textarea v-model="newReview" placeholder="리뷰를 작성하세요"></textarea>
      <button @click="submitReview(selectedOrder.orderID)">리뷰 제출</button>
    </div>

    <!-- 제출된 리뷰 표시 -->
    <div class="submitted-reviews" v-if="reviews.length">
      <h3>제출된 리뷰</h3>
      <ul>
        <li v-for="review in reviews" :key="review.id">
          <strong>{{ review.content }}</strong>
          <p><strong>주문 번호:</strong> {{ review.orderID }}</p> <!-- 주문 번호 표시 -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, push, onValue } from "firebase/database";
import { database } from "@/firebase";

export default {
  name: 'UserReview',
  data() {
    return {
      newReview: '',  // 새 리뷰
      reviews: [], // 리뷰 목록
      userUid: '', // 로그인된 사용자 UID
      orders: [], // 주문 목록
      selectedOrder: null, // 선택된 주문
    };
  },
  methods: {
    // 주문 기록을 가져오는 메소드
    fetchOrders() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      const memberRef = ref(database, 'member'); // 'member' 경로에서 주문 기록을 가져옴
      onValue(memberRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.orders = Object.keys(data).map((key) => ({
            orderID: data[key].orderID,
            menu: data[key].menu,
            quantity: data[key].quantity,
            participate_time: data[key].participate_time,
            creatorUid: data[key].uid,
          })).filter(order => order.creatorUid === user.uid); // 로그인된 사용자만 주문 가져오기
        } else {
          this.orders = [];
        }
      });
    },

    // 리뷰를 작성할 주문 선택
    selectOrderForReview(order) {
      this.selectedOrder = order; // 선택된 주문 정보를 저장
      this.newReview = ''; // 리뷰 내용 초기화
    },

    // 리뷰 제출
    submitReview(orderID) {
      if (this.newReview.trim()) {
        const newReviewData = {
          content: this.newReview,
          writer: this.userUid,
          createdAt: new Date().toISOString(),
          orderID: orderID, // 주문 ID와 연결
        };

        const reviewsRef = ref(database, 'reviews');
        push(reviewsRef, newReviewData)
          .then(() => {
            alert('리뷰가 성공적으로 제출되었습니다.');
            this.newReview = ''; // 제출 후 리뷰 내용 초기화
            this.fetchReviews(); // 새로운 리뷰 제출 후 목록 업데이트
          })
          .catch((error) => {
            console.error('리뷰 제출 중 오류 발생:', error);
            alert('리뷰 제출에 실패했습니다. 다시 시도해 주세요.');
          });
      } else {
        alert('리뷰 내용을 입력해 주세요.');
      }
    },

    // 리뷰 목록을 가져오는 메소드
    fetchReviews() {
      const reviewsRef = ref(database, 'reviews');
      onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.reviews = [];
          Object.keys(data).forEach((key) => {
            const review = data[key];
            this.reviews.push(review); // 모든 리뷰 목록 가져오기
          });
        } else {
          this.reviews = [];
        }
      });
    },

    // 주문 날짜 포맷팅
    formatReservationTime(reservationTime) {
      if (!reservationTime) return '정보 없음';
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Seoul',
        hour12: false,
      };
      return new Date(reservationTime).toLocaleString('ko-KR', options);
    },
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userUid = user.uid;
        this.fetchOrders(); // 주문 목록을 불러옴
        this.fetchReviews(); // 리뷰 목록을 불러옴
      } else {
        this.userUid = '';
        this.reviews = [];
        this.orders = [];
      }
    });
  },
};
</script>

<style scoped>
.reviews-container {
  padding: 20px;
  background-color: #ffffff; /* 배경색을 흰색으로 변경 */
  border-radius: 15px; /* 테두리 둥글게 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  max-width: 700px; /* 최대 너비 설정 */
  margin: auto; /* 가운데 정렬 */
}

h2 {
  font-size: 1.8em;
  margin-bottom: 1em;
  text-align: center;
  color: #6c4fbd; /* 보라색 */
}

h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #6c4fbd; /* 보라색 */
  font-weight: bold;
}

.write-review {
  margin-bottom: 20px;
  text-align: center; /* 가운데 정렬 */
}

textarea {
  width: 100%;
  height: 150px; /* 크기 조정 */
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size: 16px; /* 폰트 크기 증가 */
  display: block;
  margin-left: auto;
  margin-right: auto;
}

button {
  padding: 12px 20px; /* 크기 증가 */
  background-color: #6c4fbd; /* 보라색 */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px; /* 폰트 크기 증가 */
  transition: background-color 0.3s;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

button:hover {
  background-color: #5a3c9a; /* 다크 보라색 */
}

.submitted-reviews {
  margin-top: 40px;
}

.submitted-reviews ul {
  list-style: none;
  padding: 0;
}

.order-history ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.submitted-reviews li {
  padding: 12px 15px;
  border-radius: 8px;
  background-color: #f7f9fc;
  margin-bottom: 10px;
  border: 1px solid #ddd;
}

.submitted-reviews li strong {
  font-size: 1em;
  color: #6c4fbd; /* 보라색 */
  margin-bottom: 5px;
  display: block;
}

.submitted-reviews p {
  text-align: center;
  color: #888;
  font-size: 1em;
}

.order-history {
  margin-top: 20px;
}

.order-item {
  margin-bottom: 10px;
  background-color: #f7f7f7;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.order-item button {
  background-color: #6c4fbd;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 8px 16px;
  margin-top: 10px;
}

.order-item button:hover {
  background-color: #5a3c9a;
}
</style>
