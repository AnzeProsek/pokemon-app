import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import constants from "../../constants/constants";
import { useFavoritesContext } from "../../contexts/FavoritesContext/FavoritesContext";
import { usePokemonContext } from "../../contexts/PokemonContext/PokemonContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./PokemonDetail.scss";

function PokemonDetail() {
  const { id } = useParams();
  const { pokemonData } = usePokemonContext();
  const { favorites, setFavorites } = useFavoritesContext();
  const [isFavorited, setIsFavorited] = useState(false);
  const [displayShiny, setDisplayShiny] = useState(false);
  const [pokemon, setPokemon] = useState(null);
  const [nextPokemon, setNextPokemon] = useState(null);
  const [previousPokemon, setPreviousPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [pokemonSpecies, setPokemonSpecies] = useState(null);
  const [chainInfo, setChainInfo] = useState(null);

  useEffect(() => {
    async function fetchSpecies() {
      try {
        if (pokemon) {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
          );
          console.log("klice2");
          if (response.ok) {
            const speciesData = await response.json();
            setPokemonSpecies(speciesData);
          }
        }
      } catch (error) {
        console.error("Error fetching species:", error);
      }
    }
    fetchSpecies();
  }, [pokemon]);

  console.log(chainInfo);

  useEffect(() => {
    async function fetchChain() {
      try {
        if (pokemonSpecies && pokemonSpecies.evolution_chain) {
          const response = await fetch(`${pokemonSpecies.evolution_chain.url}`);
          console.log("klice1");
          if (response.ok) {
            const chainData = await response.json();
            setEvolutionChain(chainData);
          }
        }
      } catch (error) {
        console.error("Error fetching chain:", error);
      }
    }
    fetchChain();
  }, [pokemonSpecies]);

  useEffect(() => {
    const foundPokemon = pokemonData.find((p) => p.id == id);
    if (foundPokemon) {
      setPokemon(foundPokemon);
      const currentIndex = pokemonData.findIndex((p) => p.id == id);
      if (currentIndex > 0) {
        setPreviousPokemon(pokemonData[currentIndex - 1]);
      } else {
        setPreviousPokemon(pokemonData[currentIndex]);
      }

      if (currentIndex < pokemonData.length - 1) {
        setNextPokemon(pokemonData[currentIndex + 1]);
      } else {
        setNextPokemon(pokemonData[currentIndex]);
      }
    }
  }, [id, pokemonData]);

  useEffect(() => {
    function extractIdFromUrl(url) {
      const parts = url.split("/");
      const id = parts[parts.length - 2];
      return parseInt(id);
    }

    function createChain(evolutionChain, currentObject, finalArray, stage) {
      if (evolutionChain && evolutionChain.chain && currentObject) {
        if (currentObject.species) {
          let newObject = {
            pokemon_name: currentObject.species.name,
            stage: stage,
            id: extractIdFromUrl(currentObject.species.url),
          };
          if (currentObject.evolution_details.length > 2) {
            newObject.evolution_details =
              currentObject.evolution_details[
                currentObject.evolution_details.length - 1
              ];
          } else {
            newObject.evolution_details = currentObject.evolution_details[0];
          }
          finalArray.push(newObject);
          stage += 1;
          for (const element of currentObject.evolves_to) {
            createChain(evolutionChain, element, finalArray, stage);
          }
        }
      }
    }

    const finalArray = [];
    if (evolutionChain && evolutionChain.chain) {
      createChain(evolutionChain, evolutionChain.chain, finalArray, 1);
    }
    const filteredData = finalArray.filter(
      (element) => element.id <= constants.howManyPokemon
    );
    setChainInfo(filteredData);
  }, [evolutionChain]);

  function matchingPokemon(pokemonId) {
    return pokemonData.find((pokemon) => pokemon.id === pokemonId);
  }

  const toggleFavorite = () => {
    if (isFavorited) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== pokemon.id);
      setFavorites(updatedFavorites);
    } else {
      const updatedFavorites = [...favorites, pokemon];
      updatedFavorites.sort((a, b) => a.id - b.id);
      setFavorites(updatedFavorites);
    }
    setIsFavorited(!isFavorited);
  };

  useEffect(() => {
    const isAlreadyFavorited = favorites.some(
      (fav) => fav.name === pokemon?.name
    );
    setIsFavorited(isAlreadyFavorited);
  }, [pokemon, favorites]);

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

  return (
    <>
      <Navbar />
      <div className="detail">
        {pokemon && (
          <div className="detail-card">
            {pokemon.id > 1 ? (
              <Link
                className="previous-pokemon"
                to={`/pokemon/${previousPokemon.id}`}
              >
                #{previousPokemon.id}
              </Link>
            ) : null}
            {pokemon.id < pokemonData.length ? (
              <Link
                key={nextPokemon.id}
                className="next-pokemon"
                to={`/pokemon/${nextPokemon.id}`}
              >
                #{nextPokemon.id}
              </Link>
            ) : null}
            <div className="id-name">
              <div className="pokemon-detail-id">
                <h3 className="pokemon-detail-id-text info-font">
                  #{pokemon.id}
                </h3>
              </div>
              <div className="pokemon-detail-name">
                <h3 className="pokemon-detail-name-text info-font">
                  <DisplayName name={pokemonData[id - 1].name} />
                </h3>
              </div>
            </div>
            <img
              src={
                displayShiny
                  ? pokemon.sprites.front_shiny
                  : pokemon.sprites.front_default
              }
              alt={pokemon.name}
            />

            <div className="info">
              <div className="type">
                <div className="type-img">
                  {pokemon.types.map((type) => (
                    <Link
                      key={type.type.name}
                      to={`/typings/${type.type.name}`}
                    >
                      <div className={`type-icon type-${type.type.name}`}>
                        {type.type.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="abilities">
                <div className="ability-text">
                  <p>Abilities:</p>{" "}
                </div>
                <div className="all-abilities">
                  {pokemon.abilities.map((ability, index) => (
                    <Link
                      to={`/abilities/${ability.ability.name}`}
                      className="uppercase"
                      key={index}
                    >
                      {index + 1}. {ability.ability.name.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="stats">
                <div className="stat-names">
                  {pokemon.stats.map((stat, index) => (
                    <div key={index} className="stat-name">
                      <p className="bold stat-text">
                        {stat.stat.name === "special-attack"
                          ? "sp. attack"
                          : stat.stat.name === "special-defense"
                          ? "sp. defense"
                          : stat.stat.name}
                        :
                      </p>
                      <p className="stat-value-text">{stat.base_stat}</p>
                    </div>
                  ))}
                </div>
                <div className="stat-line-outer">
                  {pokemon.stats.map((stat, index) => (
                    <div key={index} className="stat-line-container">
                      <div
                        className="stat-line"
                        style={{
                          width: `${
                            (parseInt(stat.base_stat, 10) / 300) * 200
                          }px`,
                          backgroundColor:
                            stat.base_stat < 50
                              ? "#f34444"
                              : stat.base_stat < 100
                              ? "#ffdd57"
                              : stat.base_stat >= 100 && stat.base_stat <= 149
                              ? "#a0e515"
                              : "#00c2b8",
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bst-outer">
                <div className="bst">
                  <p>Base stat total:</p>
                </div>
                <div className="bst-value">
                  {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                </div>
              </div>
            </div>
            <div className="evolution-outer">
              {chainInfo.length > 1 &&
              !chainInfo.every(
                (element) => element.stage === chainInfo[0].stage
              )
                ? (() => {
                    const groupedPokemon = chainInfo.reduce(
                      (acc, pokemonEvo) => {
                        const stage = pokemonEvo.stage;
                        if (!acc[stage]) {
                          acc[stage] = [];
                        }
                        acc[stage].push(pokemonEvo);
                        return acc;
                      },
                      {}
                    );

                    return Object.keys(groupedPokemon).map((stage, index) => (
                      <div key={stage} className="stage-container">
                        {groupedPokemon[stage].map((pokemonEvo) => (
                          <div
                            className="stage-container-sub"
                            key={pokemonEvo.id}
                          >
                            {pokemonEvo.id && matchingPokemon(pokemonEvo.id) ? (
                              <div className="one-pokemon-evo">
                                {stage > 1 && index > 0 ? (
                                  <div className="evo-details">
                                    {pokemonEvo.evolution_details ===
                                    undefined ? null : pokemonEvo
                                        .evolution_details.held_item !==
                                      null ? (
                                      <p className="evo-details-text">
                                        {pokemonEvo.evolution_details.held_item.name.replace(
                                          /-/g,
                                          " "
                                        )}
                                      </p>
                                    ) : pokemonEvo.evolution_details
                                        .min_affection !== null ? (
                                      <p className="evo-details-text">
                                        Affection
                                      </p>
                                    ) : pokemonEvo.evolution_details
                                        .min_happiness !== null ? (
                                      <p className="evo-details-text">
                                        Friendship
                                      </p>
                                    ) : pokemonEvo.evolution_details
                                        .min_beauty !== null ? (
                                      <p className="evo-details-text">Beauty</p>
                                    ) : pokemonEvo.evolution_details.trigger
                                        .name === "level-up" &&
                                      pokemonEvo.evolution_details
                                        .known_move !== null ? (
                                      <p className="evo-details-text">
                                        {
                                          pokemonEvo.evolution_details
                                            .known_move.name
                                        }
                                      </p>
                                    ) : pokemonEvo.evolution_details.trigger
                                        .name === "level-up" ? (
                                      <p className="evo-details-text">
                                        lvl{" "}
                                        {pokemonEvo.evolution_details.min_level}
                                      </p>
                                    ) : pokemonEvo.evolution_details.trigger
                                        .name === "use-item" ? (
                                      <p className="evo-details-text">
                                        {pokemonEvo.evolution_details.item.name.replace(
                                          /-/g,
                                          " "
                                        )}
                                      </p>
                                    ) : pokemonEvo.evolution_details.trigger
                                        .name === "trade" ? (
                                      <p className="evo-details-text">Trade</p>
                                    ) : (
                                      <p className="evo-details-text">
                                        {pokemonEvo.evolution_details.trigger.name.replace(
                                          /-/g,
                                          " "
                                        )}
                                      </p>
                                    )}
                                    <div className="arrow-right"></div>
                                  </div>
                                ) : null}
                                {matchingPokemon(pokemonEvo.id).sprites
                                  .front_default != null ? (
                                  <Link
                                    to={`/pokemon/${pokemonEvo.id}`}
                                    className="evo-pic-name"
                                  >
                                    <img
                                      className="one-pokemon-evo-pic"
                                      src={
                                        matchingPokemon(pokemonEvo.id).sprites
                                          .front_default
                                      }
                                      alt={pokemonEvo.id}
                                    />
                                    <div className="one-pokemon-evo-name">
                                      {pokemonEvo.pokemon_name.replace(
                                        /-/g,
                                        " "
                                      )}
                                    </div>
                                  </Link>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ));
                  })()
                : null}
            </div>
            <div className="inputs">
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={displayShiny}
                  onChange={() => setDisplayShiny(!displayShiny)}
                />
                Shiny
              </div>
              <div className="favorite-button-div">
                <button className="favorite-button" onClick={toggleFavorite}>
                  {isFavorited ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default PokemonDetail;
