<template>
  <div class="qna-container">
    <h2>Q&A</h2>

    <!-- FAQ Section -->
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

    <!-- Question Submission Section -->
    <div class="ask-question">
      <h3>질문하기</h3>
      <div class="input-container">
        <input type="text" v-model="newTitle" placeholder="제목을 입력하세요" />
        <input type="text" v-model="newQuestion" placeholder="질문을 입력하세요" />
        <button @click="submitQuestion">질문 제출</button>
      </div>
    </div>

    <!-- Submitted Questions Display -->
    <div class="submitted-questions">
      <h3>제출된 질문</h3>

      <!-- 최신 3개 질문 표시 -->
      <ul v-if="recentQuestions.length">
        <li v-for="(question, index) in recentQuestions" :key="index">
          <strong>{{ question.title }}:</strong> {{ question.content }}
          <div v-if="question.answered">
            <p>답변 완료</p>
            <p><strong>답변:</strong> {{ question.answer }}</p>
          </div>
          <div v-else>
            <p>답변 대기 중</p>
          </div>
        </li>
      </ul>

      <!-- 그 외 질문 표시 -->
      <div v-if="otherQuestions.length && !showAllQuestions">
        <p>그 외 질문은 <a href="#" @click="toggleShowAllQuestions">전체 기록 보기</a> 버튼을 클릭하여 확인해주세요.</p>
      </div>
      
      <ul v-if="showAllQuestions && otherQuestions.length">
        <li v-for="(question, index) in otherQuestions" :key="index">
          <strong>{{ question.title }}:</strong> {{ question.content }}
          <div v-if="question.answered">
            <p>답변 완료</p>
            <p><strong>답변:</strong> {{ question.answer }}</p>
          </div>
          <div v-else>
            <p>답변 대기 중</p>
          </div>
        </li>
      </ul>

      <p v-else>질문이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { database } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { ref, set, push, onValue, query, orderByChild, equalTo } from "firebase/database";

export default {
  name: 'QnAComponent',
  data() {
    return {
      newTitle: '', // 새로 입력할 질문 제목
      newQuestion: '', // 새로 입력할 질문 내용
      questions: [], // 사용자의 모든 질문 목록
      recentQuestions: [], // 최신 3개 질문
      otherQuestions: [], // 그 외 질문
      showAllQuestions: false, // 전체 기록 보기 여부
    };
  },
  mounted() {
    this.fetchUserQuestions();
  },
  methods: {
    async submitQuestion() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && this.newTitle.trim() && this.newQuestion.trim()) {
        const questionData = {
          title: this.newTitle,                     // 작성자가 입력한 제목
          content: this.newQuestion,                // 작성자가 입력한 질문 내용
          createdAt: new Date().toISOString(),      // 작성 시간
          writer: user.uid                          // 작성자 UID
        };

        try {
          const questionsRef = ref(database, "questions");
          const newQuestionRef = push(questionsRef);   // 새로운 키 생성
          await set(newQuestionRef, questionData);     // 데이터를 지정된 구조로 저장

          this.newTitle = '';
          this.newQuestion = '';
          this.fetchUserQuestions(); // 질문 제출 후 사용자 질문을 새로고침
        } catch (error) {
          console.error("질문을 제출하는 도중 오류가 발생했습니다: ", error);
          alert("질문을 제출하는 도중 오류가 발생했습니다.");
        }
      } else {
        alert('제목과 질문을 모두 입력해 주세요.');
      }
    },

    fetchUserQuestions() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const questionsRef = ref(database, "questions");

        onValue(questionsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            let updatedQuestions = [];

            // 각 질문에 대해 답변을 가져오도록 처리
            Object.keys(data).forEach((key) => {
              const question = data[key];
              if (question.writer === user.uid) {
                const questionWithAnswer = { 
                  id: key,
                  title: question.title,
                  content: question.content,
                  createdAt: question.createdAt,
                  answered: false,
                  answer: ''
                };

                // 해당 질문에 대한 답변을 가져오기
                const answersRef = ref(database, `questions_answer`);
                const answersQuery = query(answersRef, orderByChild('questionId'), equalTo(key)); // questionId로 필터링
                onValue(answersQuery, (answerSnapshot) => {
                  const answers = answerSnapshot.val();
                  if (answers) {
                    Object.keys(answers).forEach((answerKey) => {
                      const answer = answers[answerKey];
                      if (answer.questionId === key && answer.questionWriter === user.uid) {
                        questionWithAnswer.answered = true;
                        questionWithAnswer.answer = answer.answer;
                      }
                    });
                  }

                  updatedQuestions.push(questionWithAnswer); // 질문에 대한 답변 처리 후 추가
                  this.questions = updatedQuestions; // 새로 업데이트된 질문 목록을 반영

                  // 최신 3개 질문과 나머지 질문 분리
                  this.recentQuestions = updatedQuestions.slice(0, 3); // 최신 3개
                  this.otherQuestions = updatedQuestions.slice(3); // 그 외 질문
                });
              }
            });
          } else {
            this.questions = [];
          }
        }, (error) => {
          console.error("데이터를 가져오는 도중 오류가 발생했습니다: ", error);
          alert("데이터를 가져오는 도중 오류가 발생했습니다.");
        });
      } else {
        alert('로그인이 필요합니다.');
      }
    },

    toggleShowAllQuestions() {
      this.showAllQuestions = !this.showAllQuestions; // 전체 기록 보기 토글
    }
  },
};
</script>

<style scoped>
.qna-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 700px;
  margin: 30px auto;
  font-family: Arial, sans-serif;
  color: #333;
}

h2 {
  font-size: 1.8em;
  margin-bottom: 0.5em;
  text-align: center;
  color: #6c4fbd; /* 보라색 */
}

h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

.faq-section ul {
  list-style-type: none;
  padding: 0;
}

.faq-section li {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  font-size: 0.95em;
}

.faq-section strong {
  display: block;
  margin-bottom: 5px;
  color: #6c4fbd; /* 보라색 */
}

.ask-question {
  margin-top: 30px;
  text-align: center;
}

.input-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  flex: 1;
  max-width: 400px;
  font-size: 0.95em;
}

button {
  padding: 10px 20px;
  background-color: #6c4fbd; /* 보라색 */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  transition: background-color 0.3s;
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
