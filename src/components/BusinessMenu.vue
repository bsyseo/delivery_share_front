<template>
  <div class="menu-container">
    <div class="top-navigation">
      <button class="nav-button" @click="$router.push('/')">홈 화면으로 돌아가기</button>
      <button class="nav-button" @click="$router.push('/store_information')">스토어 관리 페이지로 돌아가기</button>
      <button class="nav-button" @click="$router.push('/business_information')">사업자 등록 정보</button>
    </div>

    <h2>메뉴 관리</h2>

    <!-- 가게 타입 및 로고 업로드 -->
    <form @submit.prevent="uploadLogo">
      <div class="logo-section">
        <label for="storeType">가게 타입 선택</label>
        <select v-model="selectedStoreType" class="custom-select" required>
          <option value="">가게 타입을 선택하세요</option>
          <option value="한식">한식</option>
          <option value="중식">중식</option>
          <option value="일식">일식</option>
          <option value="치킨">치킨</option>
          <option value="피자">피자</option>
          <option value="아시안푸드">아시안푸드</option>
          <option value="패스트푸드">패스트푸드</option>
          <option value="양식">양식</option>
          <option value="디저트">디저트</option>
          <option value="건강식">건강식</option>
        </select>

        <label for="logo">로고 업로드</label>
        <input type="file" @change="onFileChange" />
        <div v-if="storeLogoPreview" class="logo-preview">
          <h4>로고 미리보기:</h4>
          <img :src="storeLogoPreview" alt="가게 로고 미리보기" @click="openModal(storeLogoPreview)" />
        </div>
        <button type="submit">로고 저장</button>
      </div>
    </form>

    <!-- 메뉴 등록 -->
    <div class="header">
      <h2>메뉴 등록</h2>
      <p>새로운 메뉴를 추가해 주세요.</p>
    </div>

    <div class="menu-form">
      <input v-model="menuName" placeholder="메뉴 이름을 입력하세요" />
      <input v-model="menuPrice" type="number" placeholder="메뉴 가격을 입력하세요" />
      <textarea v-model="menuDescription" placeholder="메뉴 설명을 입력하세요"></textarea>
      <input type="file" @change="onFileChangeForMenu" />
      <div v-if="menuImagePreview" class="image-preview">
        <h4>이미지 미리보기:</h4>
        <img :src="menuImagePreview" alt="메뉴 이미지 미리보기" @click="openModal(menuImagePreview)" />
      </div>
      <button @click="saveMenu">메뉴 저장</button>
    </div>

    <!-- 등록된 메뉴 목록 -->
    <div class="menu-list">
      <h3>등록된 메뉴 목록</h3>
      <ul>
        <li v-for="menu in menus" :key="menu.id">
          <strong>{{ menu.name }}</strong> - {{ menu.price }}원
          <p>{{ menu.description }}</p>
          <img v-if="menu.imageUrl" :src="menu.imageUrl" alt="메뉴 이미지" @click="openModal(menu.imageUrl)" />
          <button @click="deleteMenu(menu.id)" class="delete-button">메뉴 삭제</button> 
        </li>
      </ul>
    </div>

    <!-- 이미지 모달 팝업 -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content">
        <img :src="modalImage" alt="큰 이미지" class="modal-image" />
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, set, push, onValue, remove, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database } from '@/firebase';

