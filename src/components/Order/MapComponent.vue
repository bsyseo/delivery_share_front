<template>
  <div class="map-container">
    <!-- 지도 영역 -->
    <div class="map-section">
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
      userName: '',
      map: null,
      markers: [],
      infoWindow: null // 현재 열려있는 InfoWindow를 저장
    };
  },
  mounted() {
    if (typeof naver !== 'undefined') {
      this.initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=i3rhpr81uf';
      script.onload = this.initMap;
      document.head.appendChild(script);
    }

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
      const mapOptions = {
        center: new naver.maps.LatLng(35.153485, 128.101100),
        zoom: 15,
      };
      this.map = new naver.maps.Map('map', mapOptions);

      // Firebase에서 픽업존 불러오기
      this.loadPickupZones();
    },
    loadPickupZones() {
      const pickupZonesRef = ref(database, 'pickupZones');
      onValue(pickupZonesRef, (snapshot) => {
        const data = snapshot.val();

        // 기존 마커 초기화
        this.clearMarkers();

        // 각 픽업존에 대해 마커 추가
        for (let key in data) {
          const zone = data[key];
          this.addPickupZoneMarker(zone.latitude, zone.longitude, zone.detail); // detail 값을 전달
        }
      });
    },
    addPickupZoneMarker(latitude, longitude, detail) {
      const latLng = new naver.maps.LatLng(latitude, longitude);
      const marker = new naver.maps.Marker({
        position: latLng,
        map: this.map,
        title: detail // 마커 제목을 detail로 설정
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="padding:10px;">${detail}</div>`
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        // 이미 열려 있는 InfoWindow가 있다면 닫기
        if (this.infoWindow) {
          this.infoWindow.close();
        }
        infoWindow.open(this.map, marker);
        this.infoWindow = infoWindow;

        // 선택한 주소의 detail을 부모 컴포넌트에 전달
        this.$emit('select-address', detail);
      });

      this.markers.push(marker);
    },
    clearMarkers() {
      // 모든 마커 제거
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    }
  }
};
</script>

<style scoped>


#map {
  width: 700px;
  height: 500px;
  border-radius: 16px;
}
</style>
