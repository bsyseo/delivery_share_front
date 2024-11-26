<template>
    <div class="browse-review">
      <h1>리뷰 목록</h1>
      <ul>
        <li v-for="(review, index) in reviews" :key="index">
          {{ review }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, get } from 'firebase/database';
  import { database } from '@/firebase';
  
  export default {
    name: 'BrowseReview',
    props: {
      storeUid: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        reviews: [], // 리뷰 목록
      };
    },
    created() {
      this.fetchReviews();
    },
    methods: {
      fetchReviews() {
        const reviewRef = ref(database, `store/${this.storeUid}/reviews`);
        get(reviewRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.reviews = Object.values(snapshot.val());
            } else {
              this.reviews = ['리뷰가 없습니다.'];
            }
          })
          .catch((error) => {
            console.error('리뷰를 가져오는 데 실패했습니다:', error);
            this.reviews = ['리뷰 데이터를 가져오는 중 오류가 발생했습니다.'];
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .browse-review {
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 20px auto;
  }
  .browse-review h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  .browse-review ul {
    list-style: none;
    padding: 0;
  }
  .browse-review li {
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  