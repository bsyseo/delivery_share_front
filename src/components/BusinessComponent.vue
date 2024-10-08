<template>
    <div class="map-container">
      <div class="header">
        <h2>사장님, 환영합니다.</h2>
        <p>가게를 등록해 주세요!</p>
      </div>
  
      <div class="map-wrapper">
        <div id="map"></div>
      </div>
  
      <div class="address-section">
        <h3>사장님 가게 주소 입력</h3>
        <!-- 현재 저장된 storeAddress 출력 -->
        <p>현재 저장된 가게 주소: <strong>{{ storeAddress ? storeAddress : '입력 필요' }}</strong></p>
  
        <div class="address-input">
          <input v-model="newAddress" placeholder="새로운 가게 주소를 입력하세요" />
          <button @click="saveAddress">저장하기</button>
        </div>
      </div>
  
      <div class="button-section">
        <button @click="navigateTo('business_information')">사업자 정보 등록</button>
        <button @click="navigateTo('business_menu')">메뉴 수정</button>
        <button @click="navigateTo('business_typeselect')">가게 타입 선택</button>
        <button @click="navigateTo('business_advertisement')">광고 신청</button>
      </div>
    </div>
  </template>
  
  <script>
  /* global naver */
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { getDatabase, ref, set } from 'firebase/database';
  
  export default {
    name: 'BusinessComponent',
    data() {
      return {
        newAddress: '', // 새로운 가게 주소 입력 필드
        map: null, // 지도 객체
        markers: [] // 마커 배열
      };
    },
    props: {
      // 부모로부터 전달받은 storeAddress prop
      storeAddress: {
        type: String,
        required: true
      }
    },
    mounted() {
      // 네이버 지도 SDK가 로드되었는지 확인하고 로드 후 initMap 실행
      if (typeof naver !== 'undefined') {
        this.initMap();
      } else {
        const script = document.createElement('script');
        script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=i3rhpr81uf';
        script.onload = this.initMap;
        document.head.appendChild(script);
      }
    },
    methods: {
      saveAddress() {
        const auth = getAuth();
        const db = getDatabase();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const addressRef = ref(db, `users/${user.uid}/storeAddress`);
            set(addressRef, this.newAddress)
              .then(() => {
                alert('주소가 저장되었습니다.');
                this.$emit('update-address', this.newAddress);
              })
              .catch((error) => {
                console.error('주소 저장 실패:', error);
              });
          }
        });
      },
      navigateTo(route) {
        this.$router.push({ name: route });
      },
      initMap() {
        // 네이버 지도 객체 생성
        const mapOptions = {
          center: new naver.maps.LatLng(35.153114, 128.099379),
          zoom: 16
        };
        this.map = new naver.maps.Map('map', mapOptions);
  
        // 마커 추가
        this.addMarker(35.153114, 128.099379, '가게 위치');
      },
      addMarker(lat, lng, content) {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(lat, lng),
          map: this.map
        });
  
        // 정보창 추가
        const infoWindow = new naver.maps.InfoWindow({
          content: `<div style="padding:10px;">${content}</div>`
        });
  
        // 마커 클릭 이벤트
        naver.maps.Event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        });
  
        this.markers.push(marker);
      }
    }
  };
  </script>
  
  <style scoped>
  .map-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #BFDC99;
    padding: 20px 0;
  }
  
  .header {
    background-color: white;
    padding: 20px 40px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .header h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #444;
  }
  
  .header p {
    font-size: 18px;
    color: #777;
  }
  
  .delivery-spot {
    margin-bottom: 10px;
  }
  
  .delivery-spot h3 {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    color: #444;
  }
  
  .map-wrapper {
    background-color: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 1200px;
    width: 90%;
  }
  
  #map {
    width: 100%;
    height: 500px;
    border-radius: 15px;
  }
  
  .address-input {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 15px;
  }
  
  .address-input input {
    padding: 10px;
    width: 300px;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease;
  }
  
  .address-input input:focus {
    border-color: #4CAF50;
  }
  
  .address-input button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .address-input button:hover {
    background-color: #45a049;
    transform: translateY(-3px);
  }
  
  .button-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .button-section button {
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .button-section button:hover {
    background-color: #45a049;
    transform: translateY(-3px);
  }
  
  .button-section button:focus {
    outline: none;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  }
  </style>
  