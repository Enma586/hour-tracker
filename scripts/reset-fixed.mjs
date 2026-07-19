import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, writeBatch, getDoc, setDoc } from 'firebase/firestore'

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

const snap = await getDocs(collection(db, 'fixedExpenses'))
const totalSpent = snap.docs.reduce((sum, d) => sum + ((d.data().spentAmount ?? 0)), 0)

const batch = writeBatch(db)
snap.docs.forEach(d => batch.delete(d.ref))
await batch.commit()
console.log(`Cleared ${snap.size} fixed expenses (total spent: ${totalSpent})`)

const balanceRef = doc(db, 'balance', 'main')
const balanceSnap = await getDoc(balanceRef)
const currentTotal = balanceSnap.data()?.total ?? 0
await setDoc(balanceRef, {
  total: currentTotal + totalSpent,
  emergencyFund: balanceSnap.data()?.emergencyFund ?? 0,
  lastProcessedWeek: balanceSnap.data()?.lastProcessedWeek ?? '',
  reconciled: true,
}, { merge: true })

console.log(`Balance restored: ${currentTotal} + ${totalSpent} = ${currentTotal + totalSpent}`)
console.log('Fixed expenses reset complete.')
process.exit(0)
