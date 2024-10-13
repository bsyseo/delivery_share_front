<template>
  <div class="menu-container">
    <h2>메뉴 관리</h2>

    <!-- 가게 타입 및 로고 업로드 -->
    <form @submit.prevent="uploadLogo">
      <div class="store-type-section">
        <label for="storeType">가게 타입 선택</label>
        <select v-model="selectedStoreType" class="custom-select">
          <option disabled value="">가게 타입을 선택하세요</option>
          <option value="한식">한식</option>
          <option value="일식">일식</option>
          <option value="치킨">치킨</option>
          <option value="피자">피자</option>
          <option value="아시안푸드">아시안푸드</option>
          <option value="패스트푸드">패스트푸드</option>
          <option value="양식">양식</option>
          <option value="디저트">디저트</option>
          <option value="건강식">건강식</option>
        </select>
      </div>

      <div class="logo-section">
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
import { ref, set, push, onValue } from 'firebase/database';
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
      isModalOpen: false, // 모달 열림 여부
      modalImage: null // 모달에 띄울 이미지
    };
  },
  mounted() {
    this.fetchMenus();
    this.fetchStoreType();
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
    uploadLogo() {
      if (!this.selectedStoreType || !this.logoFile) {
        alert('가게 타입과 로고를 선택해주세요.');
        return;
      }

      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const logoStorageRef = storageRef(getStorage(), `store/${userId}/logo/${this.logoFile.name}`); // 로고 저장 경로 수정

      uploadBytes(logoStorageRef, this.logoFile).then(() => {
        getDownloadURL(logoStorageRef).then((url) => {
          const logoRef = ref(database, `store/${userId}/logo`);
          set(logoRef, url);
          alert('로고가 성공적으로 저장되었습니다.');
        });
      });
    },
    saveMenu() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user && this.menuName && this.menuPrice && this.menuDescription && this.menuImage) {
          const menuRef = ref(database, `store/${user.uid}/menu`); // 메뉴 저장 경로 수정
          const newMenuRef = push(menuRef);

          const storage = getStorage();
          const imageRef = storageRef(storage, `store/${user.uid}/menus/${this.menuImage.name}`); // 이미지 저장 경로 수정
          uploadBytes(imageRef, this.menuImage)
            .then((snapshot) => getDownloadURL(snapshot.ref))
            .then((imageUrl) => {
              set(newMenuRef, {
                name: this.menuName,
                price: this.menuPrice,
                description: this.menuDescription,
                imageUrl
              })
                .then(() => {
                  alert('메뉴가 저장되었습니다.');
                  this.fetchMenus();
                  this.resetMenuForm();
                })
                .catch((error) => {
                  console.error('메뉴 저장 실패:', error);
                });
            })
            .catch((error) => {
              console.error('이미지 업로드 실패:', error);
            });
        } else {
          alert('모든 필드를 입력하세요.');
        }
      });
    },
    fetchMenus() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const menuRef = ref(database, `store/${user.uid}/menu`); // 경로 변경
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
    fetchStoreType() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const storeTypeRef = ref(database, `store/${user.uid}/storeType`);
          onValue(storeTypeRef, (snapshot) => {
            this.selectedStoreType = snapshot.val();
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
  background-color: #BFDC99;
  padding: 20px;
}

.header, .logo-section, .menu-form {
  background-color: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
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
}

.custom-select:focus {
  border-color: #4CAF50;
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
</style>
