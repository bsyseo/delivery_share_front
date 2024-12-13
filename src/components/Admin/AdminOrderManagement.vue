<template>
  <div class="order-management">
    <h1>관리자 주문 관리 페이지</h1>
    <table>
      <thead>
        <tr>
          <th>주문 시각</th>
          <th>주문 생성자</th>
          <th>예약 시간</th>
          <th>주문 상태</th>
          <th>가게 구분</th>
          <th>가게 이름</th>
          <th>메뉴</th>
          <th>수량</th>
          <th>참여자 수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderID" :class="{ highlight: order.highlight }">
          <td>{{ formatTime(order.participateTime) }}</td>
          <td>
            <span class="creator-name">{{ order.creatorName }}</span> <br />
            <a href="#" @click.prevent="showUserInfo(order.creatorUid)" class="uid-link">{{ order.creatorUid }}</a>
          </td>
          <td>{{ formatTime(order.reservationTime) }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.storeType }}</td>
          <td>
            <span>{{ order.storeName || '가게 이름 없음' }}</span> <br />
            <a href="#" @click.prevent="showStoreInfo(order.storeUid)" class="uid-link">{{ order.storeUid }}</a>
          </td>
          <td>{{ order.menu }}</td>
          <td>{{ order.quantity }}</td>
          <td>
            <a href="#" @click.prevent="showParticipants(order.orderID)">{{ order.participantsCount }}명 참여자 보기</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 사용자 정보 팝업 -->
    <div v-if="showUserPopup" class="popup">
      <h3>사용자 정보</h3>
      <p>이름: {{ userInfo.name }}</p>
      <p>이메일: {{ userInfo.email }}</p>
      <p>전화번호: {{ userInfo.phone }}</p>
      <p>주소: {{ userInfo.address }}</p>
      <button @click="closeUserPopup">닫기</button>
    </div>

    <!-- 가게 정보 팝업 -->
    <div v-if="showStorePopup" class="popup">
      <h3>가게 정보</h3>
      <p>가게 이름: {{ storeInfo.storeName }}</p>
      <p>운영 시간: {{ storeInfo.operationHours }}</p>
      <p>가게 주소: {{ storeInfo.store_address }}</p>
      <p>휴무일: {{ storeInfo.closedDays }}</p>
      <button @click="closeStorePopup">닫기</button>
    </div>

    <!-- 참여자 정보 팝업 -->
    <div v-if="showParticipantsPopup" class="popup">
      <h3>참여자 정보</h3>
      <table>
        <thead>
          <tr>
            <th>이름 (UID)</th>
            <th>메뉴</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="participant in participants" :key="participant.memberID">
            <td>
              {{ participant.name }} <br />
              <a href="#" @click.prevent="showUserInfo(participant.uid)">({{ participant.uid }})</a>
            </td>
            <td>{{ participant.menu }}</td>
            <td>{{ participant.quantity }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="closeParticipantsPopup">닫기</button>
    </div>
  </div>
</template>

<script>
import { ref, get, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { database } from '@/firebase';

export default {
  name: 'AdminOrderManagement',
  data() {
    return {
      orders: [],
      showUserPopup: false,
      showStorePopup: false,
      showParticipantsPopup: false,
      userInfo: {},
      storeInfo: {},
      participants: [],
    };
  },
  mounted() {
    this.setupRealtimeUpdates();
  },
  methods: {
    setupRealtimeUpdates() {
      const membersRef = ref(database, 'member');
      onValue(membersRef, (snapshot) => {
        if (snapshot.exists()) {
          const membersData = snapshot.val();
          const newOrdersArray = Object.keys(membersData).map(async (key) => {
            const member = membersData[key];
            const orderRef = ref(database, `orders/${member.orderID}`);
            const orderSnapshot = await get(orderRef);

            if (orderSnapshot.exists()) {
              const orderData = orderSnapshot.val();
              const userRef = ref(database, `users/${member.uid}/name`);
              const userSnapshot = await get(userRef);
              const creatorName = userSnapshot.exists() ? userSnapshot.val() : '이름 없음';
              const storeRef = ref(database, `store/${orderData.storeUid}/storeName`);
              const storeSnapshot = await get(storeRef);
              const storeName = storeSnapshot.exists() ? storeSnapshot.val() : '가게 이름 없음';

              // 참여자 수 계산
              const participantsCount = await this.fetchParticipantsCount(member.orderID);

              return {
                orderID: member.orderID,
                participateTime: member.participate_time,
                creatorName,
                creatorUid: member.uid,
                reservationTime: orderData.reservationTime,
                status: orderData.status,
                storeType: orderData.storeType,
                storeName,
                storeUid: orderData.storeUid,
                participantsCount,
                menu: member.menu,
                quantity: member.quantity,
                highlight: false, // 기본 하이라이트 설정을 false로 설정
              };
            }
          });

          Promise.all(newOrdersArray).then((newOrders) => {
            this.orders = newOrders.filter(order => order);
            this.orders.sort((a, b) => new Date(b.participateTime) - new Date(a.participateTime));
            this.highlightFirstOrder();
          });
        }
      });
    },
    async fetchParticipantsCount(orderID) {
      const membersRef = query(ref(database, 'member'), orderByChild('orderID'), equalTo(orderID));
      const snapshot = await get(membersRef);
      if (snapshot.exists()) {
        const participantsData = snapshot.val();
        return Object.keys(participantsData).length;
      }
      return 0;
    },
    formatTime(time) {
      const date = new Date(time);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
    async showUserInfo(uid) {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        this.userInfo = snapshot.val();
        this.showUserPopup = true;
      } else {
        alert('사용자 정보를 찾을 수 없습니다.');
      }
    },
    closeUserPopup() {
      this.showUserPopup = false;
    },
    closeStorePopup() {
      this.showStorePopup = false;
    },
    showStoreInfo(storeUid) {
      const storeRef = ref(database, `store/${storeUid}`);
      get(storeRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.storeInfo = snapshot.val();
            this.showStorePopup = true;
          } else {
            alert('가게 정보를 찾을 수 없습니다.');
          }
        })
        .catch((error) => {
          console.error('가게 정보를 가져오는 데 실패했습니다:', error);
        });
    },
    async showParticipants(orderID) {
      const membersRef = query(ref(database, 'member'), orderByChild('orderID'), equalTo(orderID));
      const snapshot = await get(membersRef);

      if (snapshot.exists()) {
        const participantsData = snapshot.val();
        const participantsArray = Object.keys(participantsData).map(async (key) => {
          const participant = participantsData[key];
          const userRef = ref(database, `users/${participant.uid}/name`);
          const userSnapshot = await get(userRef);
          const name = userSnapshot.exists() ? userSnapshot.val() : '이름 없음';

          return {
            memberID: key,
            ...participant,
            name,
          };
        });
        this.participants = await Promise.all(participantsArray);
        this.showParticipantsPopup = true;
      }
    },
    closeParticipantsPopup() {
      this.showParticipantsPopup = false;
    },
    highlightFirstOrder() {
      if (this.orders.length > 0) {
        this.orders[0].highlight = true;
        setTimeout(() => {
          this.orders[0].highlight = false;
        }, 2000); // 2초 동안 하이라이트 표시 후 해제
      }
    },
  },
};
</script>

<style scoped>
.order-management {
  padding: 30px;
  background-color: #f4f6f8;
  font-family: 'Roboto', sans-serif;
  border-radius: 32px;
}

h1 {
  color: #2b2d42;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

th, td {
  padding: 12px;
  text-align: center;
  font-size: 14px;
  color: #333333;
}

th {
  background-color: #e0e7ff;
  color: #4a4a4a;
  font-weight: 600;
  font-size: 16px;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

a {
  color: #6200ea;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

.uid-link {
  font-size: 0.85em;
}

.creator-name {
  font-size: 0.9em;
  font-weight: 500;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  z-index: 1000;
}

button {
  margin-top: 16px;
  padding: 10px 20px;
  background-color: #6200ea;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #3700b3;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

.highlight {
  animation: highlightEffect 2s ease;
}

@keyframes highlightEffect {
  0% { background-color: #ffeb3b; }
  100% { background-color: transparent; }
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