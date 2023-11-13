import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import constants from "../../constants/constants";
import Navbar from "../../components/Navbar/Navbar";
import LoadingPlaceholder from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import { usePokemonContext } from "../../contexts/PokemonContext/PokemonContext";
import Footer from "../../components/Footer/Footer";
import "./Ability.scss";

function Ability() {
  const { id } = useParams();
  const { pokemonData } = usePokemonContext();
  const [ability, setAbility] = useState(null);
  const [loading, setLoading] = useState(true);

  function DisplayName({ name }) {
    const words = name.split("-");
    if (words.length > 1) {
      if (
        words[0].toLowerCase() === "mr" ||
        words[0].toLowerCase() === "tapu" ||
        words[1].toLowerCase() === "null"
      ) {
        return <p className="pokemon-name">{words[0] + " " + words[1]}</p>;
      } else if (
        words[1].toLowerCase() === "o" ||
        words[1].toLowerCase() === "oh"
      ) {
        return <p className="pokemon-name">{name}</p>;
      } else {
        return <p className="pokemon-name">{words[0]}</p>;
      }
    } else {
      return <p className="pokemon-name">{name}</p>;
    }
  }

  function matchingPokemon(pokemonName) {
    return pokemonData.find((pokemon) => pokemon.name === pokemonName);
  }

  useEffect(() => {
    async function fetchAbility() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAbility(data);
        } else {
          console.error("Error fetching ability:", response.status);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching ability:", error);
        setLoading(false);
      }
      setLoading(false);
    }

    fetchAbility();
  }, [id]);

  console.log(ability);

  return (
    <>
      <Navbar />
      {loading && !ability ? (
        <LoadingPlaceholder />
      ) : (
        <div className="ability">
          <div className="ability-card">
            <div className="ability-card-name-desc">
              <div className="ability-card-name">
                <h3>
                  {(ability && ability.name.replace(/-/g, " ")) ||
                    "No ability name available"}
                </h3>
              </div>
              <div className="ability-card-description">
                <p>
                  {ability && ability.name === "overgrow"
                    ? ability.effect_entries[0]?.effect ||
                      "No description available"
                    : ability.effect_entries[1]?.effect ||
                      "No description available"}
                </p>
              </div>
            </div>
            <div className="carriers-list">
              <div className="carrier-list-text">
                <p style={{ fontWeight: 500 }}>
                  Pokémon that get this ability:
                </p>
              </div>
              <div className="ability-carriers">
                {ability && ability.pokemon ? (
                  ability.pokemon
                    .filter(
                      (pokemon) =>
                        parseInt(
                          pokemon.pokemon.url.split("/").slice(-2, -1)[0]
                        ) <= constants.howManyPokemon
                    )
                    .map((pokemon) => (
                      <ul
                        className="ability-carriers-list "
                        key={pokemon.pokemon.name}
                      >
                        <li className="ability-carriers-list-item">
                          <Link
                            className="ability-carriers-list-item-link"
                            to={`/pokemon/${
                              pokemon.pokemon.url.split("/").slice(-2, -1)[0]
                            }`}
                          >
                            <img
                              src={
                                matchingPokemon(pokemon.pokemon.name).sprites
                                  .front_default
                              }
                              alt="pokemon.pokemon.name"
                            />
                            <DisplayName name={pokemon.pokemon.name} />
                          </Link>
                        </li>
                      </ul>
                    ))
                ) : (
                  <p>No data available for this ability.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Ability;
