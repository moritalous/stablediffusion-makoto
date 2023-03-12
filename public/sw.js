
addEventListener('message', (event) => {
    // event は ExtendableMessageEvent オブジェクトです
    self.registration.showNotification(event.data, {
      icon: '/logo192.png'
    })
  });
  