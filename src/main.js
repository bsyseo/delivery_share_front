import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { initializeApp } from 'firebase/app' // Firebase 모듈을 가져오기
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

// Firebase 설정 객체
const firebaseConfig = {
    apiKey: "AIzaSyDnj5FyDEmA5k25z1WwHGiLQmODBgPdQ30",
    authDomain: "delivery-sharing-b6e44.firebaseapp.com",
    databaseURL: "https://delivery-sharing-b6e44-default-rtdb.firebaseio.com",
    projectId: "delivery-sharing-b6e44",
    storageBucket: "delivery-sharing-b6e44.appspot.com",
    messagingSenderId: "723375501640",
    appId: "1:723375501640:web:9490af7fdc913a4dbc837d"
};

// Firebase 초기화
const firebaseApp = initializeApp(firebaseConfig);

// Firebase 인증 및 데이터베이스 초기화
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

// auth와 database를 export하여 다른 파일에서 사용할 수 있도록 함
export { auth, database };

// Vue 앱 생성 및 라우터 사용
createApp(App).use(router).mount('#app')

