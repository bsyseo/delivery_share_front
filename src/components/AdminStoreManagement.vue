<template>
  <div class="admin-store-management">
    <h1>관리자 점포 관리 페이지</h1>

    <!-- 승인 대기 중인 점포 슬라이드 -->
    <div v-if="pendingStores.length > 0">
      <div class="store-block">
        <h2>{{ pendingStores[currentStoreIndex].storeName }}</h2>
        <p><strong>대표자명:</strong> {{ pendingStores[currentStoreIndex].ownerName }}</p>
        <p><strong>주소:</strong> {{ pendingStores[currentStoreIndex].storeAddress }}</p>
        <p><strong>연락처:</strong> {{ pendingStores[currentStoreIndex].contact }}</p>
        <p><strong>사업자번호:</strong> {{ pendingStores[currentStoreIndex].registrationNumber }}</p>
        <p><strong>운영 시간:</strong> {{ pendingStores[currentStoreIndex].operationHours }}</p>
        <p><strong>휴무일:</strong> {{ pendingStores[currentStoreIndex].closedDays.join(', ') }}</p>

        <!-- 사업자등록증, 영업신고증, 통장사본 -->
        <div class="documents">
          <table class="document-table">
            <thead>
              <tr>
                <th>사업자 등록증</th>
                <th>영업 신고증</th>
                <th>통장 사본</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img v-if="pendingStores[currentStoreIndex].businessLicense" :src="pendingStores[currentStoreIndex].businessLicense" alt="사업자등록증" class="document-image" @click="openModal(pendingStores[currentStoreIndex].businessLicense)" />
                  <p v-else>이미지 없음</p>
                </td>
                <td>
                  <img v-if="pendingStores[currentStoreIndex].businessPermit" :src="pendingStores[currentStoreIndex].businessPermit" alt="영업신고증" class="document-image" @click="openModal(pendingStores[currentStoreIndex].businessPermit)" />
                  <p v-else>이미지 없음</p>
                </td>
                <td>
                  <img v-if="pendingStores[currentStoreIndex].bankAccount" :src="pendingStores[currentStoreIndex].bankAccount" alt="통장사본" class="document-image" @click="openModal(pendingStores[currentStoreIndex].bankAccount)" />
                  <p v-else>이미지 없음</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button @click="approveStore(pendingStores[currentStoreIndex].uid)">승인</button>
        <div class="navigation">
          <button @click="prevStore" :disabled="currentStoreIndex === 0">이전</button>
          <span>{{ currentStoreIndex + 1 }} / {{ pendingStores.length }}</span>
          <button @click="nextStore" :disabled="currentStoreIndex === pendingStores.length - 1">다음</button>
        </div>
      </div>
    </div>
    <p v-else>승인 대기 중인 점포가 없습니다.</p>

    <!-- 등록된 모든 점포 목록 -->
    <h2>모든 등록된 점포</h2>
    <table class="all-stores-table" v-if="allStores.length > 0">
      <thead>
        <tr>
          <th>가게명</th>
          <th>대표자명</th>
          <th>주소</th>
          <th>연락처</th>
          <th>사업자번호</th>
          <th>운영 시간</th>
          <th>휴무일</th>
          <th>사업자 등록증</th>
          <th>영업 신고증</th>
          <th>통장 사본</th>
          <th>승인 여부</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="store in allStores" :key="store.uid">
          <td>{{ store.storeName }}</td>
          <td>{{ store.ownerName }}</td>
          <td>{{ store.storeAddress }}</td>
          <td>{{ store.contact }}</td>
          <td>{{ store.registrationNumber }}</td>
          <td>{{ store.operationHours }}</td>
          <td>{{ store.closedDays.join(', ') }}</td>
          <td>
            <img v-if="store.businessLicense" :src="store.businessLicense" alt="사업자등록증" class="small-document-image" @click="openModal(store.businessLicense)" />
          </td>
          <td>
            <img v-if="store.businessPermit" :src="store.businessPermit" alt="영업신고증" class="small-document-image" @click="openModal(store.businessPermit)" />
          </td>
          <td>
            <img v-if="store.bankAccount" :src="store.bankAccount" alt="통장사본" class="small-document-image" @click="openModal(store.bankAccount)" />
          </td>
          <td>
            <button @click="toggleApproval(store)">{{ store.approved === 'yes' ? '승인 취소' : '승인' }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>등록된 점포가 없습니다.</p>

    <!-- 이미지 모달 팝업 -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content">
        <img :src="modalImage" alt="큰 이미지" class="modal-image" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, get, child, update } from 'firebase/database';
