
addEventListener('message', (event) => {
    // event は ExtendableMessageEvent オブジェクトです
    self.registration.showNotification(event.data, {
      icon: '/img/icon.jpg'
    })
  });
  