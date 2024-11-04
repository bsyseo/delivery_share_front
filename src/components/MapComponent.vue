<template>
  <div class="map-container">
    <!-- 헤더 부분 -->
    <div class="header">
      <h2>{{ userName }}님 환영합니다</h2>
      <p>원하는 배달 장소를 지도에서 선택하세요!</p>
    </div>

    <!-- 이전으로 돌아가기 버튼 -->
    <div class="back-button-wrapper">
      <button class="back-button" @click="goBack">홈 화면으로 돌아가기</button>
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
/* global naver */
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '@/main';

export default {
  name: 'MapComponent',
  data() {
    return {
      userName: '', // 사용자의 이름을 저장할 변수
      map: null, // 지도 객체
      markers: [] // 마커 배열
    };
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

    // 로그인된 사용자를 확인
    onAuthStateChanged(auth, (user) => {
      if (user) {
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
        center: new naver.maps.LatLng(35.153114, 128.099379),
        zoom: 16
      };
      this.map = new naver.maps.Map('map', mapOptions);

      // 마커 추가
      this.addMarker(35.153114, 128.099379, '경상국립대학교 가좌캠퍼스');
      this.addMarker(35.154401, 128.092888, '항공우주산학협력관');
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
        // 주문 페이지로 이동하면서 마커 이름을 query로 전달
        this.$router.push('/order');
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    },
    goBack() {
      this.$router.push('/');
    }
  }
};
</script>
<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F9FAFB;
  padding: 32px 16px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #FFFFFF;
  padding: 24px 48px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  width: 100%;
  max-width: 800px;
}

.header h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1A202C;
}

.header p {
  font-size: 18px;
  color: #4A5568;
}

.delivery-spot {
  margin-bottom: 16px;
  text-align: center;
}

.delivery-spot h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1A202C;
}

.map-wrapper {
  background-color: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  max-width: 1200px;
}

#map {
  width: 100%;
  height: 500px;
  border-radius: 12px;
}

/* 이전으로 돌아가기 버튼 스타일 */
.back-button-wrapper {
  margin-top: 20px;
}

.back-button {
  background-color: #3182CE;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: #2B6CB0;
  transform: translateY(-2px);
}

.back-button:active {
  transform: translateY(0);
}
</style>
