<template>
  <div class="pickup-zone-management">
    <h1>픽업존 관리</h1>

    <!-- 지도 표시 영역 -->
    <div id="map" class="map-container"></div>

    <!-- 주소 입력 폼 -->
    <div class="address-form">
      <label for="address">주소</label>
      <input v-model="address" type="text" id="address" placeholder="주소를 입력하세요" /><br />
      <label for="specific">상세 주소</label>
      <input v-model="specific" type="text" id="specific" placeholder="상세 주소를 입력하세요" /><br />
      <button @click="saveLocation">저장</button>
    </div>

    <!-- 저장된 주소 목록 -->
    <h2>저장된 픽업 존</h2>
    <table class="address-table">
      <thead>
        <tr>
          <th>주소</th>
          <th>상세 주소</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(zone, index) in pickupZones" :key="index">
          <td>{{ zone.address }}</td>
          <td>{{ zone.specific }}</td>
          <td><button @click="deleteLocation(zone.key)">삭제</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* global naver */  
import { getDatabase, ref, push, remove, onValue, set } from 'firebase/database';

export default {
  data() {
    return {
      address: '', // 입력한 주소
      specific: '', // 입력한 상세 주소
      map: null, // 네이버 지도 객체
      markers: [], // 지도 상의 마커
      pickupZones: [] // DB에서 불러온 픽업존 리스트
    };
  },
  methods: {
    initializeMap() {
      this.map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(35.1538, 128.0986), // 경상대 좌표
        zoom: 10
      });

      // 지도 클릭 이벤트: 클릭한 위치로 주소를 입력할 수 있도록 함
      naver.maps.Event.addListener(this.map, 'click', (e) => {
        const latLng = e.coord;
        console.log('Clicked location:', latLng);
      });

      // DB에서 저장된 위치들을 지도에 핀으로 표시
      this.loadLocationsFromDB();
    },

    async saveLocation() {
      if (!this.address || !this.specific) {
        alert('주소와 상세 주소를 입력해 주세요.');
        return;
      }

      const db = getDatabase();
      const pickupZoneRef = ref(db, 'pick-up-zone'); // pick-up-zone 경로 참조

      const newLocationRef = push(pickupZoneRef); // 새로운 키 생성
      await set(newLocationRef, {  // set 메서드로 데이터 저장
        address: this.address,
        specific: this.specific
      });

      // 입력한 정보 초기화
      this.address = '';
      this.specific = '';

      // 새로운 데이터를 지도에 반영
      this.loadLocationsFromDB();
    },

    loadLocationsFromDB() {
      const db = getDatabase();
      const pickupZoneRef = ref(db, 'pick-up-zone');

      onValue(pickupZoneRef, (snapshot) => {
        const data = snapshot.val();
        this.pickupZones = [];

        // 지도에 있는 기존 마커 제거
        this.clearMarkers();

        for (let key in data) {
          const zone = data[key];
          this.pickupZones.push({ ...zone, key });

          // 해당 주소로 마커 찍기 (주소 -> 좌표 변환 필요)
          this.placeMarker(zone.address);
        }
      });
    },

    placeMarker(address) {
      if (!naver || !naver.maps || !naver.maps.Service) {
        console.error('네이버 지도 API가 로드되지 않았습니다.');
        return;
      }

      naver.maps.Service.geocode({ query: address }, (status, response) => {
        if (status === naver.maps.Service.Status.OK) {
          const latLng = new naver.maps.LatLng(response.v2.addresses[0].y, response.v2.addresses[0].x);
          const marker = new naver.maps.Marker({
            position: latLng,
            map: this.map
          });
          this.markers.push(marker);
        } else {
          console.error('Geocode 실패:', status);
        }
      });
    },

    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },

    async deleteLocation(key) {
      const db = getDatabase();
      const locationRef = ref(db, `pick-up-zone/${key}`);
      await remove(locationRef);

      // 삭제 후 다시 로드
      this.loadLocationsFromDB();
    }
  },
  mounted() {
    if (typeof naver === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=i3rhpr81uf`;
      script.async = true;
      script.onload = this.initializeMap;  // 스크립트 로드가 완료된 후 지도를 초기화
      document.head.appendChild(script);
    } else {
      this.initializeMap();
    }
  }
};
</script>