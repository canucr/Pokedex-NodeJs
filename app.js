const express = require("express");
const htpps = require("https");
const app = express();

app.use (express.json());
app.use(express.urlencoded({extended : true}));

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html" )

})

app.post("/", (req,res)=>{
    let id = Number(req.body.pokemon); 
    let url = "https://pokeapi.co/api/v2/pokemon/" + id; 
    
    if (id <10) {
        pokeImg = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/00" +id+".png"
    }else if (id <100) {
        pokeImg = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/0" +id+".png"
    }else {
        pokeImg ="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/" +id+".png"
    }

    
    
    
    htpps.get(url, (response) =>{
        var responseData = ""

        response.on("data",(dataChunk)=>{
            responseData += dataChunk;
        
        })
        response.on("end", () =>{
            var pokeInfo = JSON.parse(responseData);
            var pokemonName = pokeInfo.forms[0].name;
            var pokeType = pokeInfo.types[0].type.name;
            
            
            res.write("<h1>The Pokemon You Are Looking For:" + pokemonName + "</h1>")
            res.write("<img src=" + pokeImg + ">");
            res.write("<h3>Type :"+ pokeType +  "</h3>");

            res.end();

        })
    })

})



app.listen(5000, (req,res)=>{
    console.log("server listening on port 5000...")

}); 