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
        <input type="text" v-model="newQuestion" placeholder="질문을 입력하세요" />
        <button @click="submitQuestion">질문 제출</button>
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
    name: 'QnA',
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
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .qna-container {
    padding: 20px;
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
  
  input {
    padding: 10px;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  
  button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  