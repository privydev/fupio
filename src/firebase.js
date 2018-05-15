import firebase from 'firebase'

//const firebase = window.firebase

// import * as firebase from 'firebase/app'
// import 'firebase/database'
// import 'firebase/auth'
// import 'firebase/storage'
const config = {
    apiKey: "AIzaSyCKDWMuO0uUILkgQ8vUf_qd0SJ35yZkTV4",
    authDomain: "fupio-com.firebaseapp.com",
    databaseURL: "https://fupio-com.firebaseio.com",
    projectId: "fupio-com",
    storageBucket: "fupio-com.appspot.com",
    messagingSenderId: "90940714363"
}
firebase.initializeApp(config)

export default firebase

export const defaultDatabase = firebase.database()
export const auth = firebase.auth()
