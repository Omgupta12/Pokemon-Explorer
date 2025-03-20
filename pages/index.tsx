import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pokemon, PokemonListResponse } from "../types/types";

const ITEMS_PER_PAGE = 20;

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError(false);

      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const res = await axios.get<PokemonListResponse>(
          `https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`
        );
        // console.log('res',res);
        setTotalPages(Math.ceil(res.data.count / ITEMS_PER_PAGE));

        const detailedPokemons = await Promise.all(
          res.data.results.map(async (p) => {
            const pokemonDetails = await axios.get<Pokemon>(p.url);
            return pokemonDetails.data;
          })
        );
        // console.log('detailedPokemons',detailedPokemons);
        setPokemons(detailedPokemons);
      } catch (error) {
        console.log(error)
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [page]);

  // Filter Pokemon 
  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl font-bold animate-pulse">Loading Pokemon List...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl font-bold text-red-500">Failed to Load Pokemon</p>
        <button
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-md transition-transform transform hover:scale-105"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center">Pokemon Explorer</h1>

      {/* Search Input */}
      <div className="flex justify-center mt-6">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 w-full max-w-md rounded-4xl border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Pokemon List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 mt-8">
        {filteredPokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-gray-800 p-4 rounded-lg cursor-pointer transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            onClick={() => router.push(`/pokemon/${pokemon.id}`)}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-28 mx-auto drop-shadow-md"
            />
            <p className="text-center capitalize font-bold mt-3 text-lg">{pokemon.name}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-center mt-8 space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          className={`px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-md font-semibold transition 
    ${page === 1 ? "bg-gray-600 cursor-not-allowed opacity-60 text-sm sm:text-md"
              : "bg-blue-500 hover:bg-blue-700 shadow-md text-sm sm:text-md md:text-lg"}`}
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        <span className="text-sm sm:text-md md:text-lg font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          className={`px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-md font-semibold transition 
    ${page === totalPages ? "bg-gray-600 cursor-not-allowed opacity-60 text-sm sm:text-md"
              : "bg-blue-500 hover:bg-blue-700 shadow-md text-sm sm:text-md md:text-lg"}`}
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}
