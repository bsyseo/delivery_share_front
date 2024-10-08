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
        // 주문 페이지로 이동하면서 마커 이름 전달
        this.$router.push({ name: 'order', params: { markerName: content } });
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
</style>
