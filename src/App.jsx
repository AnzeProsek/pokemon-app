import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokemonList from "./pages/PokemonList/PokemonList";
import PokemonDetail from "./pages/PokemonDetail/PokemonDetail";
import Favorites from "./pages/Favorites/Favorites";
import Ability from "./pages/Ability/Ability";
import Typings from "./pages/Typings/Typings";
import { PokemonProvider } from "./contexts/PokemonContext/PokemonContext";
import { FavoritesProvider } from "./contexts/FavoritesContext/FavoritesContext";

function App() {
  return (
    <Router>
      <PokemonProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/abilities/:id" element={<Ability />} />
            <Route path="/typings/:id" element={<Typings />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </FavoritesProvider>
      </PokemonProvider>
    </Router>
  );
}

export default App;
