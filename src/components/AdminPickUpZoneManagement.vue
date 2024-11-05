<template>
  <div class="pickup-zone-management">
    <h1>픽업존 관리</h1>

    <!-- 지도 표시 영역 -->
    <div id="map" class="map-container"></div>

    <!-- 주소 입력 폼 -->
    <div class="address-form">
      <label for="searchAddress">주소 검색</label>
      <input v-model="searchAddress" type="text" id="searchAddress" placeholder="주소를 검색하세요" />
      <button @click="searchAddressOnMap">검색</button><br />

      <label for="address">선택된 주소</label>
      <input v-model="address" type="text" id="address" placeholder="주소를 입력하세요" readonly /><br />
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
      searchAddress: '', // 검색할 주소
      address: '', // 선택된 주소
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
      this.loadLocationsFromDB();
    },

    async searchAddressOnMap() {
      if (!this.searchAddress) {
        alert('검색할 주소를 입력해 주세요.');
        return;
      }

      naver.maps.Service.geocode({ query: this.searchAddress }, (status, response) => {
        if (status === naver.maps.Service.Status.OK) {
          const latLng = new naver.maps.LatLng(response.v2.addresses[0].y, response.v2.addresses[0].x);

          // 지도 중심을 검색한 위치로 이동
          this.map.setCenter(latLng);

          // 검색한 주소로 마커 추가 및 주소 필드 업데이트
          this.address = response.v2.addresses[0].roadAddress || response.v2.addresses[0].jibunAddress;

          const marker = new naver.maps.Marker({
            position: latLng,
            map: this.map,
            title: '검색된 주소'
          });

          // 기존 마커 제거 후 새 마커 저장
          this.clearMarkers();
          this.markers.push(marker);
        } else {
          alert('주소를 찾을 수 없습니다.');
          console.error('Geocode 실패:', status);
        }
      });
    },

    async saveLocation() {
      if (!this.address || !this.specific) {
        alert('주소와 상세 주소를 입력해 주세요.');
        return;
      }

      const db = getDatabase();
      const pickupZoneRef = ref(db, 'pick-up-zone');
      const newLocationRef = push(pickupZoneRef);
      await set(newLocationRef, {
        address: this.address,
        specific: this.specific
      });

      this.address = '';
      this.specific = '';
      this.searchAddress = '';
      this.loadLocationsFromDB();
    },

    loadLocationsFromDB() {
      const db = getDatabase();
      const pickupZoneRef = ref(db, 'pick-up-zone');

      onValue(pickupZoneRef, (snapshot) => {
        const data = snapshot.val();
        this.pickupZones = [];
        this.clearMarkers();

        for (let key in data) {
          const zone = data[key];
          this.pickupZones.push({ ...zone, key });
          this.placePickupZoneMarker(zone.address);
        }
      });
    },

    placePickupZoneMarker(address) {
      naver.maps.Service.geocode({ query: address }, (status, response) => {
        if (status === naver.maps.Service.Status.OK) {
          const latLng = new naver.maps.LatLng(response.v2.addresses[0].y, response.v2.addresses[0].x);
          const marker = new naver.maps.Marker({
            position: latLng,
            map: this.map,
            title: '픽업존'
          });

          const infoWindow = new naver.maps.InfoWindow({
            content: '<div style="padding:10px;font-size:14px;">픽업존</div>'
          });

          naver.maps.Event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
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
      this.loadLocationsFromDB();
    }
  },
  mounted() {
    if (typeof naver === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID`;
      script.async = true;
      script.onload = this.initializeMap;
      document.head.appendChild(script);
    } else {
      this.initializeMap();
    }
  }
};
</script>


<style scoped>
.pickup-zone-management {
  padding: 24px;
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1000px;
  margin: 0 auto;
  border-radius: 20px;
}

h1 {
  font-size: 28px;
  color: #333;
  font-weight: bold;
  margin-bottom: 24px;
}

.map-container {
  width: 700px;
  height: 50vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.address-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px; 
  margin-bottom: 24px;
}

.address-form label {
  font-size: 16px;
  color: #555;
  font-weight: 500;
  margin-top: 12px;
  width: 100%;
  text-align: left;
}

.address-form input {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #f7f7f7;
}

.address-form button {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #6200ea;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.address-table {
  width: 100%;
  max-width: 1000px; /* 테이블의 최대 너비를 확장 */
  border-collapse: collapse;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.address-table th, .address-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.address-table button {
  padding: 8px 16px;
  background-color: #ff4d4d;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
