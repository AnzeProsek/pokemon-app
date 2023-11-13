import React, { useState } from "react";
import { useFavoritesContext } from "../../contexts/FavoritesContext/FavoritesContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PokemonCard from "../../components/PokemonCard/PokemonCard";
import "./Favorites.scss";

function Favorites() {
  const { favorites } = useFavoritesContext();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFavorites = favorites.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isEmpty = favorites.length === 0;

  return (
    <>
      <Navbar />
      <div className="favorites">
        <div className="search">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        {isEmpty ? (
          <div className="no-favorites">
            <p className="no-favorites-text">No favorites to display</p>
          </div>
        ) : (
          <div className="pokemon-list">
            {filteredFavorites.map((pokemon, index) => (
              <PokemonCard key={index} pokemon={pokemon} index={index} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Favorites;
