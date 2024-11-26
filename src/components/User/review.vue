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
          <button
            :disabled="order.hasReview"
            @click="selectOrderForReview(order)"
            :class="{ completed: order.hasReview }">
            {{ order.hasReview ? "리뷰 작성 완료" : "이 주문에 리뷰 작성" }}
          </button>
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
      <textarea v-model="newReview" placeholder="리뷰를 작성하세요"></textarea>
      <button @click="submitReview(selectedOrder)">리뷰 제출</button>
    </div>

    <!-- 제출된 리뷰 표시 -->
    <div class="submitted-reviews" v-if="reviews.length">
      <h3>제출된 리뷰</h3>
      <ul>
        <li v-for="review in reviews" :key="review.createdAt">
          <strong>{{ review.content }}</strong>
          <p><strong>작성 시각:</strong> {{ formatReservationTime(review.createdAt) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, set, get, onValue } from "firebase/database";
import { database } from "@/firebase";

export default {
  name: "UserReview",
  data() {
    return {
      newReview: "", // 새 리뷰
      reviews: [], // 리뷰 목록
      userUid: "", // 로그인된 사용자 UID
      orders: [], // 주문 목록
      selectedOrder: null, // 선택된 주문
      selectedReviewOrder: null, // 리뷰를 표시할 주문
    };
  },
  methods: {
    // 주문 기록을 가져오는 메소드
    fetchOrders() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      const memberRef = ref(database, "member");
      const ordersRef = ref(database, "orders");

      // Step 1: member 데이터 가져오기
      onValue(memberRef, (memberSnapshot) => {
        const memberData = memberSnapshot.val();
        if (!memberData) {
          this.orders = [];
          return;
        }

        // Step 2: orders 데이터 가져오기
        get(ordersRef)
          .then((orderSnapshot) => {
            const orderData = orderSnapshot.val();
            if (!orderData) {
              console.error("주문 데이터를 찾을 수 없습니다.");
              this.orders = [];
              return;
            }

            // Step 3: member와 order를 매핑하여 storeId 추가
            this.orders = Object.keys(memberData)
              .map((key) => {
                const member = memberData[key];
                const order = orderData[member.orderID];

                if (order) {
                  return {
                    orderID: member.orderID,
                    menu: member.menu,
                    quantity: member.quantity,
                    participate_time: member.participate_time,
                    creatorUid: member.uid,
                    memberId: key,
                    storeId: order.storeUid, // storeId 추가
                  };
                }
                return null;
              })
              .filter((order) => order && order.creatorUid === user.uid); // 로그인한 사용자 필터링

              // Step 4: 리뷰 상태 확인
              this.orders.forEach((order, index) => {
                const reviewCheckRef = ref(database, `review/${order.storeId}/${order.memberId}`);
                get(reviewCheckRef).then((snapshot) => {
                  if (snapshot.exists()) {
                    this.orders[index].hasReview = true;
                  }
                });
              });
          })
          .catch((error) => {
            console.error("주문 데이터를 가져오는 중 오류가 발생했습니다:", error);
            this.orders = [];
          });
      });
    },

    // 리뷰를 작성할 주문 선택
    selectOrderForReview(order) {
      this.selectedOrder = order; // 선택된 주문 정보 저장
      this.newReview = ""; // 리뷰 초기화
      this.fetchReviews(order.memberId); // 선택된 주문에 대한 리뷰 가져오기
    },

    // 리뷰 제출
    submitReview(order) {
      if (!order || !order.memberId) {
        console.error("order 또는 memberId가 누락되었습니다.", order);
        alert("리뷰를 제출할 대상이 올바르지 않습니다.");
        return;
      }

      if (this.newReview.trim()) {
        const newReviewData = {
          content: this.newReview,
          createdAt: new Date().toISOString(), // 작성 시각
          uid: this.userUid, // 현재 로그인한 사용자의 UID
        };

        if (!this.userUid) {
          console.error("현재 사용자의 UID가 누락되었습니다.");
          alert("로그인 상태를 확인해 주세요.");
          return;
        }

        // 리뷰 저장 경로: review/{storeId}/{memberId}
        const reviewRef = ref(database, `review/${order.storeId}/${order.memberId}`);
        set(reviewRef, newReviewData) // push 대신 set 사용
          .then(() => {
            alert("리뷰가 성공적으로 제출되었습니다.");
            this.newReview = ""; // 리뷰 초기화
            this.fetchReviews(order.memberId); // 리뷰 목록 업데이트
          })
          .catch((error) => {
            console.error("리뷰 제출 중 오류 발생:", error);
            alert("리뷰 제출에 실패했습니다. 다시 시도해 주세요.");
          });
      } else {
        alert("리뷰 내용을 입력해 주세요.");
      }
    },

    // 선택된 주문의 리뷰 목록 가져오기
    fetchReviews(memberId) {
      const reviewRef = ref(database, `member/${memberId}/reviews`);
      onValue(reviewRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.reviews = Object.keys(data).map((key) => ({
            ...data[key],
            id: key,
          }));
        } else {
          this.reviews = [];
        }
      });
    },

    // 날짜 포맷팅
    formatReservationTime(time) {
      if (!time) return "정보 없음";
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Seoul",
        hour12: false,
      };
      return new Date(time).toLocaleString("ko-KR", options);
    },
  },
  created() {
    const auth = getAuth();

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        this.userUid = currentUser.uid; // 로그인한 사용자의 UID 저장
        this.fetchOrders(); // 주문 목록 가져오기
      } else {
        this.resetUserData(); // 로그아웃 상태 처리
      }
    });
  },
  resetUserData() {
    this.userUid = ""; // UID 초기화
    this.orders = []; // 주문 목록 초기화
    this.reviews = []; // 리뷰 목록 초기화
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
