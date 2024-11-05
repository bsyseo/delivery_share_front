<template>
  <div class="admin-container">
    <h1>관리자 사용자 관리 페이지</h1>

    <!-- 소비자 목록 -->
    <div class="user-block">
      <h2>소비자 목록</h2>
      <table v-if="consumers.length > 0" class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>주소</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="consumer in consumers" :key="consumer.id">
            <td>{{ consumer.name }}</td>
            <td>{{ consumer.email }}</td>
            <td>{{ consumer.phone }}</td>
            <td>{{ consumer.address }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>소비자 정보가 없습니다.</p>
    </div>

    <!-- 자영업자 목록 -->
    <div class="user-block">
      <h2>자영업자 목록</h2>
      <table v-if="businesses.length > 0" class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>주소</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="business in businesses" :key="business.id">
            <td>{{ business.name }}</td>
            <td>{{ business.email }}</td>
            <td>{{ business.phone }}</td>
            <td>{{ business.address }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>자영업자 정보가 없습니다.</p>
    </div>

    <!-- 관리자 목록 -->
    <div class="user-block">
      <h2>관리자 목록</h2>
      <table v-if="admins.length > 0" class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>주소</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins" :key="admin.id">
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.phone }}</td>
            <td>{{ admin.address }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>관리자 정보가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { ref, get, child } from 'firebase/database';
import { database } from '@/main';

export default {
  name: 'AdminUserManagement',
  data() {
    return {
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
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background-color: #ffffff;
  color: #333;
  min-height: 100vh;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  color: #6200ea;
  margin: 30px 0;
  text-align: center;
}

.user-block {
  width: 100%;
  max-width: 1200px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}

.user-block h2 {
  font-size: 1.5rem;
  color: #6200ea;
  margin-bottom: 15px;
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
}

.user-table th, .user-table td {
  padding: 12px 15px;
  text-align: left;
}

.user-table th {
  background-color: #6200ea;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.user-table td {
  background-color: #f3f1f9;
  color: #333;
}

.user-table tr:nth-child(even) td {
  background-color: #e8e5f4;
}

p {
  font-size: 0.9rem;
  color: #333;
  text-align: center;
  margin-top: 10px;
}
</style>
