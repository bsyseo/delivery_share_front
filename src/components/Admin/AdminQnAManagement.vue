<template>
  <div class="container">
    <h1>관리자 Q&A 관리 페이지</h1>

    <!-- 질문 목록 -->
    <div v-if="questions.length" class="questions-list">
      <h2>질문 목록</h2>
      <div v-for="(question) in questions" :key="question.id" class="question-card">
        <div class="question-header">
          <strong>작성자:</strong> {{ question.writer }}
        </div>
        <div class="question-header">
          <strong>제목:</strong> {{ question.title }}
        </div>
        <div class="question-body">
          <strong>내용:</strong> {{ question.content }}
        </div>

        <!-- 답글 입력 -->
        <textarea 
          v-if="!question.answered" 
          v-model="question.reply" 
          placeholder="답글을 작성하세요" 
          class="reply-input">
        </textarea>
        
        <div class="submit-container">
          <button 
            @click="submitAnswer(question)" 
            class="submit-btn" 
            :disabled="question.answered">
            답글 제출
          </button>
        </div>

        <div v-if="question.answered">
          <p><strong>답변 완료:</strong> {{ question.answer }}</p>
        </div>
      </div>
    </div>

    <!-- 질문이 없을 경우 메시지 -->
    <div v-else class="no-questions">
      <p>현재 질문이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { ref, onValue, update } from "firebase/database";
import { database } from "@/firebase";

export default {
  name: 'AdminQnAManagement',
  data() {
    return {
      questions: [], // 모든 질문 데이터를 저장할 배열
      successMessageShown: false, // 성공 메시지 표시 여부 추적
    };
  },
  methods: {
    // 질문 목록을 불러오는 메소드
    fetchQuestions() {
      const questionsRef = ref(database, 'questions');
      onValue(questionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.questions = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            reply: '', // 답글 입력을 위한 속성 초기화
            answered: data[key].answered || false, // 질문의 답변 상태 초기화
            answer: data[key].answer || '' // 기존 답변 내용 초기화
          }));
        } else {
          this.questions = [];
        }
      });
    },

    // 답글을 제출하는 메소드
    submitAnswer(question) {
      const reply = question.reply.trim();
      if (reply) {
        const questionRef = ref(database, `questions/${question.id}`);
        
        const answerData = {
          answer: reply,                      // 사용자가 입력한 답글
          answeredAt: new Date().toISOString(), // 답글 작성 시간
          answerer: '관리자'                   // 답변자 정보
        };

        // 질문 경로에 답변 데이터를 추가
        update(questionRef, answerData) // answered 필드 제거
        .then(() => {
          alert('답변이 성공적으로 저장되었습니다.');
          this.fetchQuestions(); // 질문 목록 새로고침
        })
        .catch((error) => {
          console.error('답변 저장 중 오류 발생:', error);
          alert('답변 저장 중 오류가 발생했습니다.');
        });
      } else {
        alert('답글 내용을 입력해 주세요.');
      }
    },
  },
  created() {
    this.fetchQuestions(); // 페이지 로드 시 질문 목록 불러오기
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

.questions-list {
  width: 100%;
  margin-top: 2vh;
}

.question-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}

.question-header {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}

.question-body {
  color: #555;
  margin-bottom: 15px;
}

.reply-input {
  width: 70%; 
  max-width: 600px;
  height: 100px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1em;
  margin-bottom: 10px;
  resize: none;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background-color: #3700b3;
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.no-questions {
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
