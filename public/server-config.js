if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/server-config.js',{
        scope:"http://localhost:3000/"
    })
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function(error) {
      console.log('Service worker registration failed, error:', error);
    });
}