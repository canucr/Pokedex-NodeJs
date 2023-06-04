const express = require("express");
const https = require("https");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Statik dosyaları servis etmek için express.static middleware'ini ekledik

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  let id = Number(req.body.pokemon);
  let url = "https://pokeapi.co/api/v2/pokemon/" + id;

  let pokeImg;
  if (id < 10) {
    pokeImg = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/00" + id + ".png";
  } else if (id < 100) {
    pokeImg = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/0" + id + ".png";
  } else {
    pokeImg = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/" + id + ".png";
  }

  https.get(url, (response) => {
    let responseData = "";

    response.on("data", (dataChunk) => {
      responseData += dataChunk;
    });

    response.on("end", () => {
      const pokeInfo = JSON.parse(responseData);
      const pokemonName = pokeInfo.forms[0].name;
      const pokeType = pokeInfo.types[0].type.name;

      const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="style.css">
        </head>
        <body>
        <div class="result-container">

          <h1>The Pokemon You Are Looking For: ${pokemonName}</h1>
          <img src="${pokeImg}">
          <h3>Type: ${pokeType}</h3>
          </div>
          <form action="/" method="post">
            <label for="pokemon">Pokemon ID</label>
            <input type="text" name="pokemon" id="pokemon">
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
      `;
      res.send(htmlResponse);
    });
  });
});

app.listen(5000, () => {
  console.log("Server listening on port 5000...");
});