<template>
    <div class="browse-review">
        <h1>리뷰 목록</h1>
        <ul>
        <!-- reviews 배열의 각 리뷰 데이터를 구조화하여 출력 -->
        <li v-for="(review, index) in reviews" :key="index">
            <p><strong>리뷰 내용:</strong> {{ review.content }}</p>
            <p><strong>작성 시각:</strong> {{ formatTimestamp(review.createdAt) }}</p>
            <p><strong>작성자 ID:</strong> {{ review.uid }}</p>
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
            if (!this.storeUid) {
                console.error("storeUid가 누락되었습니다.");
                this.reviews = ['리뷰를 불러올 수 없습니다.'];
                return;
            }

            console.log("storeUid:", this.storeUid); // storeUid 확인

            const ordersRef = ref(database, "orders");
            get(ordersRef)
                .then((snapshot) => {
                    if (!snapshot.exists()) {
                        console.error("주문 데이터를 찾을 수 없습니다.");
                        return [];
                    }

                    const orders = snapshot.val();
                    console.log("Orders 데이터:", orders); // Orders 데이터 확인

                    const matchingOrderIds = Object.keys(orders).filter(
                        (orderId) => orders[orderId].storeUid === this.storeUid
                    );

                    console.log("매칭된 Order IDs:", matchingOrderIds); // 매칭된 orderId 확인
                    return matchingOrderIds; // 다음 단계로 orderId 전달
                })
                .then((orderIds) => {
                    if (!orderIds.length) {
                        console.log("관련 주문이 없습니다.");
                        return [];
                    }

                    console.log("Order IDs 전달됨:", orderIds); // 전달된 orderIds 확인

                    const memberRef = ref(database, "member");
                    return get(memberRef).then((snapshot) => {
                        if (!snapshot.exists()) {
                            console.error("참여자 데이터를 찾을 수 없습니다.");
                            return [];
                        }

                        const members = snapshot.val();
                        console.log("Members 데이터:", members); // Members 데이터 확인

                        const matchingMemberIds = Object.keys(members).filter((memberId) =>
                            orderIds.includes(members[memberId].orderID)
                        );

                        console.log("매칭된 Member IDs:", matchingMemberIds); // 매칭된 memberId 확인
                        return matchingMemberIds; // 다음 단계로 memberId 전달
                    });
                })
                .then((memberIds) => {
                    if (!memberIds.length) {
                        console.log("관련 멤버가 없습니다.");
                        this.reviews = ['관련된 리뷰가 없습니다.'];
                        return [];
                    }

                    console.log("Member IDs 전달됨:", memberIds); // 전달된 memberIds 확인

                    const reviewsPromises = memberIds.map((memberId) => {
                        const reviewRef = ref(database, `review/${this.storeUid}/${memberId}`);
                        console.log("리뷰 경로:", `review/${this.storeUid}/${memberId}`); // 리뷰 경로 확인

                        return get(reviewRef).then((snapshot) => {
                            if (snapshot.exists()) {
                                console.log(`리뷰 데이터 (${memberId}):`, snapshot.val()); // 리뷰 데이터 확인
                                return snapshot.val(); // 객체 그대로 반환
                            }
                            console.log(`리뷰 없음 (${memberId})`); // 리뷰 없음 확인
                            return null;
                        });
                    });

                    return Promise.all(reviewsPromises);
                })
                .then((reviewsList) => {
                    // 리뷰 데이터 병합
                    this.reviews = reviewsList
                        .filter((review) => review !== null) // null 값 제거
                        .map((review) => ({
                            content: review.content,
                            createdAt: review.createdAt,
                            uid: review.uid,
                        }));
                    console.log("병합된 리뷰 목록:", this.reviews); // 병합된 리뷰 확인

                    if (!this.reviews.length) {
                        console.warn("리뷰 데이터가 비어 있습니다.");
                        this.reviews = ['리뷰가 없습니다.'];
                    }
                })
                .catch((error) => {
                    console.error("리뷰를 가져오는 중 오류가 발생했습니다:", error);
                    this.reviews = ['리뷰 데이터를 가져오는 중 오류가 발생했습니다.'];
                });
        },

        formatTimestamp(timestamp) {
            if (!timestamp) {
                console.warn("포맷팅할 timestamp가 없습니다:", timestamp);
                return "정보 없음";
            }
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                console.error("잘못된 timestamp입니다:", timestamp);
                return "정보 없음";
            }
            return date.toLocaleString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    }
}

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
  
