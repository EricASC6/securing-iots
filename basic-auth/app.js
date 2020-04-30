const express = require("express");
const app = express();

// dummy data
const users = [{ username: "Eric", password: "123" }];

// auth middleware
function basicAuth(req, res, next) {
  // get the Authorization field from the req header
  const authorization = req.get("Authorization");

  // 401 error if authorization field is empty
  if (!authorization) {
    return res
      .status(401)
      .set(
        "WWW-Authenticate",
        "Missing Authorization Header, Please Provide Username & Password"
      )
      .json({ error: "Missing Authorization Header", data: null });
  }

  // get the type of authorization + credentials
  const [type, credentials] = authorization.split(" ");

  // 401 error if type is not basic
  if (type !== "Basic")
    return res
      .status(401)
      .set("WWW-Authenticate", "API only supports Basic Authentication")
      .json({ error: "Mising Basic in Authorization Header", data: null });

  // convert credentials from bas364 to utf-8
  const decodedCredentials = Buffer.from(credentials, "base64").toString(
    "utf-8"
  );

  // get username & password from the credentials
  const [username, password] = decodedCredentials.split(":");

  // find user in the database that has the corresponding username
  const user = users.find((user) => user.username === username);

  // handle invalid username
  if (!user) {
    return res
      .status(401)
      .set("WWW-Authenticate", "Incorrect Username or Password")
      .json({ error: "Incorrect Username or Password", data: null });
  }

  const validPassword = user.password === password;

  // handle invalid password
  if (!validPassword) {
    return res
      .status(401)
      .set("WWW-Authenticate", "Incorrect Username or Password")
      .json({ error: "Incorrect Username or Password", data: null });
  }

  // move on to the next middleware function if all checks are dealt with
  return next();
}

// api calls that require authentication / authorization
app.get("/data", basicAuth, (req, res) => {
  res.json({ error: null, data: "Successful authentication & authorization" });
});

app.listen(3000, () => console.log("Listening on port 3000"));
