import React from "react"
import { useEffect } from "react";

export default function Sidebar(props) {
    //  FUNCTIONS
    // Function for delete button of note item
    function handleDelete(event, id){
        event.stopPropagation();
        props.setPopup(prev => ({
          ...prev,
          trigger:true,
          title:"Are you sure you want to delete this note!",
          hasBtns: true,
          confirmDelete: function(){ // passing function for the Confirm Btn
            // note.id represent the note if of note contains the button
            props.deleteNote(id);
          }
      }))
    }
    // Function for edit button
    function handleEdit(event, id){
        if (event) event.stopPropagation();
        // Unlock input and focused into
        const input = document.querySelector(`#sidebar__notelist-input-${id}`);
        if (input) {
          input.classList.remove("input-pointer-none");
          input.focus();
        }
    }
    function handleTitleChange(input){
      // Get the note of that input
      const note = props.findNote(
        input.id.replace("sidebar__notelist-input-", "")
      );
      // IF: input.value==="" -> keep the old note
      // ELSE: save the new title
      if (input.value==="") {
        input.value = note.title;
        props.setPopup({
          trigger:true,
          title:"Name of a note can't be empty!",
          hasBtns:false
        })
      }
      else if (input.value!==note.title) {
        note.title = input.value;
        props.updateNote(note.id, {
          body: note.body,
          title: input.value.trim(),
        });
      }
      // Lose focus of the input 
      input.blur();
      input.classList.add("input-pointer-none");
    }
    useEffect(() => {
      // Set seperate value for input field
      const inputs = document.querySelectorAll(
        `.sidebar__notelist-input`
      );
      if (inputs) inputs.forEach((input,index) => {input.value=props.notes[index].title});

      // Enter handling for input field element
      function handleEnter(event){
        if (event.keyCode === 13 && document.activeElement.tagName==='INPUT') {
          handleTitleChange(document.activeElement);
        }
      }
      document.addEventListener('keydown', handleEnter);
      return function(){
        document.removeEventListener('keydown', handleEnter);
      }
    },[props.notes])


    // Listing by map
    const renderedNotes = props.notes.map((note, index) => (
      <li
        key={note.id}
        title={note.title}
        onClick={() => {
          // when note is clicked, set current Id to it's id
          props.setCurrId(note.id);
        }}
        // Css the selected note
        className={`sidebar__notelist-note p-2 btn w-100 text-start mb-1 d-flex
          ${note.id === props.currId ? "btn-success" : "btn-outline-success"} 
        `}
      >
        <input
          type="text"
          id={`sidebar__notelist-input-${note.id}`}
          className={`sidebar__notelist-input input-pointer-none
                ${note.id === props.currId && "is-selected"} 
            `}
          onBlur={(event) => handleTitleChange(event.target)}
        ></input>
        {/* Edit Button */}
        <button
          className="sidebar__notelist-btn ms-auto"
          onClick={(event) => handleEdit(event, note.id)}
          title="Edit name"
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        {/* Delete Button */}
        <button
          className="sidebar__notelist-btn ms-1"
          key={note.id}
          onClick={(event) => handleDelete(event, note.id)}
          title="Delete note"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </li>
    )); 
    return (
      <div className="sidebar px-2" id="sidebar">
        <header className="sidebar__header d-flex justify-content-between align-items-center border-bottom border-success border-1 overflow-hidden">
          {/* <h3 className="sidebar__title my-0">Notes</h3> */}
          <img
            className="sidebar__title"
            src={process.env.PUBLIC_URL + "/coconotesIcon.png"}
            alt=""
          />
          <button
            className="sidebar__btn btn btn-success h-50"
            onClick={props.addNote}
            title="Add a note"
          >
            +
          </button>
        </header>
        <ul className="sidebar__notelist list-unstyled">{renderedNotes}</ul>
      </div>
    );
}