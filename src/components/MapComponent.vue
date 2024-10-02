<template>
  <div class="map-container">
    <!-- 헤더 부분 -->
    <div class="header">
      <h2>{{ userName }}님 환영합니다</h2>
      <p>원하는 배달 장소를 지도에서 선택하세요!</p>
    </div>

    <!-- DELIVERY SPOT 텍스트 -->
    <div class="delivery-spot">
      <h3>DELIVERY SPOT</h3>
    </div>

    <!-- 지도 컨테이너 -->
    <div class="map-wrapper">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
/* global naver */ // Inform ESLint about the global naver object

import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '@/main'; // main.js에서 Firebase 설정 가져오기

export default {
  name: 'MapComponent',
  data() {
    return {
      userName: '', // 사용자의 이름을 저장할 변수
    };
  },
  mounted() {
    // 네이버 지도 SDK가 로드되었는지 확인하고, 로드 후 initMap 실행
    if (typeof naver !== 'undefined') {
      this.initMap();
    } else {
      // SDK가 아직 로드되지 않았을 경우
      const script = document.createElement('script');
      script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=i3rhpr81uf';
      script.onload = this.initMap;
      document.head.appendChild(script);
    }

    // 로그인된 사용자를 확인
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 사용자 UID를 사용하여 데이터베이스에서 이름을 가져옴
        const userRef = ref(database, 'users/' + user.uid + '/name');
        onValue(userRef, (snapshot) => {
          this.userName = snapshot.val();
        });
      }
    });
  },
  methods: {
    initMap() {
      // 네이버 지도 객체 생성
      const mapOptions = {
        center: new naver.maps.LatLng(35.153114, 128.099379), // 초기 좌표 (경상국립대학교 가좌캠퍼스)
        zoom: 16
      };
      const map = new naver.maps.Map('map', mapOptions);

      // 마커 추가
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(35.153114, 128.099379),
        map: map
      });

      // 정보창 추가
      const infoWindow = new naver.maps.InfoWindow({
        content: '<div style="padding:10px;">경상국립대학교 가좌캠퍼스</div>'
      });

      // 마커 클릭 시 정보창 열기
      naver.maps.Event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
      });
    }
  }
};
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #BFDC99; /* 페이지 배경색 설정 */
  padding: 20px 0;
}

/* 헤더 스타일 */
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

/* DELIVERY SPOT 텍스트 스타일 */
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

/* 지도 컨테이너 스타일 */
.map-wrapper {
  background-color: white; /* 지도 배경색 */
  border-radius: 20px; /* 경계 둥글게 */
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px; /* 지도 주변 여백 */
  max-width: 1200px; /* 최대 너비 설정 */
  width: 90%; /* 화면 너비의 90% */
}

/* 지도 자체 스타일 */
#map {
  width: 100%;
  height: 500px; /* 지도의 높이 */
  border-radius: 15px;
}
</style>
