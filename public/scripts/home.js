function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


document.addEventListener("DOMContentLoaded", init, false);

async function init() {
    if ("serviceWorker" in navigator) {
        const register = await navigator.serviceWorker.register("/service-worker.js")

        sendSubscribeObj(register)
    }
}

// Register SW, Register Push, Send Push
async function sendSubscribeObj(register) {
    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BIMrqDJY6tx0vvHtO4SW2BVM2k4d4Zzf0UGPKhbs2_cQ7MRr_7-7ZGwO1GeIE9utNlaG4MRyXtLhpVEfqSJpahs")
    });
    console.log("Push Registered...");

    // Send Push Notification
    console.log("Sending Push...");
    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json"
        }
    });
    console.log("Push Sent...");
}