import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/Login.vue';
import SignUpView from '@/views/SignUp.vue';
import MapView from '@/views/map.vue';
import orderView from '@/views/order.vue';
import ResetPasswordView from '@/views/Reset_IDnPW.vue';
import ResetPasswordComponent from '@/components/ResetPasswordComponent.vue';
import BusinessView from '@/views/Business.vue'; // 비즈니스 사용자 페이지
import BusinessInformation from '@/components/BusinessInformation.vue'; // 사업자 정보 페이지
import BusinessMenu from '@/components/BusinessMenu.vue'; // 메뉴 등록 페이지
import BusinessTypeSelect from '@/components/BusinessTypeSelect.vue'; // 가게 타입 선택 페이지
import BusinessAdvertisement from '@/components/BusinessAdvertisement.vue'; // 광고 신청 페이지
import AdminComponent from '@/views/AdminComponent.vue'; // 관리자 페이지
import AdminOrderManagement from '@/views/AdminOrderManagement.vue';
import AdminCouponManagement from '@/views/AdminCouponManagement.vue';
import AdminAdvertisementManagement from '@/views/AdminAdvertisementManagement.vue';
import AdminQnAManagement from '@/views/AdminQnAManagement.vue'; // Q&A 관리
import AdminPickUpZoneManagement from '@/views/AdminPickUpZoneManagement.vue'; // PICK-UP-ZONE 관리
import AdminUserManagement from '@/views/AdminUserManagement.vue';
import AdminStoreManagement from '@/views/AdminStoreManagement.vue';
import AdminTemporary from '@/views/AdminTemporary.vue';
import AdminConnectionStatistics from '@/views/AdminConnectionStatistics.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView
  },
  {
    path: '/map',
    name: 'map',
    component: MapView
  },
  {
    path: '/business',
    name: 'Business',
    component: BusinessView // business 사용자가 보는 페이지
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminComponent // admin 사용자가 보는 페이지
  },
  { 
    path: '/Reset_IDnPW',
    name : 'Reset_IDnPW',
    component: ResetPasswordView 
  },
  {
    path: '/Reset_PW',
    name: 'ResetPasswordComponent',
    component: ResetPasswordComponent
  },
  {
    path: '/order',
    name: 'order',
    component: orderView
  },
  {
    path: '/business_information',
    name: 'business_information',
    component: BusinessInformation // 사업자 정보 페이지로 이동
  },
  {
    path: '/business_menu',
    name: 'business_menu',
    component: BusinessMenu // 메뉴 등록 페이지로 이동
  },
  {
    path: '/business_typeselect',
    name: 'business_typeselect',
    component: BusinessTypeSelect // 가게 타입 선택 페이지로 이동
  },
  {
    path: '/business_advertisement',
    name: 'business_advertisement',
    component: BusinessAdvertisement // 광고 신청 페이지로 이동
  },
  {
    path: '/admin/order-management',
    name: 'AdminOrderManagement',
    component: AdminOrderManagement
  },
  {
    path: '/admin/coupon-management',
    name: 'AdminCouponManagement',
    component: AdminCouponManagement
  },
  {
    path: '/admin/advertisement-management',
    name: 'AdminAdvertisementManagement',
    component: AdminAdvertisementManagement
  },
  {
    path: '/admin/qna-management',
    name: 'AdminQnAManagement',
    component: AdminQnAManagement
  },
  {
    path: '/admin/pickupzonemanagement',
    name: 'AdminPickUpZoneManagement',
    component: AdminPickUpZoneManagement
  },
  {
    path: '/admin/user-management',
    name: 'AdminUserManagement',
    component: AdminUserManagement
  },
  {
    path: '/admin/store-management',
    name: 'AdminStoreManagement',
    component: AdminStoreManagement
  },
  {
    path: '/admin/temporary',
    name: 'AdminTemporary',
    component: AdminTemporary
  },
  {
    path: '/admin/connection-statistics',
    name: 'AdminConnectionStatistics',
    component: AdminConnectionStatistics
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
