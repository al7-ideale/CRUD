// Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDxxCn0yAoQXGUYy4MvmWRz9W2vyACE-KQ",
  authDomain: "fir-crud-22c85.firebaseapp.com",
  projectId: "fir-crud-22c85",
  storageBucket: "fir-crud-22c85.firebasestorage.app",
  messagingSenderId: "509709059290",
  appId: "1:509709059290:web:cc6597534949d833e311e3"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// --------------------
// REGISTER
// --------------------

document.getElementById("registerBtn").onclick = async function () {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await auth.createUserWithEmailAndPassword(email, password);

    alert("Registered!");
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};


// --------------------
// LOGIN
// --------------------

document.getElementById("loginBtn").onclick = async function () {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await auth.signInWithEmailAndPassword(email, password);

    alert("Logged in!");
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};


// --------------------
// LOGOUT
// --------------------

document.getElementById("logoutBtn").onclick = async function () {
  try {
    await auth.signOut();

    alert("Logged out!");
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};


// --------------------
// CREATE
// --------------------

document.getElementById("createBtn").onclick = async function () {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("Login first!");
      return;
    }

    const note = document.getElementById("note").value;

    await db
      .collection("users")
      .doc(user.uid)
      .collection("notes")
      .add({
        text: note
      });

    alert("Note created!");

    document.getElementById("note").value = "";

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};


// --------------------
// READ
// --------------------

document.getElementById("readBtn").onclick = async function () {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("Login first!");
      return;
    }

    const snapshot = await db
      .collection("users")
      .doc(user.uid)
      .collection("notes")
      .get();

    const list = document.getElementById("list");

    list.innerHTML = "";

    snapshot.forEach(function (doc) {

      const data = doc.data();

      list.innerHTML += `
        <div class="note">
          <span>${data.text}</span>

          <button onclick="updateNote('${doc.id}')">
            Update
          </button>

          <button onclick="deleteNote('${doc.id}')">
            Delete
          </button>
        </div>
      `;

    });

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};


// --------------------
// UPDATE
// --------------------

async function updateNote(id) {
  try {
    const user = auth.currentUser;

    const newText = prompt("Enter new note:");

    if (!newText) {
      return;
    }

    await db
      .collection("users")
      .doc(user.uid)
      .collection("notes")
      .doc(id)
      .update({
        text: newText
      });

    alert("Updated!");

    document.getElementById("readBtn").click();

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}


// --------------------
// DELETE
// --------------------

async function deleteNote(id) {
  try {
    const user = auth.currentUser;

    await db
      .collection("users")
      .doc(user.uid)
      .collection("notes")
      .doc(id)
      .delete();

    alert("Deleted!");

    document.getElementById("readBtn").click();

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}