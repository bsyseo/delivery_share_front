import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/components/Login.vue'
import SignUpComponent from '@/components/SignUp.vue'
import MapComponent from '@/components/map.vue'
import ResetPasswordComponent from '@/components/ResetPassword.vue' //추가한 부분


const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpComponent
  },
  {
    path: '/map',
    name: 'map',
    component: MapComponent
  },
  { 
    path: '/reset-password',
    name : 'ResetPassword',
    component: ResetPasswordComponent 
  } //추가한 부분
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
