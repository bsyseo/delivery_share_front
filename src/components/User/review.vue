<template>
  <div class="reviews-container">
    <h2>리뷰</h2>

    <!-- 리뷰 작성 섹션 -->
    <div class="write-review">
      <h3>리뷰 작성</h3>
      <textarea v-model="newReview" placeholder="리뷰를 작성하세요"></textarea>
      <button @click="submitReview">리뷰 제출</button>
    </div>

    <!-- 제출된 리뷰 표시 -->
    <div class="submitted-questions" v-if="reviews.length">
      <h3>제출된 리뷰</h3>
      <ul>
        <li v-for="review in reviews" :key="review.id">
          <strong>{{ review.content }}</strong>
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
    };
  },
  methods: {
    submitReview() {
      if (this.newReview.trim()) {
        if (!this.userUid) {
          alert("로그인이 필요합니다.");
          return;
        }

        const newReviewData = {
          content: this.newReview,
          writer: this.userUid,
          createdAt: new Date().toISOString(),
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
    fetchReviews() {
      const reviewsRef = ref(database, 'reviews');
      onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.reviews = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((review) => review.writer === this.userUid);
        } else {
          this.reviews = [];
        }
      });
    },
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userUid = user.uid;
        this.fetchReviews(); // 로그인된 사용자의 리뷰 불러오기
      } else {
        this.userUid = '';
        this.reviews = []; // 로그아웃 시 리뷰 초기화
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

.submitted-questions {
  margin-top: 40px;
}

.submitted-questions ul {
  list-style: none;
  padding: 0;
}

.submitted-questions li {
  padding: 12px 15px;
  border-radius: 8px;
  background-color: #f7f9fc;
  margin-bottom: 10px;
  border: 1px solid #ddd;
}

.submitted-questions li strong {
  font-size: 1em;
  color: #6c4fbd; /* 보라색 */
  margin-bottom: 5px;
  display: block;
}

.submitted-questions p {
  text-align: center;
  color: #888;
  font-size: 1em;
}
</style>
