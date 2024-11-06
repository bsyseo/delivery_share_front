<template>
  <div class="spot-order-dashboard">
    <!-- 대시보드 그리드 레이아웃 -->
    <div class="dashboard-grid">
      <!-- 픽업존 등록 섹션 -->
      <div class="dashboard-item input-section">
        <h2>픽업존 등록</h2>
        <div class="input-group">
          <input type="number" v-model.number="latitude" placeholder="위도 입력" />
          <input type="number" v-model.number="longitude" placeholder="경도 입력" />
          <input type="text" v-model="placeName" placeholder="주소 이름 입력" />
          <button @click="addPickupZone" class="register-button">등록</button>
        </div>
      </div>

      <!-- 지도 섹션 -->
      <div class="dashboard-item map-section">
        <div id="map" class="map"></div>
      </div>
    </div>
    
    <h3>등록된 픽업존</h3>
    <ul class="pickup-list">
      <li v-for="(marker, index) in markers" :key="index">
        {{ marker.title }}
        <button @click="removeMarker(index, marker.id)" class="delete-button">삭제</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { database, ref, push, remove, onValue } from '@/firebase';

/* global naver */
export default {
  data() {
    return {
      latitude: null,
      longitude: null,
      placeName: '',
      map: null,
      markers: []
    };
  },
  methods: {
    async addPickupZone() {
      if (this.latitude === null || this.longitude === null || !this.placeName) {
        alert('위도, 경도, 그리고 주소 이름을 모두 입력해주세요.');
        return;
      }

      const position = new naver.maps.LatLng(this.latitude, this.longitude);

      try {
        // Firebase에 새로운 픽업존 등록
        const newMarkerRef = await push(ref(database, 'pickupZones'), {
          latitude: this.latitude,
          longitude: this.longitude,
          title: this.placeName
        });

        // 지도에 마커 추가
        const marker = new naver.maps.Marker({
          position,
          map: this.map,
          title: this.placeName
        });

        const infoWindow = new naver.maps.InfoWindow({
          content: `<div style="padding:5px;">${this.placeName}</div>`
        });
        infoWindow.open(this.map, marker);

        // 마커 목록에 추가
        this.markers.push({
          marker,
          position,
          title: this.placeName,
          id: newMarkerRef.key
        });
        
        // 입력 필드 초기화
        this.latitude = null;
        this.longitude = null;
        this.placeName = '';
      } catch (error) {
        console.error("Firebase에 데이터를 저장하는 중 오류 발생:", error);
        alert("픽업존을 등록하는 중 오류가 발생했습니다.");
      }
    },
    async removeMarker(index, markerId) {
      try {
        // Firebase에서 마커 삭제
        await remove(ref(database, `pickupZones/${markerId}`));

        // 지도에서 마커 제거
        this.markers[index].marker.setMap(null);
        this.markers.splice(index, 1);
      } catch (error) {
        console.error("Firebase에서 데이터를 삭제하는 중 오류 발생:", error);
        alert("픽업존을 삭제하는 중 오류가 발생했습니다.");
      }
    },
    loadMarkersFromFirebase() {
      const pickupZonesRef = ref(database, 'pickupZones');
      onValue(pickupZonesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.clearMarkers(); // 기존 마커 초기화

          Object.keys(data).forEach((key) => {
            const pickupZone = data[key];
            const position = new naver.maps.LatLng(pickupZone.latitude, pickupZone.longitude);

            const marker = new naver.maps.Marker({
              position,
              map: this.map,
              title: pickupZone.title
            });

            const infoWindow = new naver.maps.InfoWindow({
              content: `<div style="padding:5px;">${pickupZone.title}</div>`
            });
            infoWindow.open(this.map, marker);

            // 마커 목록에 추가
            this.markers.push({
              marker,
              position,
              title: pickupZone.title,
              id: key
            });
          });
        }
      });
    },
    clearMarkers() {
      // 모든 마커 제거
      this.markers.forEach(markerObj => markerObj.marker.setMap(null));
      this.markers = [];
    }
  },
  mounted() {
    if (typeof naver === 'undefined' || typeof naver.maps === 'undefined') {
      console.error("Naver Maps API가 로드되지 않았습니다.");
      return;
    }

    this.map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(35.153485, 128.101100),
      zoom: 10,
    });

    this.loadMarkersFromFirebase(); // 페이지 로드시 모든 픽업존 로드
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
  box-sizing: border-box;
}

.spot-order-dashboard {
  padding: 24px;
  background-color: #fafafa;
  min-height: 80vh;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-item {
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
}

.input-section h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input[type="number"], input[type="text"] {
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
}

input[type="number"]:focus, input[type="text"]:focus {
  border-color: #6200ea;
}

.register-button {
  padding: 12px;
  font-size: 1rem;
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: center; /* 버튼을 가운데로 정렬 */
}

.register-button:hover {
  background-color: #3700b3;
}

.map-section {
  overflow: hidden;
  display: flex;
  align-items: center;
}

.map {
  width: 100%;
  height: 60vh;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.4rem;
  color: #333;
  margin-top: 20px;
  text-align: center;
}

.pickup-list {
  list-style: none;
  padding: 0;
}

.pickup-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 6px; /* margin-top 줄임 */
  transition: transform 0.2s ease;
}

.pickup-list li:hover {
  transform: translateY(-2px);
  background-color: #f9f9f9;
}

.delete-button {
  padding: 6px 12px;
  font-size: 0.9rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c0392b;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .input-section h2 {
    font-size: 1.5rem;
  }

  .map {
    height: 50vh;
  }
}
</style>
