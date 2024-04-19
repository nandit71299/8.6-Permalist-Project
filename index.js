import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  database : "permalist",
  user : "postgres",
  password:"root",
  host:"localhost",
  port:5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items where isactive=1 ORDER BY id ASC");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: result.rows,
    });
  } catch (error) {
    console.log(error)
  }
 
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    const result = await db.query("INSERT INTO items (title) VALUES ($1)",[item])
    res.redirect("/");    
  } catch (error) {
    console.log(error)
  }
});

app.post("/edit", (req, res) => {
  console.log(req.body)
  const itemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;

  try {
    const result = db.query("UPDATE items SET title = $1 WHERE id = $2",[updatedItemTitle,itemId]);
    res.redirect("/");
  } catch (error) {
    console.log(error)
  }
});

app.post("/delete", async (req, res) => {

  var item = req.body.deleteItemId;
  try {
    const result = await db.query("update items set isactive = 0 WHERE id = $1",[item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
