import React from "react";

export const IntlFormattedFragment = ({ text }: { text: string }) => {
  const formatText = (line: string) => {
    // '**' is for bold
    const parts = line.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {text.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {formatText(line)}
          <br />
        </React.Fragment>
      ))}
    </>
  );
};
