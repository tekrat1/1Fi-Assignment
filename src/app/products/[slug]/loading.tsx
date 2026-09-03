export default function ProductLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse">
      <div className="skeleton h-4 w-40 rounded mb-6" />

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: gallery skeleton */}
        <div>
          <div className="flex gap-4">
            <div className="w-[82px] shrink-0 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[82px] w-[82px] rounded-xl skeleton"
                />
              ))}
            </div>
            <div className="relative flex-1 h-[570px] rounded-xl skeleton" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="h-14 rounded-lg skeleton" />
            <div className="h-14 rounded-lg skeleton" />
          </div>
        </div>

        {/* Right: details skeleton */}
        <div>
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-8 w-56 rounded mt-3" />
          <div className="skeleton h-4 w-24 rounded mt-2" />

          <div className="mt-6">
            <div className="skeleton h-4 w-32 rounded mb-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-9 w-24 rounded-md" />
              ))}
            </div>
          </div>

          <div className="mt-6 skeleton h-8 w-40 rounded" />

          <div className="mt-8">
            <div className="skeleton h-4 w-56 rounded mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 rounded-md skeleton" />
              ))}
            </div>
          </div>

          <div className="mt-8 skeleton h-12 w-48 rounded-md" />
        </div>
      </div>
    </div>
  );
}
