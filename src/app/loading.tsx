export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 transition-opacity duration-500 opacity-100">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mb-4"></div>
      <p className="text-lg text-gray-600 font-medium">Loading ...</p>
    </div>
  );
}
