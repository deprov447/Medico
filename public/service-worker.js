importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.routing.registerRoute(
    ({ register }) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
);

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push Recieved...a");
    self.registration.showNotification(data.title, {
        body: "Notified by Traversy Media!",
        icon: "http://image.ibb.co/frYOFd/tmlogo.png"
    });
});