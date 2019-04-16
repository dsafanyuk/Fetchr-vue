import axios from '../../axios';

const browserCookies = require('browser-cookies');

const user = browserCookies.get('user_id');

const actions = {
  editExistingUser: data => axios.put(`/api/users/${user}}`, data),
};

export default {
  namespaced: true,
  actions,
};
