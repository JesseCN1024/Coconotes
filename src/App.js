import React, {useState, useEffect, useRef} from "react"
import './App.css'  ;
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor";
import Viewer from "./components/Viewer"
import Popup from './components/Popup'
import Toast from "./components/Toast"
import {nanoid} from "nanoid" // generate randomID
// Listen for changes in the db then make the local storage act accordingly to 
import { onSnapshot, addDoc, setDoc, doc, deleteDoc, collection } from "firebase/firestore";
import { notesCollection, db } from "./firebase";
import {debounce} from "./utils"


function App() {
  // Get notes from local that is parsed, if doesn't exist -> []
  const [notes, setNotes] = useState([]); 
  const [currId, setCurrId] = useState("");
  const [popup,setPopup] = useState({
    trigger: false, title: "", hasBtns:false
  });
  const [toast,setToast] = useState({
    trigger:false, title:"", isHanging: false
  });
  const [tempNoteText, setTempNoteText] = React.useState("")
  const [viewerOn, setViewerOn] = useState(true);

  async function addNote(){
    const note = {
      body: "" ,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    // Customize new note title
    let maxNum = 0;
    notes.forEach((note) => {
      if (note.title.slice(0,-2)==="New Note" && note.title.length===10){
        const num = parseInt(note.title.slice(9)) || 0;
        maxNum = Math.max(maxNum, num);
      }
    })
    note.title=`New Note ${maxNum+1}`; // add title -> a note has 3 props
    // Add new note to firebase
    const newNoteRef = await addDoc(notesCollection,note);
    setCurrId(newNoteRef.id); 
  }
  async function updateNote(id, updatedProps) {
    const docRef = doc(db, "notes", id);
    const note = findNote(id);
    // merge: true- merge the simplied project into the existing project
    await setDoc(docRef, {
      ...note,
      updatedAt: Date.now(),
      ...updatedProps
    }, 
    {merge: true})
  }
  async function deleteNote(id){
    // doc similar to reference to a single doc
    // notes: name of collection trying to delete from
    // The docRef variable gets a reference to the note document with the given id in the "notes" collection in the db database.
    // The deleteDoc function then deletes that document from the database.
    const docRef = doc(db, "notes", id);
    await deleteDoc(docRef);
  }  
  function findNote(id){
    return notes.find(note => note.id===id) || notes[0];
  }
  useEffect(function() {
    // ------ onSnapshot Section --------
    // (collection to listen to, function to triggered when ever there is change)
    const unsubscribe = onSnapshot(notesCollection, function(snapshot){
      // Sync up our local notes arry with snapshot data
      // - snapshot: the newest data that is captured
      const notesArr = snapshot.docs.map(doc => ({ 
        // get the noteArr from the doc of snapshot
        ...doc.data(),
        id: doc.id // firestore has it's data have its own id
      }))
      notesArr.sort((a,b) => b.updatedAt - a.updatedAt);
      setNotes(notesArr); // notes is overrided directly from the db 
    })
    return unsubscribe; // clean up the listener
  },[])

  useEffect(function() {
    // currID===deletedNoteID: is not found in the array -> set the first one
    if (!notes.find((note) => currId === note.id)) {
      setCurrId(notes[0] ? notes[0].id : "");
    }
    // currID===undefined
    if (!currId) {
      setCurrId(notes[0] ? notes[0].id : "");
    }
  },[notes])
  
  useEffect(function() {
    // Update the temp text
    setTempNoteText(findNote(currId)?.body || "");
    return () => {
      // When changing tempTxt and suddenly change currId without waiing for debounce
      // -> update immediately
      const currentNote = findNote(currId);
      const text = document.querySelector('textarea')?.value;
      if (currentNote && text && text!==currentNote.body) {
        console.log('deleted')
        updateNote(currId,{
          body: text,
          // updatedAt: currentNote.updatedAt
        })
      }
    };
  }, [currId])

  useEffect(function(){ // debounce to update the body of note to fireBase
    let timeoutId;
    const currentNote = findNote(currId);
    if (currentNote){
      // This runs for both case: wait and changing currId
      const {body, title} = currentNote;
      timeoutId = setTimeout(() => { 
        // This if only run for the first case: changing notes and wait
        if (tempNoteText!==body){ 
          updateNote(currId, {
            title: title,
            body: tempNoteText
          })
        }
        // Update finishied and hide spinner
        document.querySelector(".editor__saving")?.classList.add("d-none");
      }, 500)
    }
    return () => {
      // If there is timeout -> show spinner
      if (timeoutId){
        document.querySelector('.editor__saving')?.classList.remove('d-none');
      }
      clearTimeout(timeoutId);
    }
  }, [tempNoteText])
  
  return (
    <main className="h-100 overflow-hidden">
      <div className="row">
        <div className="col-2 bg-platform">
          <Sidebar
            notes={notes}
            currId={currId}
            addNote={addNote}
            setCurrId={setCurrId}
            deleteNote={deleteNote}
            setPopup={setPopup}
            updateNote={updateNote}
            findNote={findNote}
          />
        </div>
        <div className="col-5 bg-platform">
          <Editor
            currId={currId}
            currNote={findNote(currId)}
            updateNote={updateNote}
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
            toast={toast}
            setToast={setToast}
            viewerOn={viewerOn}
            setViewerOn={setViewerOn}
          />
        </div>
        <div className="col-5 boundary-left">
          <Viewer 
            tempNoteText={tempNoteText}
            viewerOn={viewerOn}
          />
        </div>
      </div>

      {/*Popup Section  */}
      { popup.trigger && 
        <Popup popup={popup} setPopup={setPopup}></Popup>
      }
      {/* Toasting Section */}
      { toast.trigger && 
        <Toast toast={toast} setToast={setToast}/>
      }
    </main>
  );
  
}

export default App;
// Added comment