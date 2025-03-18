import { useEffect, useState } from "react";
import { setUserPreferredGenres, updateGender } from "@/services/user";
import { getAllGenres } from "@/services/book";

const SetupModal = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState<"gender" | "genres">("gender");
  const [gender, setGender] = useState<string>("");
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (step === "genres") {
      const fetchGenres = async () => {
        try {
          const data = await getAllGenres();
          setGenres(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching genres:", error);
          setLoading(false);
        }
      };
      fetchGenres();
    } else {
      setLoading(false); // Gender step doesn't need loading
    }
  }, [step]);

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
  };

  const handleGenreSelect = (genreID: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreID)
        ? prev.filter((id) => id !== genreID)
        : prev.length < 4
          ? [...prev, genreID]
          : prev
    );
  };

  const handleNext = async () => {
    if (!gender) {
      alert("Please select a gender.");
      return;
    }
    try {
      await updateGender(gender);
      setStep("genres");
    } catch (error) {
      console.error("Error updating gender:", error);
      alert("Failed to save gender. Please try again.");
    }
  };

  const handleSave = async () => {
    if (selectedGenres.length !== 4) {
      alert("Please select exactly 4 genres.");
      return;
    }
    try {
      await setUserPreferredGenres(selectedGenres);
      onComplete();
    } catch (error) {
      console.error("Error saving genres:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
        <div className="text-gray-400 text-lg animate-pulse">
          {step === "gender" ? "Loading..." : "Loading genres..."}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl w-1/2 border border-gray-800">
        {step === "gender" ? (
          <>
            <h2 className="text-xl font-bold mb-6 text-center tracking-wide">
              Select Your Gender
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {["male", "female", "other"].map((g) => (
                <button
                  key={g}
                  className={`p-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    gender === g
                      ? "bg-white border-white text-black"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-200"
                  }`}
                  onClick={() => handleGenderSelect(g)}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  gender
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleNext}
                disabled={!gender}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="">
            <h2 className="text-xl font-bold mb-6 text-center tracking-wide">
              Select 4 Preferred Genres{" "}
              <span className="text-sm text-gray-400">({selectedGenres.length}/4)</span>
            </h2>
            <div className="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  className={`p-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedGenres.includes(genre.id)
                    //   ? "bg-indigo-600 border-indigo-500 text-white"
                      ? "bg-white border-white text-black"

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
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupModal;