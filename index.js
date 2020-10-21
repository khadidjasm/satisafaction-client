const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const kenx = require("knex");
const bodyParser = require("body-parser");
 const bcrypt     = require('bcrypt') 
  var session=Math.round((Math.random() + 1) * 99999);

// serveur html

const db = kenx({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "1992",
    database: "db"
  }
});
// Création du serveur Express
const app = express();

// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static("public"));
// Connexion à la base de donnée PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db",
  password: "1992",
  port: 5432
});
console.log("Connexion réussie à la base de données");

query = (query, values) => {
  return new Promise((resolve, reject) => {
    pool.connect(function(err, client, done) {
      if (err)
        return reject(err)
      client.query(query, values, (err, result) => {
        done()
        if (err)
          return reject(err)
        resolve(result)
      })
    })
  })
}
queryOne = (query, values) => {
  return new Promise((resolve, reject) => {
    pool.connect(function(err, client, done) {
      if (err)
        return reject(err)
      client.query(query, values, (err, result) => {
        done()
        if (err)
          return reject(err)
        resolve(result)
      })
    })
  })
}



// Démarrage du serveur
app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/login) !");
});
const checkPassword = async(reqPassword, foundUser) => {
const password = foundUser.password
 const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
  return new Promise((resolve, reject) =>


    bcrypt.compare(reqPassword, hash, (err, response) => {
console.log(response)
console.log(reqPassword)
console.log(hash)

        if (err) {
          reject(err)
        }
        else if (response) {
           
          resolve(response)
        } else {
          reject(new Error('Passwords do not match.'))
        }
    })
  )
}
// GET /edit/5
app.post("/login", (req, res) => {
 
 const userReq = req.body
  let user

  findUser(userReq)
    .then(foundUser => {
      user = foundUser
      return checkPassword(userReq.password, foundUser)
    })
    .then(() => {
      delete user.password
      console.log(user.type)
       if(user.type=='admin'){

    
res.redirect('http://localhost:3000/')
    

}
else if (user.type=='other'){

res.redirect('/questionAR')
    
 
}
      
    })
    .catch((err) => console.error(err))
});
// GET /
app.get("/", (req, res) => {
  // res.send("Bonjour le monde...");
  res.render("index");
});
// GET /
app.get("/login", (req, res) => {
  // res.send("Bonjour le monde...");
  res.render("login");
});
// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});
// GET /about
app.get("/createQuestion", (req, res) => {
  res.render("createQuestion");
});
// GET /data
app.get("/data", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM question ";
   //
  pool.query(sql, [], (err, result) => {

    if (err) {
      return console.error(err.message);
    }
    
    res.render("data", { question: result.rows });
     
  });
});



// GET /reponse
app.get("/questionAR", (req, res,next) => {
 let questionQuery = queryOne('select * from question group by id')
  let reponseQuery = queryOne('SELECT reponse.id,reponse.reponse_ar,reponse.response_fr,question.question_ar,question.question_fr,reponse.id_question FROM reponse,question WHERE reponse.id_question = question.id and question.id=1')
  Promise.all([questionQuery, reponseQuery]).then(([question, reponse]) => {
     // error page
    res.render('questionAR', { 
            questions:question.rows , reponses:reponse.rows
      })
 
})
});
// GET /reponse
app.get("/questionFR", (req, res) => {
 let questionQuery = queryOne('select * from question group by id')
  let reponseQuery = queryOne('SELECT reponse.id,reponse.reponse_ar,reponse.response_fr,question.question_ar,question.question_fr,reponse.id_question FROM reponse,question WHERE reponse.id_question = question.id and question.id=1')
  Promise.all([questionQuery, reponseQuery]).then(([question, reponse]) => {
     // error page
    res.render('questionFR', { 
            questions:question.rows , reponses:reponse.rows
      })
 
})
});
// GET /reponse
app.get("/questionAR/:id", (req, res) => {
 const id = req.params.id;
 var query_var = [id];


  let questionQuery = queryOne('select * from question group by id')
  let reponseQuery = queryOne('SELECT reponse.id,reponse.reponse_ar,reponse.response_fr,question.question_ar,question.question_fr,reponse.id_question FROM reponse,question WHERE reponse.id_question = question.id and question.id=$1',query_var)
  Promise.all([questionQuery, reponseQuery]).then(([question, reponse]) => {
     // error page
    res.render('questionAR', { 
            questions:question.rows , reponses:reponse.rows
      })

})
});
// GET /reponse
// GET /reponse

// GET /reponse
app.get("/questionFR/:id", (req, res) => {
 const id = req.params.id;
 var query_var = [id];


  let questionQuery = queryOne('select * from question group by id')
  let reponseQuery = queryOne('SELECT reponse.id,reponse.reponse_ar,reponse.response_fr ,question.question_ar,question.question_fr ,reponse.id_question FROM reponse,question WHERE reponse.id_question = question.id and question.id=$1',query_var)
  Promise.all([questionQuery, reponseQuery]).then(([question, reponse]) => {
     // error page
    res.render('questionFR', { 
            questions:question.rows , reponses:reponse.rows
      })

})
});
// GET /create
app.get("/create/:id", (req, res) => {
  const id = req.params.id;
  res.render("create", { model:id } );
});
// GET /create
app.get("/merciar", (req, res) => {
  res.render("merciar", { model: {} });
});
// POST /create
app.post("/create/:id", (req, res) => {
  const id = req.params.id;

  const book = [req.body.reponse_ar, req.body.reponse_fr,  id];
  const sql = "INSERT INTO reponse (reponse_ar, response_fr, id_question) VALUES ($1, $2, $3)";
  
  pool.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/Questions");
  });
});

app.post("/createQuestion", (req, res) => {
 

  const book = [req.body.question_ar, req.body.question_fr];
  const sql = "INSERT INTO question (question_ar, question_fr) VALUES ($1, $2)";
  
  pool.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/data");
  });
});
app.post("/Ajoutsondage", (req, res) => {

  const sql = "INSERT INTO sondage(id_question,id_reponse,session,date)  VALUES ($1, $2, $3,$4)";
  const sondage = [req.body.id_question, req.body.id_reponse, session,req.body.date];
  pool.query(sql, sondage, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(sondage)
    res.json(sondage)
  });
});



app.get('/questions', function(req, res, next) {

  let questionQuery = queryOne('select * from question group by id')
  let reponseQuery = queryOne('SELECT reponse.id,reponse.reponse_ar,reponse.response_fr FROM reponse,question WHERE reponse.id_question = question.id and question.id=1')
  Promise.all([questionQuery, reponseQuery]).then(([question, reponse]) => {
     // error page
    res.render('questions', { 
            question:question.rows , reponse:reponse.rows
      })
 
})

})
app.get("/questions/:id", (req, res) => {
 const id = req.params.id;
 var query_var = [id];


  let questionQuery = queryOne('select * from question group by id')
  let reponseQuery = queryOne('SELECT reponse.id,reponse.reponse_ar,reponse.response_fr FROM reponse,question WHERE reponse.id_question = question.id and question.id=$1',query_var)
  Promise.all([questionQuery, reponseQuery]).then(([question, reponse]) => {
     // error page
    res.render('questions', { 
            question:question.rows , reponse:reponse.rows
      })

})
});


// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM reponse WHERE ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: result.rows[0] });
  });
});
const findUser = (userReq) => {
  return db.raw("SELECT * FROM users WHERE username = ?", [userReq.username])
    .then((data) => data.rows[0])
    
}






// GET /edit/5
app.get("/editQuestio/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM question WHERE ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("editQuestio", { model: result.rows[0] });
  });
});
// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [ req.body.reponse_ar, req.body.reponse_fr, id];
  const sql = "UPDATE reponse SET reponse_ar = $1, response_fr = $2 WHERE (id = $3)";
  pool.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/questions");
  });
});
app.post("/editQuestio/:id", (req, res) => {
  const id = req.params.id;
  const book = [ req.body.question_ar, req.body.question_fr, id];
  const sql = "UPDATE question SET question_ar = $1, question_fr = $2 WHERE (id = $3)";
  pool.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/data");
  });
});
// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM reponse WHERE ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: result.rows[0] });
  });
});

// POST /delete/5
app.post("/deleteReponse", (req, res) => {
  const sql = "DELETE FROM reponse WHERE ID = $1";
  const reponse = [req.body.id];
  pool.query(sql, reponse, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    
    res.json(reponse)
  
  });
});

// POST /delete/5
app.post("/deleteQuestion", (req, res) => {
  const sql = "DELETE FROM question WHERE ID = $1";
  const reponse = [req.body.id];
  pool.query(sql, reponse, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    
    res.json(reponse)
  
  });
});