importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
);

const notify = (data) => {
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icons/manifest-icon-512.maskable.png"
    })
}

self.addEventListener("push", e => {
    const data = e.data.json();
    // TODO: Clear timeouts
    if (data.period !== "") {
        console.log(`Push Recieved... Scheduled every ${data.period} hours`);

        const date = new Date();
        const [month, day, year, hour] = [date.getMonth(), date.getDate(), date.getFullYear(), date.getHours()];

        function nextMultiple(num, from) {
            var res = 0;
            while (res <= from) {
                res += num;
            }
            return res;
        }

        const nextMed = new Date(year, month, day, nextMultiple(period, hour) % 24, 0, 0)
        const remaining = nextMed.getTime() - date.getTime() - 5 * 60 * 1000

        setTimeout(() => {
            notify(data)
            setInterval(() => {
                notify(data)
            }, data.period * 60 * 60 * 1000)
        }, remaining)
    }
    else {
        notify(data)
    }
});

