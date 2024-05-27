// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const messageList = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const userInfo = document.getElementById('user-info');

// Sign in anonymously
auth.signInAnonymously().catch(error => {
    console.error('Authentication error:', error);
});

// Display user info
auth.onAuthStateChanged(user => {
    if (user) {
        userInfo.textContent = `Logged in as: ${user.uid}`;
    } else {
        userInfo.textContent = 'Not logged in';
    }
});

// Listen for messages
db.collection('messages').orderBy('timestamp')
    .onSnapshot(snapshot => {
        messageList.innerHTML = '';
        snapshot.forEach(doc => {
            const message = doc.data();
            const li = document.createElement('li');
            li.textContent = `${message.user}: ${message.text}`;
            messageList.appendChild(li);
        });
    });

// Handle form submission
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user && messageInput.value.trim()) {
        db.collection('messages').add({
            text: messageInput.value.trim(),
            user: user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = '';
    }
});
