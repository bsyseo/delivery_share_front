<template>
  <div class="admin-user-management">
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
            <th>승인 여부</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="business in businesses" :key="business.id">
            <td>{{ business.name }}</td>
            <td>{{ business.email }}</td>
            <td>{{ business.phone }}</td>
            <td>{{ business.address }}</td>
            <td>
              <input type="checkbox" :checked="business.approved === 'yes'" @change="toggleApproval(business)">
            </td>
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
import { ref, get, child, update } from 'firebase/database';
import { database } from '@/main'; // Firebase 초기화가 되어있는지 확인

export default {
  name: 'AdminUserManagement',
  data() {
    return {
      consumers: [], // 소비자 목록
      businesses: [], // 자영업자 목록
      admins: [] // 관리자 목록
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

          // 사용자 분류 및 최신 가입 순 정렬
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
              approved: user.approved || 'no' // 승인 정보 추가
            };

            if (user.role === 'consumer') {
              consumerList.push(userData);
            } else if (user.role === 'business') {
              businessList.push(userData);
            } else if (user.role === 'admin') {
              adminList.push(userData);
            }
          }

          // 최신 가입 순으로 정렬
          consumerList.sort((a, b) => b.registeredAt - a.registeredAt);
          businessList.sort((a, b) => b.registeredAt - a.registeredAt);
          adminList.sort((a, b) => b.registeredAt - a.registeredAt);

          // 데이터 업데이트
          this.consumers = consumerList;
          this.businesses = businessList;
          this.admins = adminList;
        }
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      }
    },
    toggleApproval(user) {
      const newValue = user.approved === 'yes' ? 'no' : 'yes';
      const updates = {};
      updates[`users/${user.id}/approved`] = newValue;

      update(ref(database), updates)
        .then(() => {
          user.approved = newValue; // 로컬 상태 업데이트
        })
        .catch(error => {
          console.error('승인 상태 업데이트 실패:', error);
          alert('승인 상태 업데이트에 실패했습니다.');
        });
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>


<style scoped>
.admin-user-management {
  text-align: center;
  padding: 20px;
  background-color: #f0f8ec;
}

.user-block {
  margin-bottom: 40px;
  padding: 20px;
  background-color: rgba(144, 238, 144, 0.3);
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.user-block h2 {
  font-family: 'Arial', sans-serif;
  color: #4CAF50;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th, .user-table td {
  padding: 10px;
  border: 1px solid #4CAF50;
  text-align: left;
}

.user-table th {
  background-color: #4CAF50;
  color: white;
}

.user-table td {
  background-color: #fff;
  color: #333;
}

p {
  font-size: 14px;
  color: #555;
}
</style>
