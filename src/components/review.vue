<template>
  <div class="reviews-container">
    <h2>리뷰</h2>

    <!-- 리뷰 작성 섹션 -->
    <div class="write-review">
      <h3>리뷰 작성</h3>
      <textarea v-model="newReview" placeholder="리뷰를 작성하세요"></textarea>
      <button @click="submitReview">리뷰 제출</button>
      <button @click="viewReviews" class="view-reviews-button">리뷰 기록 보기</button>
    </div>

    <!-- 제출된 리뷰 표시 -->
    <div class="review-list" v-if="reviews.length">
      <h3>제출된 리뷰</h3>
      <ul>
        <li v-for="(review, index) in reviews" :key="index">{{ review }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserReview',
  data() {
    return {
      newReview: '',
      reviews: [], // 리뷰 목록
    };
  },
  methods: {
    submitReview() {
      if (this.newReview.trim()) {
        this.reviews.push(this.newReview);
        this.newReview = '';
      } else {
        alert('리뷰 내용을 입력해 주세요.'); // 빈 리뷰 제출 방지
      }
    },
    viewReviews() {
      // 리뷰 목록 보기 로직 구현
      alert('리뷰 목록 보기 기능은 아직 구현되지 않았습니다.'); // 예시
    }
  }
};
</script>

<style scoped>
.reviews-container {
  padding: 20px;
  background-color: #f4f9e9; /* 전체 배경색 */
  border-radius: 15px; /* 테두리 둥글게 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  max-width: 600px; /* 최대 너비 설정 */
  margin: auto; /* 가운데 정렬 */
}

.write-review {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size: 14px; /* 폰트 크기 조정 */
}

button {
  padding: 10px 15px;
  background-color: #4CAF50; /* 버튼 배경색 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px; /* 폰트 크기 조정 */
  margin-right: 10px; /* 버튼 간격 */
}

button:hover {
  background-color: #45A049; /* 버튼 호버 색상 */
}

.view-reviews-button {
  background-color: #007BFF; /* 다른 색상으로 변경 */
}

.view-reviews-button:hover {
  background-color: #0056b3; /* 버튼 호버 색상 */
}

.review-list ul {
  list-style-type: none;
  padding: 0;
}

.review-list li {
  margin-bottom: 10px;
  font-size: 14px; /* 폰트 크기 조정 */
}
</style>
