import noteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  //----Get All notes------------------------------------------
  const getNotes = async () => {
    //API Call

    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjIwODI3YzIyOGRlMTk2ZjljYmU5NTZjIiwiaWF0IjoxNjQ0NzAxNjM0fQ.obsdinyoe5SI2BKwkpU6JAVecCcHdgU-0fSzaJ25q8c",
      },
    });
    const temp = await response.json();

    console.log(temp);
    setNotes(temp);
  };

  //----Add a note-------------------------------------------------
  const addNote = async (title, description, tag) => {
    
    //API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjIwODI3YzIyOGRlMTk2ZjljYmU5NTZjIiwiaWF0IjoxNjQ0NzAxNjM0fQ.obsdinyoe5SI2BKwkpU6JAVecCcHdgU-0fSzaJ25q8c",
      },

      body: JSON.stringify({ title, description, tag })
    });
    const temp = response.json();
    //console.log(temp);

    console.log("Adding a new note.");
    let note = {
      _id: "620828f950c0ea392ec9db40",
      title: title,
      description: description,
      tag: tag,
      date: "2022-02-12T21:39:05.348Z",
      __v: 0,
    };
    setNotes(notes.concat(note));
  };

  //-------Delete a note-------------------------------------------------
  const deleteNote = async(id) => {
    //console.log("Deleting note with id: " + id);
    //API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authtoken":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjIwODI3YzIyOGRlMTk2ZjljYmU5NTZjIiwiaWF0IjoxNjQ0NzAxNjM0fQ.obsdinyoe5SI2BKwkpU6JAVecCcHdgU-0fSzaJ25q8c",
      },

    });
    const json = response.json();

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  //--------Edit a note---------------------------------------------------
  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjIwODI3YzIyOGRlMTk2ZjljYmU5NTZjIiwiaWF0IjoxNjQ0NzAxNjM0fQ.obsdinyoe5SI2BKwkpU6JAVecCcHdgU-0fSzaJ25q8c",
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const json = response.json();

    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
      }
    }
  };
  return (
    <noteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes  }}
    >
      {props.children}
    </noteContext.Provider>
  );
};
export default NoteState;
