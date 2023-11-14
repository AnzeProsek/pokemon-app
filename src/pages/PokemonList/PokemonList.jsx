import React, { useState, useEffect } from "react";
import constants from "../../constants/constants";
import PokemonCard from "../../components/PokemonCard/PokemonCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import LoadingPlaceholder from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { usePokemonContext } from "../../contexts/PokemonContext/PokemonContext";
import "./../../App.scss";
import "./PokemonList.scss";

const allPokemonTypes = [
  "Normal",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dark",
  "Steel",
  "Fairy",
  "Dragon",
];

function PokemonList() {
  const { pokemonData, setPokemonData } = usePokemonContext();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("default");

  useEffect(() => {
    async function fetchPokemonList() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${constants.howManyPokemon}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const results = data.results;
          const detailedPokemonList = await Promise.all(
            results.map(async (pokemon) => {
              const response = await fetch(pokemon.url);
              if (response.ok) {
                return response.json();
              }
              return null;
            })
          );
          setPokemonData(detailedPokemonList);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching Pokémon list:", error);
        setLoading(false);
      }
    }
    fetchPokemonList();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchedPokemonList = pokemonData.filter((pokemon) => {
    return pokemon.name.includes(searchQuery.toLowerCase());
  });

  const filteredPokemonList =
    selectedType === "default"
      ? searchedPokemonList
      : searchedPokemonList.filter((pokemon) =>
          pokemon.types.some(
            (type) => type.type.name === selectedType.toLowerCase()
          )
        );

  return (
    <div className="list">
      <Navbar />
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="select-div">
          <select
            className="select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="default">No filter</option>
            {allPokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <LoadingPlaceholder />
      ) : (
        <div className="pokemon-list-background">
          <div className="pokemon-list">
            {filteredPokemonList.map((pokemon, index) => (
              <PokemonCard key={index} pokemon={pokemon} index={index} />
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default PokemonList;
