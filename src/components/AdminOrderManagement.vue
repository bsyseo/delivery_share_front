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
          <th>참여자 수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderID">
          <td>{{ formatTime(order.createdAt) }}</td>
          <td>
            {{ order.creatorName }} <br />
            <a href="#" @click.prevent="showUserInfo(order.creatorUid)">{{ order.creatorUid }}</a>
          </td>
          <td>{{ formatTime(order.reservationTime) }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.storeType }}</td>
          <td>
            <span>{{ order.storeName || '가게 이름 없음' }}</span> <br />
            <a href="#" @click.prevent="showStoreInfo(order.storeUid)">{{ order.storeUid }}</a>
          </td>
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
              <!-- 사용자 정보를 추가로 표시 -->
              <div v-if="participant.email || participant.phone || participant.address">
                <p>이메일: {{ participant.email }}</p>
                <p>전화번호: {{ participant.phone }}</p>
                <p>주소: {{ participant.address }}</p>
              </div>
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
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
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
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      const ordersRef = query(ref(database, 'orders'), orderByChild('reservationTime'));
      const snapshot = await get(ordersRef);

      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersArray = Object.keys(ordersData).map(async (key) => {
          const order = ordersData[key];

          // creatorUid를 기반으로 사용자 이름을 가져오기
          const userRef = ref(database, `users/${order.creatorUid}/name`);
          const userSnapshot = await get(userRef);
          const creatorName = userSnapshot.exists() ? userSnapshot.val() : '이름 없음';

          // 각 주문의 참여자 수 불러오기
          const participantsCount = await this.fetchParticipantsCount(key);

          return {
            orderID: key,
            ...order,
            creatorName, // 주문 생성자의 이름
            participantsCount, // 주문별 참여자 수 추가
          };
        });

        this.orders = await Promise.all(ordersArray);
        this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 내림차순 정렬
      }
    },
    formatTime(time) {
      const date = new Date(time);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
    async showUserInfo(uid) {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userInfo = snapshot.val();
        // 사용자 정보를 해당 participant 객체에 업데이트
        this.participants = this.participants.map(participant => {
          if (participant.uid === uid) {
            return {
              ...participant,
              name: userInfo.name || '이름 없음',
              email: userInfo.email || '이메일 없음',
              phone: userInfo.phone || '전화번호 없음',
              address: userInfo.address || '주소 없음',
            };
          }
          return participant;
        });
      }
    },
    closeUserPopup() {
      this.showUserPopup = false;
    },
    showStoreInfo(storeUid) {
      const storeRef = ref(database, `store/${storeUid}`);
      get(storeRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.storeInfo = snapshot.val();
            this.showStorePopup = true; // 팝업 띄우기
          } else {
            alert('가게 정보를 찾을 수 없습니다.');
          }
        })
        .catch((error) => {
          console.error('가게 정보를 가져오는 데 실패했습니다:', error);
        });
    },
    async fetchParticipantInfo(participant) {
      const userRef = ref(database, `users/${participant.uid}/name`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        return {
          ...participant,
          name: userSnapshot.val() || '이름 없음',
        };
      }
      return {
        ...participant,
        name: '이름 없음',
      };
    },

    // 주문별 참여자 수를 가져오는 함수 추가
    async fetchParticipantsCount(orderID) {
      const membersRef = query(ref(database, 'member'), orderByChild('orderID'), equalTo(orderID));
      const snapshot = await get(membersRef);

      if (snapshot.exists()) {
        const participantsData = snapshot.val();
        return Object.keys(participantsData).length; // 참여자 수 리턴
      }

      return 0; // 참여자가 없을 경우 0 리턴
    },

    async showParticipants(orderID) {
      const membersRef = query(ref(database, 'member'), orderByChild('orderID'), equalTo(orderID));
      const snapshot = await get(membersRef);

      if (snapshot.exists()) {
        const participantsData = snapshot.val();
        const participantsArray = Object.keys(participantsData).map(async (key) => {
          const participant = participantsData[key];
          return await this.fetchParticipantInfo(participant);
        });
        this.participants = await Promise.all(participantsArray);
        this.showParticipantsPopup = true;
      }
    },

    closeParticipantsPopup() {
      this.showParticipantsPopup = false;
    },
  },
};
</script>

<style scoped>
.order-management {
  padding: 20px;
  background-color: #EFFAD6;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

a {
  color: #007BFF;
  cursor: pointer;
}

.popup {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 사용자 정보 팝업이 참여자 정보 위로 오게 설정 */
}

.participants-popup {
  z-index: 999; /* 참여자 정보 팝업 */
}


button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
