<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <ul class="no-bullets">
        <li>
          <button @click="navigateTo('product_management')" class="sidebar-button">
            상품 관리
          </button>
        </li>
        <li>
          <button @click="navigateTo('sales_management')" class="sidebar-button">
            판매 관리
          </button>
        </li>
        <li>
          <button @click="navigateTo('settlement_management')" class="sidebar-button">
            정산 관리
          </button>
        </li>
        <li>
          <button @click="navigateTo('inquiries')" class="sidebar-button">
            문의 / 상담
          </button>
        </li>
        <li>
          <button @click="navigateTo('business_menu')" class="sidebar-button">
            메뉴 수정
          </button>
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="store-info">
        <h2>가게 정보 관리</h2>
        <div class="info-section">
          <div class="info-box">
            <label for="storeName">변경할 가게 이름</label>
            <div class="input-with-button">
              <input 
                type="text" 
                id="storeName" 
                v-model="storeName" 
                :disabled="storeNameRegistered && !editingStoreName" 
                placeholder="가게 이름을 입력하세요" 
              />
              <div v-if="!storeNameRegistered">
                <button @click="registerStoreName">등록</button>
              </div>
              <div v-else>
                <button v-if="!editingStoreName" @click="enableStoreNameEditing">변경하기</button>
                <button v-if="editingStoreName" @click="saveStoreName">저장</button>
              </div>
            </div>
          </div>
          <div class="info-box centered">
            <label>영업 시간</label>
            <div class="time-inputs centered">
              <input type="time" v-model="openTime" placeholder="오픈 시간" />
              <input type="time" v-model="closeTime" placeholder="마감 시간" />
            </div>
          </div>
          <div class="info-box centered">
            <label>휴무일 설정</label>
            <div class="day-selection centered">
              <label v-for="day in days" :key="day">
                <input type="checkbox" v-model="holidayDays" :value="day" />
                {{ day }}
              </label>
            </div>
            <div class="calendar-selection">
              <label>날짜 선택</label>
              <input type="date" v-model="selectedHolidayDate" @change="addHolidayDate" />
            </div>
            <p class="selected-days">선택된 휴무일: {{ holidayDays.join(', ') }} / {{ selectedHolidayDates.join(', ') }}</p>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="action-button save-button" @click="saveStoreInfo">가게 정보 저장</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { database } from '@/firebase';

export default {
  name: 'StoreInformation',
  data() {
    return {
      storeName: '',
      storeNameRegistered: false, // 가게 이름 등록 여부
      editingStoreName: false, // 가게 이름 수정 여부
      openTime: '',
      closeTime: '',
      holidayDays: [], // 요일 체크박스용 데이터
      selectedHolidayDates: [], // 날짜 선택 휴무일
      selectedHolidayDate: '', // 선택된 달력 날짜
      days: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
    };
  },
  methods: {
    registerStoreName() {
      if (this.storeName) {
        this.storeNameRegistered = true;
        alert('가게 이름이 등록되었습니다.');
      } else {
        alert('가게 이름을 입력하세요.');
      }
    },
    enableStoreNameEditing() {
      this.editingStoreName = true;
    },
    saveStoreName() {
      if (this.storeName) {
        this.editingStoreName = false;
        alert('가게 이름이 변경되었습니다.');
      } else {
        alert('가게 이름을 입력하세요.');
      }
    },
    addHolidayDate() {
      if (this.selectedHolidayDate && !this.selectedHolidayDates.includes(this.selectedHolidayDate)) {
        this.selectedHolidayDates.push(this.selectedHolidayDate);
      }
    },
    saveStoreInfo() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const storeInfoRef = ref(database, `store/${user.uid}/info`);
          set(storeInfoRef, {
            name: this.storeName,
            openTime: this.openTime,
            closeTime: this.closeTime,
            holidays: this.holidayDays,
            holidayDates: this.selectedHolidayDates, // 달력에서 선택된 날짜 저장
          })
            .then(() => {
              alert('가게 정보가 저장되었습니다.');
            })
            .catch((error) => {
              console.error('가게 정보 저장 실패:', error);
            });
        }
      });
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.05);
  font-family: 'Arial', sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #BFDC99; /* 기존의 초록색 유지 */
  padding: 20px;
  border-radius: 12px;
  color: black;
}

.sidebar-button {
  background-color: #EFFAD6; /* 오른쪽 연초록색 */
  border: none;
  padding: 10px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  width: 100%;
}

.sidebar-button:hover {
  background-color: #D5F2C1; /* 호버 시의 연초록색 */
}

h2 {
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.info-section {
  margin-bottom: 30px;
}

.info-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: 10px; /* 입력 필드와 버튼 사이의 간격 */
}

input[type="text"], input[type="time"], input[type="date"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

input[type="text"]:focus, input[type="time"]:focus, input[type="date"]:focus {
  border-color: #4CAF50;
}

.time-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.day-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.calendar-selection label {
  margin-right: 10px; /* 라벨과 입력 박스 사이의 간격을 설정 */
}

.calendar-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}

.selected-days {
  font-size: 14px;
  color: #555;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.action-button {
  padding: 10px 18px;
  background-color: #EFFAD6;
  color: gray;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #D5F2C1;
}

button {
  padding: 12px 24px;
  background-color: #EFFAD6;
  color: gray;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 버튼 그림자 */
}

button:hover {
  background-color: #45a049;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* 호버 시 그림자 강조 */
}

button:active {
  background-color: #3e8e41;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 클릭 시 그림자 축소 */
}

/* 목록 앞의 점 기호 제거 */
.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.no-bullets li {
  margin: 10px 0;
  color: #000;
}

.content {
  flex: 1;
  margin-left: 20px;
}
</style>
