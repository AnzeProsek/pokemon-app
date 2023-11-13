import React from "react";
import { Link } from "react-router-dom";
import "./PokemonCard.scss";
import { useFavoritesContext } from "../../contexts/FavoritesContext/FavoritesContext";

function PokemonCard({ pokemon, index }) {
  const { favorites } = useFavoritesContext();

  const isFavorite = favorites.some((fav) => fav.id === pokemon.id);
  const cardClass = `pokemon-card ${isFavorite ? "favorite" : ""}`;

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
    <Link to={`/pokemon/${pokemon.id}`} className="pokemon-link">
      <div className="shadow">
        <div className={cardClass}>
          <p className="pokemon-id">#{pokemon.id}</p>
          <DisplayName name={pokemon.name} />
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <div className="type-img">
            {pokemon.types.map((type) => (
              <div
                key={type.type.name}
                className={`type-icon type-${type.type.name}`}
              >
                {type.type.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PokemonCard;
