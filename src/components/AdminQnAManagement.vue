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
        <textarea v-model="question.reply" placeholder="답글을 작성하세요" class="reply-input"></textarea>
        <div class="submit-container">
          <button @click="submitAnswer(question.id, question.reply, question.writer)" class="submit-btn">답글 제출</button>
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
import { ref, onValue, push, remove } from "firebase/database";
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
          }));
        } else {
          this.questions = [];
        }
      });
    },

    // 답글을 제출하는 메소드
    submitAnswer(questionId, reply, questionWriter) {
      if (reply.trim()) {
        // 답글 데이터를 Firebase에 저장할 형식
        const answerData = {
          questionId: questionId, // 해당 질문 ID
          answer: reply, // 사용자가 작성한 답글
          answeredAt: new Date().toISOString(), // 답글 작성 시간
          questionWriter: questionWriter, // 질문을 작성한 사람 (사용자 정보)
          answerer: '관리자', // 답변자는 '관리자'로 설정
        };

        // Firebase의 'questions_answer' 경로에 답글 저장
        const answersRef = ref(database, 'questions_answer');
        push(answersRef, answerData)
          .then(() => {
            // 답글 저장 성공 시 성공 메시지를 한 번만 띄움
            if (!this.successMessageShown) {
              alert('답글 저장 성공');
              this.successMessageShown = true;
            }
            // 답글을 작성한 후 해당 질문을 Firebase에서 삭제하고, UI에서 제거
            this.removeQuestionFromList(questionId);
          })
          .catch((error) => {
            console.error('답글 저장 중 오류 발생:', error);
          });
      } else {
        alert('답글 내용을 입력해 주세요.');
      }
    },

    // 질문을 Firebase에서 삭제하고 UI에서 제거하는 메소드
    removeQuestionFromList(questionId) {
      // Firebase에서 해당 질문 삭제
      const questionRef = ref(database, `questions/${questionId}`);
      remove(questionRef)
        .then(() => {
          // Firebase에서 질문 삭제 후 배열에서 해당 질문을 제거하고 UI에 실시간 반영
          this.questions = this.questions.filter((q) => q.id !== questionId);
        })
        .catch((error) => {
          console.error('삭제 중 오류 발생:', error);
        });
    }
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
