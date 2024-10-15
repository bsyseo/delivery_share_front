<template>
  <div class="qna-container">
    <h2>Q&A</h2>

    <!-- FAQ 섹션 -->
    <div class="faq-section">
      <h3>자주 묻는 질문</h3>
      <ul>
        <li>
          <strong>Q: 배달 시간은 얼마나 걸리나요?</strong>
          <p>A: 평균적으로 30~40분이 소요됩니다.</p>
        </li>
        <li>
          <strong>Q: 배달비는 얼마인가요?</strong>
          <p>A: 배달비는 거리와 주문 금액에 따라 달라집니다.</p>
        </li>
        <li>
          <strong>Q: 주문 취소는 어떻게 하나요?</strong>
          <p>A: 주문 내역에서 취소 버튼을 통해 가능합니다.</p>
        </li>
      </ul>
    </div>

    <!-- 질문 작성 섹션 -->
    <div class="ask-question">
      <h3>질문하기</h3>
      <div class="input-container">
        <input type="text" v-model="newQuestion" placeholder="질문을 입력하세요" />
        <button @click="submitQuestion">질문 제출</button>
      </div>
    </div>

    <!-- 제출된 질문 표시 -->
    <div class="submitted-questions" v-if="questions.length">
      <h3>제출된 질문</h3>
      <ul>
        <li v-for="(question, index) in questions" :key="index">{{ question }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QnAComponent',
  data() {
    return {
      newQuestion: '',
      questions: [], // 질문 목록
    };
  },
  methods: {
    submitQuestion() {
      if (this.newQuestion.trim()) {
        this.questions.push(this.newQuestion);
        this.newQuestion = '';
      } else {
        alert('질문을 입력해 주세요.');
      }
    },
  },
};
</script>

<style scoped>
.qna-container {
  padding: 20px;
  background-color: #f4f9e9; /* 배경색 */
  border-radius: 15px; /* 테두리 둥글게 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  max-width: 600px; /* 최대 너비 설정 */
  margin: auto; /* 가운데 정렬 */
}

.faq-section {
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
}

.input-container {
  display: flex;
  align-items: center; /* 수직 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
}

input {
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 70%; /* 너비 조정 */
}

button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45A049; /* 버튼 호버 색상 */
}
</style>
