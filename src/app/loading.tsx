export default function HomeLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14 animate-pulse">
      <div className="max-w-xl mb-14">
        <div className="skeleton h-9 w-full max-w-md rounded-md" />
        <div className="skeleton h-9 w-2/3 max-w-xs rounded-md mt-2" />
        <div className="skeleton h-4 w-full rounded mt-6" />
        <div className="skeleton h-4 w-5/6 rounded mt-2" />
        <div className="skeleton h-4 w-2/3 rounded mt-2" />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-line rounded-lg overflow-hidden bg-white"
          >
            <div className="aspect-square skeleton" />
            <div className="p-4">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-5 w-32 rounded mt-2" />
              <div className="skeleton h-4 w-24 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
