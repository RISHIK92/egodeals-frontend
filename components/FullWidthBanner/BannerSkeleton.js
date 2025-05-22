// components/FullWidthBanner/BannerSkeleton.jsx
export function BannerSkeleton() {
  return (
    <div className="w-full overflow-hidden">
      <div className="w-full h-[400px] bg-gray-200 animate-pulse flex items-center justify-center relative">
        {/* Main banner skeleton */}
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>

        {/* Content overlay skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4 max-w-2xl space-y-4">
            {/* Title skeleton */}
            <div className="h-8 bg-white/20 rounded-lg w-3/4 mx-auto animate-pulse"></div>
            {/* Subtitle skeleton */}
            <div className="h-4 bg-white/15 rounded-lg w-1/2 mx-auto animate-pulse"></div>
            {/* Button skeleton */}
            <div className="h-12 bg-white/25 rounded-full w-32 mx-auto mt-6 animate-pulse"></div>
          </div>
        </div>

        {/* Navigation dots skeleton */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full bg-white/30 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
