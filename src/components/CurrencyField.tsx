import React from "react";
import { TextField, InputAdornment, type TextFieldProps } from "@mui/material";

interface CurrencyFieldProps
  extends Omit<TextFieldProps, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

export default function CurrencyField({
  value,
  onChange,
  ...rest
}: CurrencyFieldProps) {
  const formatCurrency = (val: string) => {
    const onlyNumbers = val.replace(/\D/g, "");
    if (!onlyNumbers || onlyNumbers === "0") return "";
    const number = Number(onlyNumbers) / 100;
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    onChange(formatted);
  };

  return (
    <TextField
      {...rest}
      value={value === "0,00" ? "" : value}
      onChange={handleChange}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        },
      }}
    />
  );
}
