import clsx from "clsx";
import { whatDecimalSeparator } from "./helpers";

export const Fiat = ({
  amount,
  decimals = 2,
  symbol,
  className,
  symbolRight = false,
  padSymbol = true,
}: {
  amount: bigint;
  decimals?: number;
  symbol?: string;
  className?: string;
  symbolRight?: boolean;
  padSymbol?: boolean;
}) => {
  const dec = amount % BigInt(10 ** decimals);
  const int = BigInt(Number(amount - dec) / 10 ** decimals);

  const round = 2;

  return (
    <div
      className={clsx(
        "inline-flex items-baseline font-mono font-normal flex-row", // Base styling
        className,
      )}
    >
      {/* Integer Part */}
      <span className={clsx("block", symbolRight ? "order-1" : "order-2")}>
        {(int || "0").toLocaleString()}
        {whatDecimalSeparator()}
      </span>

      {/* Decimal Part */}
      <span
        className={clsx(
          "block text-[0.85em]",
          symbolRight ? "order-2" : "order-3",
        )}
      >
        {dec.toString().length > round
          ? dec.toString().substring(0, round)
          : `${dec}${"0".repeat(round - dec.toString().length)}`}
      </span>

      {/* Symbol Part */}
      {symbol && (
        <span
          className={clsx(
            "block",
            padSymbol && !symbolRight && "mr-1", // Left padding if symbol is on the left
            padSymbol && symbolRight && "ml-1", // Right padding if symbol is on the right
            symbolRight ? "order-3" : "order-1", // Adjust order based on `symbolRight`
          )}
        >
          {symbol}
        </span>
      )}
    </div>
  );
};
