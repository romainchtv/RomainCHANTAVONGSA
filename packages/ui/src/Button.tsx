import * as React from "react";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  className?: string;
};

export function Button({ label, onPress, className }: ButtonProps) {
  return (
    <button className={className} onClick={onPress} type="button">
      {label}
    </button>
  );
}
