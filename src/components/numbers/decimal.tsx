import { whatDecimalSeparator } from "./helpers";
import clsx from "clsx";

export const Decimal = ({
  amount,
  decimals = 6,
  round = 6,
  symbol,
  symbolLeft = false, // Ensure symbolLeft has a default value
  className,
}: {
  amount: bigint;
  decimals?: number;
  round?: number;
  symbol?: string;
  symbolLeft?: boolean;
  className?: string;
}) => {
  const dec = amount % BigInt(10 ** decimals);
  const int = BigInt(Number(amount - dec) / 10 ** decimals);

  return (
    <div
      className={clsx(
        "inline-flex items-baseline font-mono font-normal flex-row", // Base styles
        className,
      )}
    >
      {/* Integer Part */}
      <span className={clsx("block", symbolLeft ? "order-2" : "order-1")}>
        {(int || "0").toLocaleString()}
        {round > 0 && whatDecimalSeparator()}
      </span>

      {/* Decimal Part */}
      {dec.toString().length && round > 0 && (
        <span
          className={clsx(
            "block text-[0.85em]",
            symbolLeft ? "order-3" : "order-2",
          )}
        >
          {dec.toString().length > round
            ? dec.toString().substring(0, round)
            : `${dec}${"0".repeat(round - dec.toString().length)}`}
        </span>
      )}

      {/* Symbol Part */}
      {symbol && (
        <span
          className={clsx(
            "block ",
            symbolLeft ? "mr-1 order-1" : "ml-1 order-3", // Symbol: `order-1` for left, `order-3` for right
          )}
        >
          {symbol}
        </span>
      )}
    </div>
  );
};
