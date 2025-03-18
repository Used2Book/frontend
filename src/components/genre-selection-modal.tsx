import { useEffect, useState } from "react";
import { setUserPreferredGenres } from "@/services/user";
import { getAllGenres } from "@/services/book";

const GenreSelectionModal = ({ onSave }: { onSave: (selectedGenres: number[]) => void }) => {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        if (data) {
          setGenres(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreSelect = (genreID: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreID)
        ? prev.filter((id) => id !== genreID)
        : prev.length < 4
          ? [...prev, genreID]
          : prev
    );
  };

  const handleSave = async () => {
    if (selectedGenres.length !== 4) {
      alert("Please select exactly 4 genres.");
      return;
    }

    try {
      await setUserPreferredGenres(selectedGenres);
      onSave(selectedGenres);
    } catch (error) {
      console.error("Error saving genres:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
        <div className="text-gray-400 text-lg animate-pulse">Loading genres...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-2">
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl w-1/2 border border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-center tracking-wide">
          Select 4 Preferred Genres{" "}
          <span className="text-sm text-gray-400">({selectedGenres.length}/4)</span>
        </h2>
        <div className="grid grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`p-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedGenres.includes(genre.id)
                  ? "bg-white border-black text-black"
                  : selectedGenres.length >= 4
                    ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-70"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-200"
              }`}
              onClick={() => handleGenreSelect(genre.id)}
              disabled={!selectedGenres.includes(genre.id) && selectedGenres.length >= 4}
            >
              {genre.name}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedGenres.length === 4
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleSave}
            disabled={selectedGenres.length !== 4}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreSelectionModal;