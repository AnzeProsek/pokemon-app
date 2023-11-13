import { createContext, useContext, useState } from "react";

const PokemonContext = createContext();

export function usePokemonContext() {
  return useContext(PokemonContext);
}

export function PokemonProvider({ children }) {
  const [pokemonData, setPokemonData] = useState([]);

  return (
    <PokemonContext.Provider value={{ pokemonData, setPokemonData }}>
      {children}
    </PokemonContext.Provider>
  );
}