import { database } from '@/firebase'; // Firebase 초기화

export default {
  name: 'AdminStoreManagement',
  data() {
    return {
      pendingStores: [], // 승인 대기 중인 점포 목록
      allStores: [], // 모든 점포 목록
      currentStoreIndex: 0, // 현재 보고 있는 점포 인덱스
      isModalOpen: false, // 모달 열림 여부
      modalImage: null // 모달에 띄울 이미지
    };
  },
  methods: {
    async fetchStores() {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'store'));

        if (snapshot.exists()) {
          const storeData = snapshot.val();
          const pendingStoreList = [];
          const allStoreList = [];

          for (let uid in storeData) {
            const store = storeData[uid];
            const storeInfo = {
              uid: uid,
              storeName: store.storeName,
              ownerName: store.ownerName,
              storeAddress: store.store_address || '주소 정보 없음',
              contact: store.contact,
              registrationNumber: store.registrationNumber,
              operationHours: store.operationHours || '운영 시간 정보 없음',
              closedDays: store.closedDays || [],
              businessLicense: store.businessLicenseUrl || null,
              businessPermit: store.businessPermitUrl || null,
              bankAccount: store.bankAccountUrl || null,
              approved: store.approved || 'no' // 승인 여부 추가
            };

            if (store.approved === 'no') {
              pendingStoreList.push(storeInfo);
            }
            allStoreList.push(storeInfo);
          }

          this.pendingStores = pendingStoreList;
          this.allStores = allStoreList;
        }
      } catch (error) {
        console.error('점포 데이터를 불러오는 중 오류 발생:', error);
      }
    },
    openModal(imageUrl) {
      this.modalImage = imageUrl;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.modalImage = null;
    },
    approveStore(uid) {
      const updates = {};
      updates[`store/${uid}/approved`] = 'yes';

      update(ref(database), updates)
        .then(() => {
          alert('가게가 승인되었습니다.');
          this.pendingStores = this.pendingStores.filter(store => store.uid !== uid);
          this.currentStoreIndex = this.currentStoreIndex > 0 ? this.currentStoreIndex - 1 : 0;
        })
        .catch((error) => {
          console.error('가게 승인 중 오류 발생:', error);
        });
    },
    toggleApproval(store) {
      const newApprovalStatus = store.approved === 'yes' ? 'no' : 'yes';
      const updates = {};
      updates[`store/${store.uid}/approved`] = newApprovalStatus;

      update(ref(database), updates)
        .then(() => {
          store.approved = newApprovalStatus; // 승인 상태를 업데이트
          alert(`가게 승인 상태가 ${newApprovalStatus === 'yes' ? '승인' : '취소'}되었습니다.`);
        })
        .catch((error) => {
          console.error('승인 상태 변경 중 오류 발생:', error);
        });
    },
    prevStore() {
      if (this.currentStoreIndex > 0) {
        this.currentStoreIndex--;
      }
    },
    nextStore() {
      if (this.currentStoreIndex < this.pendingStores.length - 1) {
        this.currentStoreIndex++;
      }
    }
  },
  mounted() {
    this.fetchStores();
  }
};
</script>

<style scoped>
.admin-store-management {
  padding: 20px;
  background-color: #f9f9f9;
}

.store-block {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  max-width: 900px;
  margin: 0 auto;
}

.documents {
  margin-top: 20px;
}

.document-table {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  border-collapse: collapse;
  text-align: center;
}

.document-table th,
.document-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.document-image,
.small-document-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.document-image:hover,
.small-document-image:hover {
  transform: scale(1.1);
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90%;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
}

/* 모든 점포 목록 스타일 */
.all-stores-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.all-stores-table th,
.all-stores-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

.all-stores-table img {
  max-width: 50px;
  max-height: 50px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.all-stores-table img:hover {
  transform: scale(1.1);
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.navigation button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.navigation button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
