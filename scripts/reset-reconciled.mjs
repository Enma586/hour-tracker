import { initializeApp } from 'firebase/app'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDMORdJH_GRhnvoQk0XBk1o1FLv-hXW90I",
  authDomain: "tracker-50782.firebaseapp.com",
  projectId: "tracker-50782",
  storageBucket: "tracker-50782.firebasestorage.app",
  messagingSenderId: "940822061060",
  appId: "1:940822061060:web:d712b49b3d1af8618f1551"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const ref = doc(db, 'balance', 'main')

await updateDoc(ref, { reconciled: false })
console.log('reconciled reset to false. Reload the app to trigger reconciliation.')
process.exit(0)
