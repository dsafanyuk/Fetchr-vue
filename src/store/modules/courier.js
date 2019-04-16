/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import axios from '../../axios';
import router from '../../router';

const state = {
  availableOrders: [],
  acceptedOrders: [],
  deliveredOrders: [],
  isLoading: true,
  deliveredRevenueSum: 0,
};
const mutations = {
  addAvailableOrder: (state, data) => {
    state.availableOrders.push(data);
  },
  addAcceptedOrder: (state, data) => {
    state.acceptedOrders.push(data);
  },
  addDeliveredOrder: (state, data) => {
    state.deliveredOrders.push(data);
  },
  clearAvailableOrder: (state) => {
    state.availableOrders = [];
  },
  clearAcceptedOrder: (state) => {
    state.acceptedOrders = [];
  },
  clearDeliveredOrder: (state) => {
    state.deliveredOrders = [];
  },
  stopLoading: (state) => {
    state.isLoading = false;
  },
  startLoading: (state) => {
    state.isLoading = true;
  },
  updateDeliveredRevenue: (state, value) => {
    state.deliveredRevenueSum = value;
  },
};
const getters = {
  availableOrders: state => state.availableOrders,
  acceptedOrders: state => state.acceptedOrders,
  deliveredOrders: state => state.deliveredOrders,
  isLoading: state => state.isLoading,
  getDeliveredRevenueSum: state => state.deliveredRevenueSum,
};
const actions = {
  clearAllOrders: ({ commit }) => new Promise((resolve) => {
    commit('clearAvailableOrder');
    commit('clearAcceptedOrder');
    commit('clearDeliveredOrder');
    resolve();
  }),
  refreshAllOrders: ({ dispatch }) => {
    dispatch('getAvailableOrders');
    dispatch('getAcceptedOrders');
    dispatch('getDeliveredOrders');
  },
  getAvailableOrders: ({ commit, rootGetters }) => {
    const user = rootGetters['login/getUserId'];
    axios
      .get(`/api/courier/${user}/order/available`)
      .then((response) => {
        response.data.forEach((order) => {
          commit('addAvailableOrder', order);
        });

        commit('stopLoading');
      })
      .catch((error) => {
        console.log(error);
      });
  },
  getAcceptedOrders: ({ commit, rootGetters }) => {
    const user = rootGetters['login/getUserId'];

    axios
      .get(`/api/courier/${user}/order/accepted`)
      .then((response) => {
        response.data.forEach((order) => {
          commit('addAcceptedOrder', order);
        });

        commit('stopLoading');
      })
      .catch(error => console.log(error));
  },
  getDeliveredOrders: ({ commit, rootGetters }) => {
    const user = rootGetters['login/getUserId'];

    axios
      .get(`/api/courier/${user}/order/delivered`)
      .then((response) => {
        response.data.forEach((order) => {
          commit('addDeliveredOrder', order);
        });

        commit('stopLoading');
      })
      .catch((error) => {
        console.log(error);
      });
  },
  socket_updateOpenOrders: ({ dispatch }) => {
    if (router.history.current.fullPath === '/courier') {
      dispatch('clearAllOrders').then(() => {
        dispatch('refreshAllOrders');
      });
    }
  },
  socket_updateAcceptedOrders: ({ dispatch }, data) => {
    const notifyData = data;

    dispatch('notification/NOTIFY_ACCEPTED', notifyData, { root: true });
    console.log('EVENT RECEIVED: UPDATE_ACCEPTED_ORDERS');
    if (router.history.current.fullPath === '/courier') {
      dispatch('clearAllOrders').then(() => {
        dispatch('refreshAllOrders');
      });
    }
  },
  socket_updateDeliveredOrders: ({ dispatch }, data) => {
    const notifyData = data;
    dispatch('notification/NOTIFY_DELIVERED', notifyData, { root: true });
    console.log('EVENT RECEIVED: UPDATE_DELIVERED_ORDERS');
    if (router.history.current.fullPath === '/courier') {
      dispatch('clearAllOrders').then(() => {
        dispatch('refreshAllOrders');
      });
    }
  },
  updateDeliveredRevenue: ({ commit, rootGetters }) => {
    const user = rootGetters['login/getUserId'];

    axios.get(`/api/courier/${user}/getRevenue`).then((response) => {
      commit('updateDeliveredRevenue', response.data[0][0].revenue);
    });
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
