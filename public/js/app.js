// Creating a note

const noteForm = document.querySelector("#create-note");
const noteTitle = document.querySelector("#note-title");
const subject = document.querySelector("#subject");
const note = document.querySelector("#note-text");

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

noteForm.addEventListener("submit", async e => {
  e.preventDefault();

  const id = getCookie("id");
  const reqBody = {
    title: noteTitle.value,
    subject: subject.value,
    description: note.value
  };

  try {
    await fetch(`/data/note/new/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    });
  } catch (err) {
    console.error(err);
  }
});
