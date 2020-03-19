// Creating a note
const notesList = document.querySelector("#notes-list");
const noteForm = document.querySelector("#create-note");
const noteTitle = document.querySelector("#note-title");
const subject = document.querySelector("#subject");
const note = document.querySelector("#note-text");

function createNoteHtml(title, subject, description) {
  const noteHtml = `<li class="list-group-item">
        <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <span class="badge badge-pill badge-primary"
          >${subject}</span
        >
        <p class="card-text">
          ${description}
        </p>
      </div>
    </li>`;

  return noteHtml;
}

noteForm.addEventListener("submit", async e => {
  e.preventDefault();

  const reqBody = {
    title: noteTitle.value,
    subject: subject.value,
    description: note.value
  };

  try {
    const newNote = await fetch(`/data/note/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    });

    const data = await newNote.json();
    const currentNoteType = notesList.getAttribute("data-note-type");

    if (currentNoteType === "all" || currentNoteType === subject.value) {
      console.log(data);
      const { title, subject, description } = data.note;
      const noteHtml = createNoteHtml(title, subject, description);
      notesList.innerHTML = noteHtml + notesList.innerHTML;
    }

    noteTitle.value = "";
    subject.value = "";
    note.value = "";
  } catch (err) {
    console.error(err);
  }
});

// Viewing all | stem | humanities notes

const allNotesBtn = document.querySelector("#all-notes");
const stemNotesBtn = document.querySelector("#stem-notes");
const humanitiesNotesBtn = document.querySelector("#humanities-notes");

const NOTE_TYPES = {
  ALL: "all",
  STEM: "stem",
  HUMANITIES: "humanities"
};

async function viewNotes(type) {
  try {
    const notes = await fetch(`/data/notes/${type}`);
    const data = await notes.json();
    notesList.innerHTML = "";

    data.notes.forEach(note => {
      const { title, subject, description } = note;
      const noteHtml = createNoteHtml(title, subject, description);
      notesList.innerHTML += noteHtml;
    });
  } catch (err) {
    console.error(err);
  }
}

allNotesBtn.addEventListener("click", async () => {
  viewNotes(NOTE_TYPES.ALL);
  notesList.setAttribute("data-note-type", "all");
});

stemNotesBtn.addEventListener("click", async () => {
  viewNotes(NOTE_TYPES.STEM);
  notesList.setAttribute("data-note-type", "STEM");
});

humanitiesNotesBtn.addEventListener("click", async () => {
  viewNotes(NOTE_TYPES.HUMANITIES);
  notesList.setAttribute("data-note-type", "Humanities");
});
