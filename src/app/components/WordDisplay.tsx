import { useEffect, useRef } from "react";

interface WordDisplayProps {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  wordCorrect: (boolean | null)[];
  accentColor: string;
  fontSize: number;
}

export function WordDisplay({
  words,
  currentWordIndex,
  currentInput,
  wordCorrect,
  accentColor,
  fontSize,
}: WordDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentWordRef = useRef<HTMLSpanElement>(null);

  // Responsive: smaller font on narrow viewports
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 640;
  const effectiveFont = isNarrow ? Math.min(fontSize, 20) : fontSize;
  const lineHeight = Math.round(effectiveFont * 1.9);
  const verticalPadding = Math.round(effectiveFont * 0.5);
  const visibleRows = 3;
  const containerHeight = lineHeight * visibleRows + verticalPadding * 2;

  useEffect(() => {
    if (!currentWordRef.current || !containerRef.current) return;
    const wordTop = currentWordRef.current.offsetTop;
    // Keep active row centered (middle of 3)
    const targetScroll = Math.max(0, wordTop - lineHeight);
    containerRef.current.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, [currentWordIndex, lineHeight]);

  const visibleWords = words.slice(0, Math.min(words.length, currentWordIndex + 40));

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: containerHeight,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
      }}
    >
      <div
        className="flex flex-wrap gap-x-3 content-start"
        style={{ fontFamily: "monospace", fontSize: effectiveFont, lineHeight: `${lineHeight}px` }}
      >
        {visibleWords.map((word, wi) => {
          const isCompleted = wi < currentWordIndex;
          const isCurrent = wi === currentWordIndex;

          if (isCompleted) {
            const wasCorrect = wordCorrect[wi] !== false;
            if (wasCorrect) {
              return (
                <span key={wi} style={{ color: "#4a4a4a" }}>
                  {word}
                </span>
              );
            }
            // Incorrect: red strikethrough
            return (
              <span
                key={wi}
                style={{
                  color: "#ef4444",
                  textDecoration: "line-through",
                  textDecorationColor: "#ef4444",
                  textDecorationThickness: 2,
                  opacity: 0.85,
                }}
              >
                {word}
              </span>
            );
          }

          if (!isCurrent) {
            return (
              <span key={wi} style={{ color: "#888" }}>
                {word}
              </span>
            );
          }

          // Current word
          return (
            <span
              key={wi}
              ref={currentWordRef}
              className="relative px-1 rounded"
              style={{
                background: `${accentColor}1f`,
                boxShadow: `inset 0 -2px 0 ${accentColor}`,
              }}
            >
              {word.split("").map((letter, li) => {
                const typedLetter = currentInput[li];
                let color = "#e6e6e6";
                if (typedLetter === undefined) {
                  color = "#d0d0d0";
                } else if (typedLetter === letter) {
                  color = "#ffffff";
                } else {
                  color = "#ef4444";
                }

                const isCaretPos = li === currentInput.length;

                return (
                  <span key={li} className="relative" style={{ color }}>
                    {isCaretPos && (
                      <span
                        className="absolute -left-0.5 top-0 bottom-0 w-0.5"
                        style={{
                          background: accentColor,
                          animation: "blink 1s step-end infinite",
                        }}
                      />
                    )}
                    <span
                      style={{
                        textDecoration:
                          typedLetter !== undefined && typedLetter !== letter ? "underline" : "none",
                      }}
                    >
                      {letter}
                    </span>
                  </span>
                );
              })}
              {currentInput.length >= word.length && (
                <span
                  className="absolute top-0 bottom-0 w-0.5"
                  style={{
                    right: -4,
                    background: accentColor,
                    animation: "blink 1s step-end infinite",
                  }}
                />
              )}
              {currentInput.slice(word.length).split("").map((ch, i) => (
                <span key={`extra-${i}`} style={{ color: "#ef4444", textDecoration: "underline" }}>
                  {ch}
                </span>
              ))}
            </span>
          );
        })}
      </div>

      {/* Fade top */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: verticalPadding + lineHeight * 0.4,
          background: "linear-gradient(to top, transparent, #0f0f0f)",
        }}
      />
      {/* Fade bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: verticalPadding + lineHeight * 0.4,
          background: "linear-gradient(to bottom, transparent, #0f0f0f)",
        }}
      />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
