import type { Ref } from "react";
import type { FieldControlProps } from "@/components/shared/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EnumSelectProps<Value extends string> = {
  ref: Ref<HTMLButtonElement>;
  control: FieldControlProps;
  value: Value | undefined;
  onChange: (value: Value) => void;
  onBlur: () => void;
  placeholder: string;
  options: readonly Value[];
  label: (option: Value) => string;
};

export function EnumSelect<Value extends string>({
  ref,
  control,
  value,
  onChange,
  onBlur,
  placeholder,
  options,
  label,
}: EnumSelectProps<Value>) {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(selected) => {
        const option = options.find((candidate) => candidate === selected);
        if (option) onChange(option);
      }}
    >
      <SelectTrigger {...control} ref={ref} onBlur={onBlur} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {label(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
