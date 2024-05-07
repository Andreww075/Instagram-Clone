import { app } from "@/firebase"
import { getFirestore, query, collection, orderBy, getDocs } from "firebase/firestore"
import Post from "./post";

export default async function Posts() {
  const db = getFirestore(app);
  const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);

  let data = [];

  querySnapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() })
  });

  console.log(data)

  return <div>
    {
      data.map((post) => (
        <Post key={post.id} post={post} />
      ))
    }
  </div>
}
