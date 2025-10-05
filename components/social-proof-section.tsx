"use client"

export default function SocialProofSection() {
  // Properly structured dot number display for each digit
  const renderDigit = (digit: string, digitIndex: number) => {
    // Patterns for 0-9 in 3x4 dot grid (based on PlayerZero pattern)
    const patterns: Record<string, boolean[]> = {
      "0": [true, true, true, true, false, true, true, false, true, true, true, true],
      "1": [false, true, false, false, true, false, false, true, false, false, true, false],
      "2": [true, true, true, false, false, true, true, true, false, true, false, false],
      "3": [true, true, true, false, false, true, false, true, true, true, true, true],
      "4": [true, false, true, true, false, true, true, true, true, false, false, true],
      "5": [true, true, true, true, false, false, true, true, true, false, false, true],
      "6": [true, true, true, true, false, false, true, true, true, true, true, true],
      "7": [true, true, true, false, false, true, false, false, true, false, false, true],
      "8": [true, true, true, true, false, true, true, true, true, true, true, true],
      "9": [true, true, true, true, false, true, true, true, true, false, false, true],
    };

    const pattern = patterns[digit] || [];
    const rows = [
      pattern.slice(0, 3),
      pattern.slice(3, 6),
      pattern.slice(6, 9),
      pattern.slice(9, 12),
    ];

    return (
      <div key={`digit-${digitIndex}`} className="inline-block mx-[2px]">
        {rows.map((row, rowIndex) => (
          <div key={`row-${digitIndex}-${rowIndex}`} className="flex gap-[2px]">
            {row.map((isVisible, colIndex) => (
              <div
                key={`dot-${digitIndex}-${rowIndex}-${colIndex}`}
                className={`w-[5px] h-[5px] rounded-full ${isVisible ? 'bg-foreground' : 'bg-transparent'}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Render full stat value including symbols
  const renderStatValue = (value: string) => {
    const elements = [];

    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      if (char === "+" || char === "%") {
        elements.push(
          <span key={`symbol-${i}`} className="ml-1 text-foreground">
            {char}
          </span>
        );
      } else {
        elements.push(renderDigit(char, i));
      }
    }

    return <div className="flex justify-center items-center mb-1">{elements}</div>;
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 sm:gap-x-10 gap-y-10 sm:gap-y-16 max-w-5xl mx-auto">
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <div className="mb-2 sm:mb-3 scale-75 sm:scale-90 md:scale-100">
              {renderStatValue("10M+")}
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm uppercase tracking-wide text-center px-2">
              historical data points
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <div className="mb-2 sm:mb-3 scale-75 sm:scale-90 md:scale-100">
              {renderStatValue("95%")}
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm uppercase tracking-wide text-center px-2">
              percentile-based analysis
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <div className="mb-2 sm:mb-3 scale-75 sm:scale-90 md:scale-100">
              {renderStatValue("150+")}
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm uppercase tracking-wide text-center px-2">
              years of weather + ocean
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}