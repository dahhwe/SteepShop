importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAu81G9VUwuwUPycLPzx1OPBexgTeGct_4",
    authDomain: "mystic-aileron-417516.firebaseapp.com",
    databaseURL: "https://mystic-aileron-417516-default-rtdb.firebaseio.com",
    projectId: "mystic-aileron-417516",
    storageBucket: "mystic-aileron-417516.appspot.com",
    messagingSenderId: "474646950123",
    appId: "1:474646950123:web:14109f507093e650e64eae",
    measurementId: "G-95GVZ671YG"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});