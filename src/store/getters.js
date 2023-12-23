const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  notice: state => state.user.notice,
  logoPath: state => state.user.logoPath,
  name: state => state.user.name
}
export default getters
