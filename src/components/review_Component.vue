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
    name: 'UserReviews',
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
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .reviews-container {
    padding: 20px;
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
  }
  
  button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .review-list ul {
    list-style-type: none;
    padding: 0;
  }
  
  .review-list li {
    margin-bottom: 10px;
  }
  </style>
  