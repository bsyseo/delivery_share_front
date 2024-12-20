import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

import SignUpView from '@/components/Authentication/SignUpComponent.vue';
import OrderView from '@/views/order.vue';
import BusinessView from '@/views/Business.vue';
import BusinessInformation from '@/components/User/BusinessInformation.vue';
import BusinessMenu from '@/components/User/BusinessMenu.vue';
import BusinessAdvertisement from '@/components/User/BusinessAdvertisement.vue';

// 관리자 관련 컴포넌트들
import AdminView from '@/views/Admin.vue';
import AdminOrderManagement from '@/components/Admin/AdminOrderManagement.vue';
import AdminReviewManagement from '@/components/Admin/AdminReviewManagement.vue';  // 수정된 부분
import AdminQnAManagement from '@/components/Admin/AdminQnAManagement.vue';
import AdminPickUpZoneManagement from '@/components/Admin/AdminPickUpZoneManagement.vue';
import AdminUserManagement from '@/components/Admin/AdminUserManagement.vue';
import AdminStoreManagement from '@/components/Admin/AdminStoreManagement.vue';
import AdminTemporary from '@/components/Admin/AdminTemporary.vue';

import MakingOrderView from '@/views/MakingOrder.vue';
import StoreInformation from '@/components/User/store_information.vue';
import UserMypage from '@/views/UserMypage.vue';
import OrderHistory from '@/components/Order/OrderHistoryComponent.vue';
import EditUserInfo from '@/components/User/EditUserInfo.vue';
import QnAComponent from '@/components/User/QnA_Component.vue';
import UserReview from '@/components/User/review.vue';
import BrowseReview from '@/components/User/BrowseReview.vue'; // 새 리뷰 페이지 임포트
import Reset_IDnPW from '@/views/Reset_IDnPW.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView
  },
  {
    path: '/business',
    name: 'Business',
    component: BusinessView
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: AdminView
  },
  {
    path: '/order',
    name: 'Order',
    component: OrderView
  },
  {
    path: '/business_information',
    name: 'BusinessInformation',
    component: BusinessInformation
  },
  {
    path: '/business_menu',
    name: 'BusinessMenu',
    component: BusinessMenu
  },
  {
    path: '/business_advertisement',
    name: 'BusinessAdvertisement',
    component: BusinessAdvertisement
  },
  // 관리자 관련 라우트들
  {
    path: '/admin/order-management',
    name: 'AdminOrderManagement',
    component: AdminOrderManagement
  },
  {
    path: '/admin/review-management',
    name: 'AdminReviewManagement',  // 수정된 부분
    component: AdminReviewManagement  // 수정된 부분
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
    path: '/making_order',
    name: 'MakingOrder',
    component: MakingOrderView
  },
  {
    path: '/store_information',
    name: 'StoreInformation',
    component: StoreInformation
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
  {
    path: '/browse-review/:storeUid',
    name: 'BrowseReview',
    component: BrowseReview,
    props: true,
  },
  {
    path: '/Reset_IDnPW',
    name: 'Reset_IDnPW',
    component: Reset_IDnPW
},

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
