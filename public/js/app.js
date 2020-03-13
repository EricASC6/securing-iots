// Creating a note

const noteForm = document.querySelector("#create-note");
const noteTitle = document.querySelector("#note-title");
const subject = document.querySelector("#subject");
const note = document.querySelector("#note-text");

noteForm.addEventListener("submit", e => {
  e.preventDefault();

  const title = noteTitle.value;
  const subjectVal = subject.value;
  const noteText = note.value;

  console.log(title, subjectVal, noteText);
});