export default {
  name: 'BusinessMenu',
  data() {
    return {
      selectedStoreType: '', 
      logoFile: null,
      menuName: '',
      menuPrice: '',
      menuDescription: '',
      menuImage: null,
      menuImagePreview: null,
      storeLogoPreview: null,
      menus: [],
      isModalOpen: false, 
      modalImage: null 
    };
  },
  mounted() {
    this.fetchMenus();
    this.fetchStoreLogo();
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.logoFile = file;

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.storeLogoPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.storeLogoPreview = null;
      }
    },
    onFileChangeForMenu(e) {
      const file = e.target.files[0];
      this.menuImage = file;

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.menuImagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.menuImagePreview = null;
      }
    },
    async uploadLogo() {
      if (!this.selectedStoreType || !this.logoFile) {
        alert('가게 타입과 로고를 선택해주세요.');
        return;
      }

      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const logoStorageRef = storageRef(getStorage(), `store/${userId}/logo/${this.logoFile.name}`);

      await uploadBytes(logoStorageRef, this.logoFile);
      const url = await getDownloadURL(logoStorageRef);

      const storeRef = ref(database, `store/${userId}`);
      const existingDataSnapshot = await get(storeRef);
      const existingData = existingDataSnapshot.exists() ? existingDataSnapshot.val() : {};

      await set(storeRef, {
        ...existingData,
        storeType: this.selectedStoreType,
        logo: url,
      });
      alert('로고와 가게 타입이 성공적으로 저장되었습니다.');
    },
    async saveMenu() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user && this.menuName && this.menuPrice && this.menuDescription && this.menuImage) {
          const uid = user.uid;
          const menuRef = ref(database, `store/${user.uid}/menu`);
          const newMenuRef = push(menuRef);

          const storage = getStorage();
          const imageRef = storageRef(storage, `store/${user.uid}/menus/${this.menuImage.name}`);
          const snapshot = await uploadBytes(imageRef, this.menuImage);
          const imageUrl = await getDownloadURL(snapshot.ref);

          // 기존 데이터를 불러오기
          const businessInfoRef = ref(database, 'store/' + uid);
          const existingDataSnapshot = await get(businessInfoRef);
          const existingData = existingDataSnapshot.exists() ? existingDataSnapshot.val() : {};

          // 새로운 메뉴 데이터를 추가
          const newMenuData = {
            name: this.menuName,
            price: this.menuPrice,
            description: this.menuDescription,
            imageUrl,
          };

          // 기존 데이터에 새로운 메뉴를 병합하여 저장
          await set(newMenuRef, newMenuData);
          await set(businessInfoRef, { ...existingData, menu: { ...existingData.menu, [newMenuRef.key]: newMenuData } });

          alert('메뉴가 저장되었습니다.');
          this.resetMenuForm();
        } else {
          alert('모든 필드를 입력하세요.');
        }
      });
    },
    fetchMenus() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const menuRef = ref(database, `store/${user.uid}/menu`);
          onValue(menuRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              this.menus = Object.keys(data).map((key) => ({
                id: key,
                ...data[key]
              }));
            }
          });
        }
      });
    },
    fetchStoreLogo() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const logoRef = ref(database, `store/${user.uid}/logo`);
          onValue(logoRef, (snapshot) => {
            this.storeLogoPreview = snapshot.val();
          });
        }
      });
    },
    deleteMenu(menuId) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const menuRef = ref(database, `store/${user.uid}/menu/${menuId}`);
          remove(menuRef)
            .then(() => {
              alert('메뉴가 삭제되었습니다.');
              this.fetchMenus();
            })
            .catch((error) => {
              console.error('메뉴 삭제 실패:', error);
            });
        }
      });
    },
    openModal(imageUrl) {
      this.modalImage = imageUrl;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.modalImage = null;
    },
    resetMenuForm() {
      this.menuName = '';
      this.menuPrice = '';
      this.menuDescription = '';
      this.menuImage = null;
      this.menuImagePreview = null;
    }
  }
};
</script>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F3F6ED;
  padding: 20px;
}

.top-navigation {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
}

.nav-button {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.nav-button:hover {
  background: linear-gradient(135deg, #45A049, #5CB85C);
  transform: translateY(-3px);
}

.header, .logo-section, .menu-form {
  background-color: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  margin-top: 2vh;
}

.header h2, .logo-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.custom-select {
  width: 100%;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background-color: #F3F6ED;
  appearance: none;
}

.custom-select:focus {
  border-color: #4CAF50;
  box-shadow: 0px 0px 8px rgba(76, 175, 80, 0.3);
}

.logo-section input,
.menu-form input,
.menu-form textarea {
  padding: 10px;
  margin-top: 10px;
  border: 2px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s ease;
}

.logo-section input:focus,
.menu-form input:focus,
.menu-form textarea:focus {
  border-color: #4CAF50;
}

.logo-section button,
.menu-form button {
  padding: 12px;
  margin-top: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.logo-section button:hover,
.menu-form button:hover {
  background-color: #45a049;
  transform: translateY(-3px);
}

.logo-preview, .image-preview {
  margin-top: 10px;
  text-align: center;
}

.logo-preview img, .image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.menu-list {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

.menu-list ul {
  list-style: none;
  padding: 0;
}

.menu-list li {
  background-color: white;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-list li strong {
  font-size: 18px;
  color: #333;
}

.menu-list li p {
  margin: 5px 0;
  color: #777;
}

.menu-list img {
  margin-top: 10px;
  border-radius: 10px;
  width: 100px;
  height: 100px;
  object-fit: cover;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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

.delete-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #ff4d4d;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.delete-button:hover {
  background-color: #e60000;
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}
</style>
