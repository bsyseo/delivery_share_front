import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Login.vue'
import SignUpView from '@/views/SignUp.vue'
import MapView from '@/views/map.vue'
import ResetPasswordView from '@/views/Reset_IDnPW.vue'
import ResetPasswordComponent from '@/components/ResetPasswordComponent.vue'

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
    path: '/Reset_IDnPW',
    name : 'Reset_IDnPW',
    component: ResetPasswordView 
  },
  {
    path: '/Reset_PW',
    name: 'ResetPasswordComponent',
    component: ResetPasswordComponent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
