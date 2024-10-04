<template>
    <div class="rounded-inner-drop-shadow-box">
      <div class="header">
        주소: {{ markerName }}
      </div>
  
      <slot>
        <div class="order-box">
          주문 내용을 여기에 표시합니다.
        </div>
        <div class="order-box2">
          주문 내용을 여기에 표시합니다.
        </div>
      </slot>
    </div>
    <div class="order-box3">
          새로운 주문 내용을 여기에 표시합니다.
        </div>
  </template>
  
  <script>
  export default {
    name: 'RoundedInnerDropShadowBox',
    props: {
      markerName: {
        type: String,
        default: '',
      },
    },
  };
  </script>
  
  <style scoped>
  .header {
    width: 100%;
    height: 10vh;
    padding: 5px;
    background-color: #FFFCED; /* 배경색 */
    border-radius: 0 0 50px 50px; /* 아래쪽만 둥근 모서리 */
    margin-top: 0; /* 윗부분을 화면에 맞춤 */
    margin-bottom: auto;
    position: relative; /* 그림자 위치를 위해 position 설정 */
    overflow: hidden; /* 그림자를 안쪽에 가두기 위해 overflow 설정 */
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25); /* 외부 drop shadow */
  }
  
  .rounded-inner-drop-shadow-box {
    width: 100%;
    height: 80vh; /* 높이 조정 */
    padding: 20px;
    background-color: #97B762; /* 배경색 */
    border-radius: 0 0 100px 100px; /* 아래쪽만 둥근 모서리 */
    margin-top: 0; /* 윗부분을 화면에 맞춤 */
    margin-bottom: auto;
    position: relative;
    overflow-y: auto; /* 세로 스크롤 추가 */
    overflow-x: hidden; /* 가로 스크롤 제거 */
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25); /* 외부 drop shadow */
  }
  
  .rounded-inner-drop-shadow-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0 0 100px 100px; /* 아래쪽만 둥근 모서리 */
    box-shadow: inset 0 4px 4px 0 rgba(255, 255, 255, 0.25); /* 안쪽 inner shadow */
    pointer-events: none; /* 그림자가 클릭 이벤트에 영향을 주지 않도록 */
  }
  
  /* 주문을 위한 사각형 틀 스타일 */
  .order-box {
    width: 60%;
    margin: 20px auto; /* 가운데 정렬 및 간격 추가 */
    padding: 30px;
    height: 20vh;
    background-color: #BFDC99;
    border-radius: 23px;
    box-shadow: 0px 3.14px 3.14px 0px rgba(0, 0, 0, 0.25); /* drop shadow */
    position: relative; /* 상대 위치 */
  }
  
  .order-box2 {
    width: 60%;
    margin: 20px auto; /* 가운데 정렬 및 간격 추가 */
    padding: 30px;
    height: 20vh;
    margin-top: 5vh; /* 첫 번째 상자와의 간격을 작게 조정 */
    background-color: #BFDC99;
    border-radius: 23px;
    box-shadow: 0px 3.14px 3.14px 0px rgba(0, 0, 0, 0.25); /* drop shadow */
    position: relative; /* 상대 위치 */
  }
  
  /* 새로운 박스 스타일 */
  .order-box3 {
    width: 60%;
    margin: 20px auto; /* 가운데 정렬 및 간격 추가 */
    padding: 30px;
    height: 20vh;
    margin-top: 5vh; /* 두 번째 상자와의 간격 */
    background-color: #BFDC99;
    border-radius: 23px;
    box-shadow: 0px 3.14px 3.14px 0px rgba(0, 0, 0, 0.25); /* drop shadow */
    position: relative; /* 상대 위치 */
  }
  </style>
  