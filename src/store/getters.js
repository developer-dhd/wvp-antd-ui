const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  multiTab: state => state.app.multiTab,
  userInfo: state => state.user.info
}

export default getters
