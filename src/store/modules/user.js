import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    logoPath: '',
    notice: '',
    name: "中国神华煤制油化工有限公司上海研究院"
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_LOGO_PATH: (state, logoPath) => {
    state.logoPath = logoPath
  },
  SET_NOTICE: (state, notice) => {
    state.notice = notice
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password,sessionUUID,imageCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), password: password,sessionUUID:sessionUUID,imageCode:imageCode }).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { notice, logoPath } = data

        commit('SET_LOGO_PATH', logoPath)
        commit('SET_NOTICE', notice)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

