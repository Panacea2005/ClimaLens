"use client"

import React from "react";

// Dot pattern rendering for numbers
export const renderDotNumber = (value: string, size: number = 4) => {
    const elements = [];

    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        if (char === "+") {
            elements.push(
                <span key={`${i}-plus`} className="inline-block ml-1 text-foreground">
                    +
                </span>
            );
            continue;
        }
        if (char === "%") {
            elements.push(
                <span key={`${i}-percent`} className="inline-block ml-1 text-foreground">
                    %
                </span>
            );
            continue;
        }

        elements.push(
            <div key={i} className="inline-block mx-1">
                <div className="grid grid-cols-3 gap-[2px]" style={{ fontSize: 0 }}>
                    {getNumberDotPattern(char, size)}
                </div>
            </div>
        );
    }

    return <div className="flex items-center justify-center">{elements}</div>;
};

// Generate dot pattern for a single digit
export const getNumberDotPattern = (digit: string, size: number = 4) => {
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

    const dots = [];
    const pattern = patterns[digit] || [];

    for (let i = 0; i < pattern.length; i++) {
        dots.push(
            pattern[i] ? (
                <div
                    key={i}
                    className="rounded-full bg-foreground"
                    style={{ width: size, height: size }}
                />
            ) : (
                <div key={i} style={{ width: size, height: size }} />
            )
        );
    }

    return dots;
};

// Background dots pattern for sections
export const BackgroundDots = () => {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
            {[...Array(400)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-foreground"
                    style={{
                        width: Math.random() * 2 + 1 + "px",
                        height: Math.random() * 2 + 1 + "px",
                        left: Math.random() * 100 + "%",
                        top: Math.random() * 100 + "%",
                    }}
                />
            ))}
        </div>
    );
};

// Dot pattern for text highlight
export const renderDotWord = (word: string) => {
    return (
        <div className="inline-block relative">
            <span className="relative z-10">{word}</span>
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-6 opacity-10">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-foreground"
                        style={{
                            width: 2,
                            height: 2,
                            left: `${i * 14}%`,
                            top: `${Math.sin(i * 0.8) * 100 + 50}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// Section header dots
export const renderSectionDots = (size = 4) => {
    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-[2px]">
                    {[...Array(4)].map((_, j) => (
                        <div
                            key={j}
                            className="rounded-full bg-foreground/80"
                            style={{ width: size, height: size }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

// Small pattern for cards
export const renderCardPattern = () => {
    return (
        <div className="absolute top-6 right-6">
            <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                    <div
                        key={i}
                        className={`rounded-full ${i % 2 === 0 ? 'bg-background/30' : 'bg-transparent'}`}
                        style={{ width: 4, height: 4 }}
                    />
                ))}
            </div>
        </div>
    );
};
