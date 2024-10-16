import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/Login.vue';
import SignUpView from '@/views/SignUp.vue';
import MapView from '@/views/map.vue';
import OrderView from '@/views/order.vue';
import ResetPasswordView from '@/views/Reset_IDnPW.vue';
import ResetPasswordComponent from '@/components/ResetPasswordComponent.vue';
import BusinessView from '@/views/Business.vue'; // 비즈니스 사용자 페이지
import BusinessInformation from '@/components/BusinessInformation.vue'; // 사업자 정보 페이지
import BusinessMenu from '@/components/BusinessMenu.vue'; // 메뉴 등록 페이지
import BusinessAdvertisement from '@/components/BusinessAdvertisement.vue'; // 광고 신청 페이지

// 관리자 관련 컴포넌트들
import AdminView from '@/views/Admin.vue'; // 관리자 메인 페이지
import AdminOrderManagement from '@/components/AdminOrderManagement.vue';
import AdminCouponManagement from '@/components/AdminCouponManagement.vue';
import AdminAdvertisementManagement from '@/components/AdminAdvertisementManagement.vue';
import AdminQnAManagement from '@/components/AdminQnAManagement.vue'; // Q&A 관리
import AdminPickUpZoneManagement from '@/components/AdminPickUpZoneManagement.vue'; // PICK-UP-ZONE 관리
import AdminUserManagement from '@/components/AdminUserManagement.vue';
import AdminStoreManagement from '@/components/AdminStoreManagement.vue';
import AdminTemporary from '@/components/AdminTemporary.vue';
import AdminConnectionStatistics from '@/components/AdminConnectionStatistics.vue';

import MakingOrderView from '@/views/MakingOrder.vue';
import StoreInformation from '@/components/store_information.vue'; // 가게 정보 입력 페이지
import UserMypage from '@/views/UserMypage.vue';
import OrderHistory from '@/components/OrderHistoryComponent.vue';
import EditUserInfo from '@/components/EditUserInfo.vue';
import QnAComponent from '@/components/QnA_Component.vue';
import UserReview from '@/components/review.vue';

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
    component: BusinessView // 비즈니스 사용자가 보는 페이지
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: AdminView // 관리자 메인 페이지로 수정
  },
  {
    path: '/reset-idpw',
    name: 'ResetIDnPW',
    component: ResetPasswordView
  },
  {
    path: '/reset-password',
    name: 'ResetPasswordComponent',
    component: ResetPasswordComponent
  },
  {
    path: '/order',
    name: 'Order',
    component: OrderView
  },
  {
    path: '/business_information',
    name: 'BusinessInformation',
    component: BusinessInformation // 사업자 정보 페이지로 이동
  },
  {
    path: '/business_menu',
    name: 'BusinessMenu',
    component: BusinessMenu // 메뉴 등록 페이지로 이동
  },
  {
    path: '/business_advertisement',
    name: 'BusinessAdvertisement',
    component: BusinessAdvertisement // 광고 신청 페이지로 이동
  },
  // 관리자 관련 라우트들
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
    path: '/admin/pickup-zone-management',
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
  },
  {
    path: '/making_order',
    name: 'MakingOrder',
    component: MakingOrderView
  },
  {
    path: '/store_information',
    name: 'StoreInformation',
    component: StoreInformation // 가게 정보 입력 페이지
  },
  {
    path: '/UserMypage',
    name: 'UserMypage',
    component: UserMypage
  },
  {
    path: '/OrderHistory',
    name: 'OrderHistory',
    component: OrderHistory
  },
  {
    path: '/EditUserInfo',
    name: 'EditUserInfo',
    component: EditUserInfo
  },
  {
    path: '/qna',
    name: 'QnAComponent',
    component: QnAComponent
  },
  {
    path: '/review',
    name: 'Review',
    component: UserReview
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
