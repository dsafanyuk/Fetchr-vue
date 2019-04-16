/* eslint-disable no-use-before-define */
import Vue from 'vue';
import Router from 'vue-router';

import browserCookies from 'browser-cookies';
import store from './store';
import axios from './axios';

import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import NotFoundComponent from './components/NotFoundComponent.vue';
import NiceTry from './components/NiceTry.vue';

/*                 Main                */
import MainLayout from './views/MainDashboard/MainLayout.vue';
import Dashboard from './views/MainDashboard/components/Landing.vue';
import Orders from './views/MainDashboard/components/Orders.vue';
import Checkout from './views/MainDashboard/components/Checkout.vue';
import Confirmation from './views/MainDashboard/components/Confirmation.vue';
import View from './views/MainDashboard/components/ViewOrder.vue';
import Account from './views/MainDashboard/components/Account.vue';

/*                 Courier                */
import CourierLayout from './views/CourierDashboard/CourierLayout.vue';

/*                 ADMIN                */
import AdminLayout from './views/AdminDashboard/AdminLayout.vue';
import AdminDashboard from './views/AdminDashboard/components/AdminDashboard.vue';
import AdminManageUsers from './views/AdminDashboard/components/AdminManageUsers.vue';
import AdminManageProducts from './views/AdminDashboard/components/AdminManageProducts.vue';

Vue.use(Router);

// Check if the user is logged in & cookies have not expired
function requireLoggedOut(to, from, next) {
  if (
    store.getters['login/isLoggedIn']
    && browserCookies.get('token')
    && browserCookies.get('user_id')
  ) {
    next({ path: '/dashboard' });
  } else {
    next();
  }
}

// Check if the user is authenticated or not
function requireAuth(to, from, next) {
  if (store.getters['login/getUserLoadStatus'] !== 2) {
    // User not loaded
    store.commit('login/pending');

    // Watch user to be loaded
    store.watch(
      () => store.getters['login/getUserLoadStatus'],
      () => {
        if (store.getters['login/getUserLoadStatus'] === 2) {
          proceed(next);
        }
      },
    );
  } else {
    proceed(next);
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/admin',
      component: () => import(/* webpackChunkName: "admin" */ AdminLayout),
      beforeEnter: (to, from, next) => {
        axios
          .get('api/admin/verify')
          .then((response) => {
            if (response.status === 200) {
              next();
            } else {
              next({ path: '/nicetry' });
            }
          })
          .catch(() => {
            next({ path: '/nicetry' });
          });
      },
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "admin" */ AdminDashboard),
          beforeEnter: requireAuth,
        },
        {
          path: 'users/manage',
          component: () => import(/* webpackChunkName: "admin" */ AdminManageUsers),
          beforeEnter: requireAuth,
        },
        {
          path: 'products/manage',
          component: () => import(/* webpackChunkName: "admin" */ AdminManageProducts),
          beforeEnter: requireAuth,
        },
      ],
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "main" */ MainLayout),
      beforeEnter: (to, from, next) => {
        if (to.path === '/') {
          next({ path: '/home' });
        } else {
          next();
        }
      },
      children: [
        {
          path: '/account',
          component: () => import(/* webpackChunkName: "main" */ Account),
          beforeEnter: requireAuth,
        },
        {
          path: '/orders',
          component: () => import(/* webpackChunkName: "main" */ Orders),
          beforeEnter: requireAuth,
        },
        {
          path: '/dashboard',
          component: () => import(/* webpackChunkName: "main" */ Dashboard),
          beforeEnter: requireAuth,
        },
        {
          path: '/confirmation',
          component: () => import(/* webpackChunkName: "main" */ Confirmation),
          beforeEnter: requireAuth,
        },
        {
          path: '/checkout',
          component: () => import(/* webpackChunkName: "main" */ Checkout),
          beforeEnter: requireAuth,
        },
        {
          path: '/view',
          component: () => import(/* webpackChunkName: "main" */ View),
          beforeEnter: requireAuth,
        },
      ],
    },
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/login',
      component: Login,
      beforeEnter: requireLoggedOut,
    },
    {
      path: '/register',
      component: Register,
      beforeEnter: requireLoggedOut,
    },
    {
      path: '/courier',
      component: () => import(/* webpackChunkName: "main" */ CourierLayout),
      beforeEnter: requireAuth,
    },
    { path: '/nicetry', component: NiceTry, beforeEnter: requireAuth },
    { path: '*', component: NotFoundComponent },
  ],
  // On new route load, scroll to top
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

// Determines where we should redirect the user
function proceed(next) {
  // Check load status
  if (store.getters['login/getUserLoadStatus'] === 2) {
    // Check if the user is logged in & cookies have not expired
    if (
      store.getters['login/isLoggedIn']
      && browserCookies.get('token')
      && browserCookies.get('user_id')
    ) {
      // Clear search bar
      store.commit('dashboard/setSearchTerm', '');
      next();
    } else {
      next({ path: '/login' });
    }
  }
}
