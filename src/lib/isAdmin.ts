import { firestore } from "./database";

function isAdmin(uid:string) {
    firestore.collection("users").doc(uid).get().then(user => {
       if (user.exists) {
           return !!user.data()!.administrator;
       }
    });
}

export default isAdmin;