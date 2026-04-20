const REACT_APP_ENV_MODE = 'development'
let fileUrl = REACT_APP_ENV_MODE == 'development' ? process.env.REACT_APP_MEDIA_URL : REACT_APP_ENV_MODE == 'production' ? process.env.REACT_APP_MEDIA_URL : REACT_APP_ENV_MODE == 'stag' ? process.env.REACT_APP_MEDIA_URL : undefined

export {fileUrl};
