import * as React from "react";

import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, className, min, max, step, ...props }, ref) => {
    const numberToString = (v: number | undefined) =>
      v === undefined || v === null || Number.isNaN(v) ? "" : String(v);

    const [displayValue, setDisplayValue] = React.useState<string>(() =>
      numberToString(value)
    );

    // Keep display in sync when the prop changes externally, but don't clobber
    // the user while they are typing intermediate values like "0" or "-".
    React.useEffect(() => {
      const next = numberToString(value);
      const currentNum = Number(displayValue.replace(",", "."));
      const nextNum = Number(next);
      if (currentNum !== nextNum || (displayValue === "" && next !== "")) {
        setDisplayValue(next);
      }
    }, [value]);

    const parseValue = (raw: string): number | undefined => {
      if (raw === "" || raw === "-" || raw === "." || raw === ",") {
        return undefined;
      }
      const normalized = raw.replace(",", ".");
      const isDecimal = step !== undefined && Number(step) % 1 !== 0;
      const num = isDecimal ? parseFloat(normalized) : parseInt(normalized, 10);
      return Number.isNaN(num) ? undefined : num;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // Allow empty or valid numeric input (optional leading minus, one dot/comma).
      if (raw !== "" && !/^-?\d*([.,]?\d*)$/.test(raw)) {
        return;
      }
      setDisplayValue(raw);
      // Only notify the parent for fully parseable values; intermediate states
      // (e.g. empty, "-", ".") are resolved on blur so the user can keep typing.
      const parsed = parseValue(raw);
      if (parsed !== undefined) {
        onChange(parsed);
      }
    };

    const handleBlur = () => {
      const num = parseValue(displayValue);
      if (num === undefined) {
        setDisplayValue("");
        onChange(undefined);
        return;
      }
      const clamped =
        min !== undefined && num < min ? min : max !== undefined && num > max ? max : num;
      const normalized = Number.isInteger(clamped) ? String(clamped) : String(clamped);
      setDisplayValue(normalized);
      onChange(clamped);
    };

    return (
      <input
        type="text"
        inputMode="decimal"
        pattern="-?[0-9]*[.,]?[0-9]*"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          "flex min-h-11 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
