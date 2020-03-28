if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      console.log('Service worker has been registered')
    })
    .catch(err => {
      console.log('Service worker has failed to register')
    })
}