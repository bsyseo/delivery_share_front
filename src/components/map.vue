<template>
  <div class="head">
    <div class="welcome-box">
      <h2>{{ userName }}님 환영합니다</h2>
      <p>원하는 배달 장소를 지도에서 선택하세요!</p>
    </div>
    <div class="prompt">
      <p>Delivery Spot</p>
    </div>
    <!-- 지도 컨테이너 -->
    <div id="map-container">
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
  name: 'map-component',
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

      // Geocoding API를 사용하여 주소를 좌표로 변환하고 지도에 표시
      this.geocodeAddress('경상국립대학교 가좌캠퍼스', map, marker, infoWindow);
    },
    geocodeAddress(address, map, marker, infoWindow) {
      const apiUrl = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode';
      const query = encodeURIComponent(address);
      const url = `${apiUrl}?query=${query}`;

      fetch(url, {
        method: 'GET',
        headers: {
          'x-ncp-apigw-api-key-id': 'i3rhpr81uf', // 실제 클라이언트 ID로 교체
          'x-ncp-apigw-api-key': 'pfAsOb67bDkOfyjmIPFmPSAkuuZLmN3hcOEiK4kJ', // 실제 클라이언트 시크릿으로 교체
          'Accept': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.addresses.length > 0) {
            const lat = data.addresses[0].y;
            const lng = data.addresses[0].x;
            const location = new naver.maps.LatLng(lat, lng);
            map.setCenter(location);
            marker.setPosition(location);
            infoWindow.setContent(`<div style="padding:10px;">${data.addresses[0].roadAddress || data.addresses[0].jibunAddress}</div>`);
            infoWindow.open(map, marker);
          } else {
            alert('주소를 찾을 수 없습니다.');
          }
        })
        .catch(error => {
          console.error('Geocoding API 오류:', error);
          alert('Geocoding API 인증이 실패했습니다.');
        });
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'NanumSquareRound';
  src: url('@/assets/font/NANUMSQUAREROUNDOTFL.OTF') format('opentype');
}

.head {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'NanumSquareRound', sans-serif; /* 모든 폰트 설정 */
}

/* 환영 박스 스타일 */
.welcome-box {
  margin-bottom: 20px;
  text-align: center;
}

.welcome-box h2 {
  font-size: 24px;
  color: #444;
}

/* "배달 장소를 선택해 주세요" 텍스트 스타일 */
.prompt {
  margin-top: 20px;
  text-align: center;
  font-size: 20px; /* 글자 크기 증가 */
  font-family: 'NanumSquareRound', sans-serif; /* 지정한 폰트 설정 */
}

/* 지도 컨테이너 배경 스타일 */
#map-container {
  width: 80%;
  height: 400px;
  margin: 0 auto; /* 가운데 정렬 */
  margin-bottom: 20px;
  background-color: #c7e5a8; /* 배경색 설정 */
  padding: 10px;
  border-radius: 8px; /* 모서리를 둥글게 */
}

/* 지도 자체 스타일 */
#map {
  width: 100%;
  height: 100%;
  border-radius: 8px; /* 모서리를 둥글게 */
}
</style>
