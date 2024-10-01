import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/components/Login.vue'
import SignUpComponent from '@/components/SignUp.vue'
import MapComponent from '@/components/map.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
