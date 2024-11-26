<template>
  <div class="admin-component">
    <div class="header">
      <h2>관리자, 환영합니다.</h2>
      <p>원하시는 메뉴를 선택해 주세요!</p>
    </div>

    <div class="menu-section">
      <button @click="navigateTo('AdminOrderManagement')">주문 모집 관리</button>
      <button @click="navigateTo('AdminReviewManagement')">review 관리</button>
      <button @click="navigateTo('AdminQnAManagement')">Q&A 관리</button>
      <button @click="navigateTo('AdminPickUpZoneManagement')">PICK-UP-ZONE 관리</button>
      <button @click="navigateTo('AdminUserManagement')">사용자 관리</button>
      <button @click="navigateTo('AdminStoreManagement')">점포 관리</button>
      <button @click="navigateTo('AdminTemporary')">예비</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTo(route) {
      this.$router.push({ name: route });
    }
  }
};
</script>

<style scoped>
.admin-component {
  text-align: center;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.menu-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-items: center;
}

.menu-section button {
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  width: 150px;
  cursor: pointer;
  font-size: 16px;
}

.menu-section button:hover {
  background-color: #45a049;
}
</style>
