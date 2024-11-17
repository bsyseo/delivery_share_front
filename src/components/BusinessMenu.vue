<template>
  <div class="menu-container">
    <!-- 상단 네비게이션 -->
    <div class="top-navigation">
      <button class="nav-button" @click="$router.push('/')">홈 화면으로 돌아가기</button>
      <button class="nav-button" @click="$router.push('/store_information')">스토어 관리 페이지</button>
      <button class="nav-button" @click="$router.push('/business_information')">사업자 등록 정보</button>
    </div>

    <!-- 메인 섹션 -->
    <div class="main-header">
      <h1>메뉴 관리</h1>
      <p>여기에서 가게 로고를 업로드하거나 메뉴를 관리할 수 있습니다.</p>
    </div>

    <!-- 로고 업로드 섹션 -->
    <form @submit.prevent="uploadLogo" class="section">
      <h3>로고 업로드</h3>
      <input type="file" @change="onFileChange" class="file-input" />
      <div v-if="storeLogoPreview" class="logo-preview">
        <h4>미리보기:</h4>
        <img :src="storeLogoPreview" alt="가게 로고 미리보기" @click="openModal(storeLogoPreview)" />
      </div>
      <button type="submit" class="primary-button">로고 저장</button>
    </form>

    <!-- 배달비 설정 -->
    <div class="section">
      <h3>배달비 설정</h3>
      <input v-model="deliveryFee" type="number" placeholder="배달비를 입력하세요" class="text-input" />
      <button @click="saveDeliveryFee" class="primary-button">배달비 저장</button>
    </div>

    <!-- 메뉴 등록 -->
    <div class="section">
      <h3>메뉴 등록</h3>
      <input v-model="menuName" placeholder="메뉴 이름" class="text-input" />
      <input v-model="menuPrice" type="number" placeholder="메뉴 가격 (원)" class="text-input" />
      <textarea v-model="menuDescription" placeholder="메뉴 설명" class="text-area"></textarea>
      <input type="file" @change="onFileChangeForMenu" class="file-input" />
      <div v-if="menuImagePreview" class="image-preview">
        <h4>이미지 미리보기:</h4>
        <img :src="menuImagePreview" alt="메뉴 이미지 미리보기" />
      </div>
      <button @click="saveMenu" class="primary-button">메뉴 저장</button>
    </div>

    <!-- 등록된 메뉴 목록 -->
    <div class="section">
      <h3>등록된 메뉴 목록</h3>
      <ul class="menu-list">
        <li v-for="menu in menus" :key="menu.id" class="menu-item">
          <div class="menu-details">
            <strong>{{ menu.name }}</strong> - {{ menu.price }}원
            <p>{{ menu.description }}</p>
          </div>
          <div v-if="menu.imageUrl" class="menu-image-container">
            <img :src="menu.imageUrl" alt="메뉴 이미지" @click="openModal(menu.imageUrl)" />
          </div>
          <button @click="deleteMenu(menu.id)" class="delete-button">삭제</button>
        </li>
      </ul>
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
      logoFile: null,
      menuName: '',
      menuPrice: '',
      menuDescription: '',
      menuImage: null,
      menuImagePreview: null,
      storeLogoPreview: null,
      menus: [],
      deliveryFee: '', // 배달비
      isModalOpen: false, 
      modalImage: null 
    };
  },
  mounted() {
    this.fetchMenus();
    this.fetchStoreLogo();
    this.fetchDeliveryFee(); // 배달비 불러오기
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
      const file = e.target.files[0]; // 첫 번째 파일 선택
      if (file) {
        // 파일 타입 확인 (이미지인지 확인)
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        this.menuImage = file; // 메뉴 이미지 데이터에 저장

        const reader = new FileReader(); // FileReader 객체 생성
        reader.onload = (e) => {
          this.menuImagePreview = e.target.result; // 미리보기 URL 저장
        };
        reader.readAsDataURL(file); // 파일 읽기 시작
      } else {
        this.menuImagePreview = null; // 파일이 선택되지 않은 경우 초기화
      }
    },
    uploadLogo() {
      if (!this.logoFile) {
        alert('로고를 선택해주세요.');
        return;
      }

      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const logoStorageRef = storageRef(getStorage(), `store/${userId}/logo/${this.logoFile.name}`);

      uploadBytes(logoStorageRef, this.logoFile).then(() => {
        getDownloadURL(logoStorageRef).then((url) => {
          const storeRef = ref(database, `store/${userId}`);
          
          // 기존 데이터를 유지하면서 로고 추가
          get(storeRef).then((snapshot) => {
            const existingData = snapshot.exists() ? snapshot.val() : {};
            set(storeRef, {
              ...existingData,
              logo: url,
            });
          });
          alert('로고가 성공적으로 저장되었습니다.');
        });
      });
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
          try {
            const snapshot = await uploadBytes(imageRef, this.menuImage);
            const imageUrl = await getDownloadURL(snapshot.ref);

            const businessInfoRef = ref(database, 'store/' + uid);
            const existingDataSnapshot = await get(businessInfoRef);
            const existingData = existingDataSnapshot.exists() ? existingDataSnapshot.val() : {};

            const newMenuData = {
              name: this.menuName,
              price: this.menuPrice,
              description: this.menuDescription,
              imageUrl,
            };

            // 기존 데이터를 유지하면서 새로운 메뉴 데이터 추가
            await set(businessInfoRef, { ...existingData, menu: { ...existingData.menu, [newMenuRef.key]: newMenuData } });

            alert('메뉴가 저장되었습니다.');
            this.resetMenuForm();
          } catch (error) {
            console.error('메뉴 저장 실패:', error);
            alert('메뉴 저장에 실패했습니다.');
          }
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
    async saveDeliveryFee() {
      if (!this.deliveryFee) {
        alert('배달비를 입력하세요.');
        return;
      }

      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const storeRef = ref(database, `store/${user.uid}`);
          try {
            // 기존 데이터 가져오기
            const existingDataSnapshot = await get(storeRef);
            const existingData = existingDataSnapshot.exists() ? existingDataSnapshot.val() : {};

            // 기존 데이터를 유지하면서 배달비 추가
            const updatedData = {
              ...existingData,
              deliveryFee: this.deliveryFee,
            };

            // 데이터베이스에 저장
            await set(storeRef, updatedData);
            alert('배달비가 저장되었습니다.');
          } catch (error) {
            console.error('배달비 저장 실패:', error);
            alert('배달비 저장에 실패했습니다.');
          }
        }
      });
    },
    fetchDeliveryFee() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const storeRef = ref(database, `store/${user.uid}/deliveryFee`);
          onValue(storeRef, (snapshot) => {
            this.deliveryFee = snapshot.val() || '';
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

@font-face {
  font-family: 'IBMPlexSansKR';
  src: url('@/assets/font/IBMPlexSansKR-Medium.ttf') format('opentype');
}

* {
  font-family: 'IBMPlexSansKR', sans-serif;
}
/* 공통 스타일 */
.menu-container {
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 상단 네비게이션 */
.top-navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.nav-button {
  background-color: #6750A4;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.nav-button:hover {
  background-color: #5E47A3;
  transform: scale(1.05);
}

/* 메인 섹션 */
.main-header {
  text-align: center;
  margin-bottom: 30px;
}

.main-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.main-header p {
  font-size: 16px;
  color: #666;
}

/* 공통 섹션 */
.section {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
}

/* 입력 필드 */
.text-input,
.text-area,
.file-input {
  width: 80%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #D0D0D0;
  border-radius: 8px;
  font-size: 16px;
}

.text-input:focus,
.text-area:focus,
.file-input:focus {
  outline: 2px solid #6750A4;
  border-color: #6750A4;
}

/* 버튼 */
.primary-button {
  background-color: #6750A4;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%;
}

.primary-button:hover {
  background-color: #5E47A3;
  transform: scale(1.03);
}

/* 미리보기 */
.logo-preview img,
.image-preview img {
  width: 100px;
  height: auto;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* 메뉴 리스트 */
.menu-list {
  list-style: none;
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F9F9F9;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}

.menu-details {
  flex: 1;
}

.menu-image-container img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.delete-button {
  background-color: #FF4D4D;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #E84343;
}
</style>
