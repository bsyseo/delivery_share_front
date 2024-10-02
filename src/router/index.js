import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Login.vue'
import SignUpView from '@/views/SignUp.vue'
import MapView from '@/views/map.vue'
import ResetPasswordView from '@/views/ResetPassword.vue'

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
    path: '/reset-password',
    name : 'ResetPassword',
    component: ResetPasswordView 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
