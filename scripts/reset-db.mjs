import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, writeBatch, setDoc } from 'firebase/firestore'

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

const collections = ['expenses', 'milestones', 'fixedExpenses', 'emergencyFund']

for (const name of collections) {
  const snap = await getDocs(collection(db, name))
  const batch = writeBatch(db)
  snap.docs.forEach(d => batch.delete(d.ref))
  await batch.commit()
  console.log(`Cleared ${name}: ${snap.size} documents`)
}

const balanceRef = doc(db, 'balance', 'main')
await setDoc(balanceRef, {
  total: 228.15,
  emergencyFund: 0,
  lastProcessedWeek: '2026-07-06',
  reconciled: true,
})
console.log('Balance set to 228.15')

console.log('Database reset complete.')
process.exit(0)
