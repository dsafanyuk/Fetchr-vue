/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import axios from '../../axios';

const state = {
  orderStatus: '',
  courierInfo: false,
  order: '',
};
const mutations = {
  changeStatus: (state, status) => {
    state.orderStatus = status;
  },
  changeInfo: (state, info) => {
    state.courierInfo = info;
  },
  changeOrder: (state, order) => {
    state.order = order;
  },
};

const getters = {
  status: state => state.orderStatus,
  info: state => state.courierInfo,
  order: state => state.order,
};

const actions = {
  getStatus({ commit }, message) {
    axios.get(`/api/orders/${message.order}/summary`).then((response) => {
      commit('changeStatus', response.data.orderInfo[0].delivery_status);
    });
  },
  getInfo({ commit }, order) {
    axios.get(`/api/courier/${order}/courierInfo`).then((info) => {
      if (info.data[0].length === 0) {
        commit('changeInfo', false);
      } else {
        const courierInfo = info.data[0][0];
        axios.get(`/api/courier/${courierInfo.courier_id}/getTotalDelivered`).then((delivered) => {
          const { phone_number } = courierInfo;
          courierInfo.delivered = delivered.data[0][0].count_d;
          courierInfo.phone_number = `(${phone_number.substring(0, 3)}) ${phone_number.substring(
            3,
            6,
          )}-${phone_number.substring(6)}`;
          commit('changeInfo', courierInfo);
        });
      }
    });
  },
  socket_updateAcceptedOrders: ({ getters, dispatch }, data) => {
    const notifyData = data;
    const { order } = getters;
    if (order === notifyData.order) {
      dispatch('orders/getStatus', notifyData, { root: true });
      dispatch('orders/getInfo', notifyData.order, { root: true });
    }
  },
  socket_updateDeliveredOrders: ({ getters, dispatch }, data) => {
    const notifyData = data;
    const { order } = getters;
    if (order === notifyData.order) {
      dispatch('orders/getStatus', notifyData, { root: true });
      dispatch('orders/getInfo', notifyData.order, { root: true });
    }
  },
};

export default {
  namespaced: true,
  mutations,
  getters,
  state,
  actions,
};
