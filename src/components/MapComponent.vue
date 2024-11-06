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
      markers: []
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
        center: new naver.maps.LatLng(35.153114, 128.099379),
        zoom: 16
      };
      this.map = new naver.maps.Map('map', mapOptions);

      // Firebase에서 스팟존 불러오기
      this.loadPickupZones();
    },
    loadPickupZones() {
      const pickupZoneRef = ref(database, 'pick-up-zone');
      onValue(pickupZoneRef, (snapshot) => {
        const data = snapshot.val();

        for (let key in data) {
          const zone = data[key];
          this.addPickupZoneMarker(zone.address, zone.specific);
        }
      });
    },
    addPickupZoneMarker(address, specific) {
      naver.maps.Service.geocode({ query: address }, (status, response) => {
        if (status === naver.maps.Service.Status.OK) {
          const latLng = new naver.maps.LatLng(response.v2.addresses[0].y, response.v2.addresses[0].x);
          const marker = new naver.maps.Marker({
            position: latLng,
            map: this.map,
            title: address
          });

          const infoWindow = new naver.maps.InfoWindow({
            content: `<div style="padding:10px;">${address} - ${specific}</div>`
          });

          naver.maps.Event.addListener(marker, 'click', () => {
            // 선택한 주소를 부모 컴포넌트에 전달
            this.$emit('select-address', `${address} - ${specific}`);
            infoWindow.open(this.map, marker);
          });

          this.markers.push(marker);
        } else {
          console.error('Geocode 실패:', status);
        }
      });
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
