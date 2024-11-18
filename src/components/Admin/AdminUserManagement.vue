<template>
  <div class="admin-container">
    <h1>회원 관리</h1>

    <!-- 탭 네비게이션 -->
    <div class="tab-navigation">
      <button @click="activeTab = 'consumers'" :class="{ active: activeTab === 'consumers' }">소비자 목록</button>
      <button @click="activeTab = 'businesses'" :class="{ active: activeTab === 'businesses' }">자영업자 목록</button>
      <button @click="activeTab = 'admins'" :class="{ active: activeTab === 'admins' }">관리자 목록</button>
    </div>

    <!-- 소비자 목록 -->
    <div v-if="activeTab === 'consumers'" class="user-block">
      <h2>소비자 목록</h2>
      <table v-if="consumers.length > 0" class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>주소</th>
            <th>처리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="consumer in consumers" :key="consumer.id">
            <td>{{ consumer.name }}</td>
            <td>{{ consumer.email }}</td>
            <td>{{ consumer.phone }}</td>
            <td>{{ consumer.address }}</td>
            <td>
              <button @click="deleteUser(consumer.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>소비자 정보가 없습니다.</p>
    </div>

    <!-- 자영업자 목록 -->
    <div v-if="activeTab === 'businesses'" class="user-block">
      <h2>자영업자 목록</h2>
      <table v-if="businesses.length > 0" class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>주소</th>
            <th>처리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="business in businesses" :key="business.id">
            <td>{{ business.name }}</td>
            <td>{{ business.email }}</td>
            <td>{{ business.phone }}</td>
            <td>{{ business.address }}</td>
            <td>
              <button @click="deleteUser(business.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>자영업자 정보가 없습니다.</p>
    </div>

    <!-- 관리자 목록 -->
    <div v-if="activeTab === 'admins'" class="user-block">
      <h2>관리자 목록</h2>
      <table v-if="admins.length > 0" class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>주소</th>
            <th>처리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins" :key="admin.id">
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.phone }}</td>
            <td>{{ admin.address }}</td>
            <td>
              <button @click="deleteUser(admin.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>관리자 정보가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { ref, get, child, remove } from 'firebase/database';
import { database } from '@/main';

export default {
  name: 'AdminUserManagement',
  data() {
    return {
      activeTab: 'consumers', // 초기 탭을 소비자로 설정
      consumers: [],
      businesses: [],
      admins: []
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'users'));

        if (snapshot.exists()) {
          const users = snapshot.val();
          const consumerList = [];
          const businessList = [];
          const adminList = [];

          for (let uid in users) {
            const user = users[uid];
            const userData = {
              id: uid,
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address || '주소 정보 없음',
              role: user.role,
              registeredAt: user.registeredAt || new Date().getTime(),
            };

            if (user.role === 'consumer') {
              consumerList.push(userData);
            } else if (user.role === 'business') {
              businessList.push(userData);
            } else if (user.role === 'admin') {
              adminList.push(userData);
            }
          }

          consumerList.sort((a, b) => b.registeredAt - a.registeredAt);
          businessList.sort((a, b) => b.registeredAt - a.registeredAt);
          adminList.sort((a, b) => b.registeredAt - a.registeredAt);

          this.consumers = consumerList;
          this.businesses = businessList;
          this.admins = adminList;
        }
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      }
    },
    async deleteUser(userId) {
      if (confirm('정말로 사용자를 삭제하시겠습니까?')) {
        try {
          const userRef = child(ref(database), `users/${userId}`);
          await remove(userRef);
          alert('사용자가 삭제되었습니다.');
          this.fetchUsers(); // 목록 새로고침
        } catch (error) {
          console.error('사용자를 삭제하는 중 오류 발생:', error);
        }
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>


<style scoped>
.admin-container {
  padding: 30px;
  background-color: #f4f6f8;
  font-family: 'IBMPlexSansKR', sans-serif;
  border-radius: 32px;
  color: #2b2d42;
  min-height: 100vh;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  color: #2b2d42;
  margin-bottom: 16px;
}

.tab-navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.tab-navigation button {
  padding: 12px 24px;
  margin: 0 8px;
  font-size: 16px;
  color: #4a4a4a;
  background-color: #ffffff;
  border: 2px solid #e0e7ff;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.tab-navigation button.active {
  background-color: #6200ea;
  color: white;
  border-color: #6200ea;
}

.tab-navigation button:hover {
  background-color: #3700b3;
  color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.user-block {
  width: 1000px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  transition: box-shadow 0.3s ease;
}

.user-block:hover {
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.15);
}

.user-block h2 {
  font-size: 24px;
  color: #2b2d42;
  margin-bottom: 16px;
  font-weight: 600;
}

.user-table {
  width: 800px;
  margin-left: 100px;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
}

.user-table th, .user-table td {
  padding: 14px 18px;
  text-align: center;
  font-size: 14px;
  color: #333333;
}

.user-table th {
  background-color: #e0e7ff;
  color: #4a4a4a;
  font-weight: 600;
  font-size: 16px;
}

.user-table td {
  background-color: #ffffff;
}

.user-table tr:nth-child(even) td {
  background-color: #f9f9f9;
}

p {
  font-size: 14px;
  color: #3C4043;
  text-align: center;
  margin-top: 10px;
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

/* 기본 폰트 설정 */
* {
  font-family: 'IBMPlexSansKR', sans-serif;
}
</style>
