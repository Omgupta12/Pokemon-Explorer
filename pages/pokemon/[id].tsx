import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PokemonDetail } from "../../types/types";

export default function PokemonDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchPokemon = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await axios.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(res.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl font-bold animate-pulse">Loading Pokemon...</p>
      </div>
    );
  }

  // Error
  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl font-bold text-red-500">Pokemon Not Found!</p>
        <button
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/")}
        >
          ← Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 md:px-10 lg:px-20">
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-6 text-sm sm:text-md"
        onClick={() => router.back()}
      >
        ← Go Back
      </button>

      {/* Name */}
      <h1 className="text-4xl font-bold text-center capitalize">{pokemon.name}</h1>

      {/* Image */}
      <div className="flex justify-center mt-6">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-40 sm:w-52 md:w-64 lg:w-72 transition transform hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="max-w-lg mx-auto mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">Type:
          <span className="ml-2 text-blue-400">{pokemon.types.map((t) => t.type.name).join(", ")}</span>
        </p>

        <p className="text-lg font-semibold mt-2">Abilities:
          <span className="ml-2 text-green-400">{pokemon.abilities.map((a) => a.ability.name).join(", ")}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-lg mx-auto mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center">Stats</h2>
        <ul className="mt-4 space-y-2">
          {pokemon.stats.map((stat) => (
            <li key={stat.stat.name} className="flex justify-between bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-500">
              <span className="capitalize font-medium">{stat.stat.name}</span>
              <span className="font-bold text-yellow-400">{stat.base_stat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Moves */}
      <div className="max-w-lg mx-auto mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center">Moves</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {pokemon.moves.slice(0, 10).map((move) => (
            <span key={move.move.name} className="bg-gray-700 px-3 py-2 rounded-md text-center text-sm font-semibold text-white hover:bg-gray-500">
              {move.move.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

