const input = document.getElementById("pokemonName");
const suggestion = document.getElementById("suggestion");

let pokemonList = []

function formatText(text) {
    return text
    .split("-")
    .map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}


async function loadPokemonNames() {
    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=2000"
    );
    const data = await response.json();

    pokemonList = data.results.map(pokemon => pokemon.name);

}

loadPokemonNames();

input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    suggestion.innerHTML = "";

    if (value === "") return;

    const matches = pokemonList
    .filter(name => name.startsWith(value))
    .slice(0, 5);

    matches.forEach(name => {
        const div = document.createElement("div");

        div.textContent = 
            name.charAt(0).toUpperCase() + name.slice(1);

        div.addEventListener("click", () => {
            input.value = name;
            suggestion.innerHTML = "";
            getPokemon();
        });

        suggestion.appendChild(div);
    })
})



const typeColors = {
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    steel: "#B8B8D0",
    normal: "#A8A878"
};


async function getPokemon() {

    const imgElement = document.getElementById("Pokemon");
    const nameElement = document.getElementById("pokemonNameDisplay");
    const idElement = document.getElementById("idDisplay");
    const typeElement = document.getElementById("pokemonType");
    const card = document.getElementById("pokemonCard");
    const heightElement = document.getElementById("pokemonHeight");
    const weightElement = document.getElementById("pokemonWeight");
    const abilityElement = document.getElementById("pokemonAbility");
    const errorElement = document.getElementById("errorMessage");


    // Hide previous image
    imgElement.style.display = "none";
    imgElement.src = "";

    try {

    errorElement.innerHTML = "";    

    const searchValue = document
    .getElementById("pokemonName")
    .value
    .toLowerCase();

    const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${searchValue}`);

        if (!response.ok) {
            throw new Error("Pokemon not found")
        }


        const data = await response.json();
        

        const primaryType = data.types[0].type.name;

        card.style.backgroundColor = typeColors[primaryType];


        // Pokemon name

        // we want First letter to be capitalized so name.charAt(0) returns p in pikachu for example
        // to slice(1) returns character after p.....that is ikachu.
        nameElement.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);

        // Pokemon Id
        idElement.textContent = `Id: #${data.id}`;

        // Pokemon Types
        // we have to use map here instead of forEach, because we want to extract all the
        // type names into new array. 
        const types = data.types.map(
            typeInfo => formatText(typeInfo.type.name)
        );

        typeElement.textContent = `Type: ${types.join(", ")}`;

        heightElement.textContent = `Height: ${data.height / 10} m`;
        weightElement.textContent = `Weight: ${data.weight / 10} kg`;

        const abilities = data.abilities.map(
            abilityInfo => formatText(abilityInfo.ability.name)
        );

        abilityElement.textContent = `Abilities: ${abilities.join(", ")}`;

        const pokemonSprite = data.sprites.other["official-artwork"].front_default;
       
       
        imgElement.src = pokemonSprite;
        imgElement.style.display = "block"


    } catch (error) {
        nameElement.textContent = "Pokémon not found ❌";
        idElement.textContent = "";
        typeElement.innerHTML = "";
        heightElement.textContent = "";
        weightElement.textContent = "";
        abilityElement.textContent = "";

        errorElement.innerHTML = `
        Try searching by: <br>
        • Name (Pikachu)<br>
        • ID (25)
        `;

        card.style.backgroundColor = "#ffffff";
    }

    suggestion.innerHTML = "";
}


 const pokemonForm = document.getElementById("pokemonForm");

 pokemonForm.addEventListener("submit", (event) => {
    // event.preventDefault() stops browser default behaviour.
    // "When the form is submitted, don't reload the page. Just fetch and display the Pokémon.
    event.preventDefault();
    getPokemon();
 });