interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
}

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

export default function StarRating({
  rating,
  max = 5,
  size = 14,
  showValue = false,
}: StarRatingProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {STAR_KEYS.slice(0, max).map((key, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const partial = !filled && i < rating;
        const gradId = `sg-${key}`;
        return (
          <svg
            key={key}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            {partial && (
              <defs>
                <linearGradient id={gradId}>
                  <stop
                    offset={`${(rating % 1) * 100}%`}
                    stopColor="oklch(0.76 0.16 80)"
                  />
                  <stop
                    offset={`${(rating % 1) * 100}%`}
                    stopColor="oklch(0.88 0.01 260 / 0.3)"
                  />
                </linearGradient>
              </defs>
            )}
            <path
              d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8L10 1.5z"
              fill={
                filled
                  ? "oklch(0.76 0.16 80)"
                  : partial
                    ? `url(#${gradId})`
                    : "oklch(0.88 0.01 260 / 0.3)"
              }
            />
          </svg>
        );
      })}
      {showValue && (
        <span className="text-xs text-muted-foreground ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
