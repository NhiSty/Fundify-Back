import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import DashboardView from '../views/DashboardView.vue';
import AdminView from '../views/AdminView.vue';
import LoginView from '../views/LoginView.vue';
import MerchantLoginView from '../views/MerchantLoginView.vue';
import MerchantRegisterView from '../views/MerchantRegisterView.vue';
import ListingTransactionView from '../views/ListingTransactionView.vue';
import TransactionDetails from '../views/TransactionDetails.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/admin/login',
      name: 'admin login',
      component: LoginView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    {
      path: '/listing-transaction',
      name: 'listing-transaction',
      component: ListingTransactionView,
    },
    {
      path: '/listing-transaction/:id',
      name: 'transaction-details',
      component: TransactionDetails,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/login',
      name: 'login',
      component: MerchantLoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: MerchantRegisterView,
    },
  ],
});

export default router;
