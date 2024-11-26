<template>
  <div class="container">
    <h1>관리자 리뷰 관리 페이지</h1>

    <!-- 리뷰 목록 -->
    <div v-if="reviews.length" class="reviews-list">
      <h2>리뷰 목록</h2>
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <strong>작성자 ID:</strong> {{ review.uid }} <!-- 작성자 UID -->
        </div>
        <div class="review-body">
          <strong>내용:</strong> {{ review.content }} <!-- 리뷰 내용 -->
          <br />
          <strong>작성 시간:</strong> {{ review.createdAt }} <!-- 작성 시간 -->
        </div>
      </div>
    </div>

    <!-- 리뷰가 없을 경우 메시지 -->
    <div v-else class="no-reviews">
      <p>현재 리뷰가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { ref, onValue } from "firebase/database";
import { database } from "@/firebase";

export default {
  name: 'AdminReviewManagement',
  data() {
    return {
      reviews: [], // 리뷰 데이터를 저장할 배열
      storeIds: [], // 스토어 ID 목록을 저장할 배열
    };
  },
  methods: {
    // Firebase에서 스토어 ID를 가져오는 메소드
    fetchStoreIds() {
      const storeRef = ref(database, 'store'); // 'store' 경로에서 모든 스토어 ID 불러오기
      onValue(storeRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.storeIds = Object.keys(data); // store 경로에 있는 모든 store ID를 배열에 저장
          this.fetchReviewsForStores(); // 스토어 ID를 가져온 후, 리뷰 데이터를 불러옵니다.
        } else {
          this.storeIds = [];
        }
      });
    },

    // 각 스토어에 대한 리뷰 데이터를 불러오는 메소드
    fetchReviewsForStores() {
      this.storeIds.forEach(storeId => {
        const reviewRef = ref(database, `review/${storeId}`); // review/{storeId} 경로에서 리뷰 불러오기
        onValue(reviewRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            Object.keys(data).forEach(memberId => {
              const reviewData = data[memberId];
              this.reviews.push({
                id: memberId,
                content: reviewData.content,  // 리뷰 내용
                createdAt: reviewData.createdAt,  // 작성 시간
                uid: reviewData.uid,  // 작성자 ID
              });
            });
          }
        });
      });
    },
  },
  created() {
    this.fetchStoreIds(); // 페이지 로드 시 스토어 ID 목록을 불러오기
  }
};
</script>

<style scoped>
.container {
  padding: 30px;
  background-color: #f4f6f8;
  font-family: 'IBMPlexSansKR', sans-serif;
  border-radius: 32px;
  width: 1000px;
}

h1 {
  color: #2b2d42;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
}

h2 {
  color: #555;
  font-size: 20px;
  margin-bottom: 15px;
}

.reviews-list {
  width: 100%;
  margin-top: 2vh;
}

.review-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}

.review-header {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}

.review-body {
  color: #555;
  margin-bottom: 15px;
}

.no-reviews {
  text-align: center;
  color: #888;
}

@font-face {
  font-family: 'IBMPlexSansKR';
  src: url('@/assets/font/IBMPlexSansKR-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

/* 모든 요소에 기본 폰트 설정 */
* {
  font-family: 'IBMPlexSansKR', sans-serif;
}
</style>
