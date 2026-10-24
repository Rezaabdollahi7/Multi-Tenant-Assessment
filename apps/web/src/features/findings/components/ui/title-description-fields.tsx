import type { UseFormRegisterReturn } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TitleDescriptionFieldsProps = {
  titleProps: UseFormRegisterReturn;
  descriptionProps: UseFormRegisterReturn;
  titleError: string | undefined;
  descriptionError: string | undefined;
};

export function TitleDescriptionFields({
  titleProps,
  descriptionProps,
  titleError,
  descriptionError,
}: TitleDescriptionFieldsProps) {
  return (
    <>
      <FormField
        id="title"
        label="عنوان"
        hint="۳ تا ۲۰۰ نویسه"
        error={titleError}
      >
        {(control) => <Input {...control} {...titleProps} />}
      </FormField>
      <FormField
        id="description"
        label="توضیحات"
        hint="اختیاری. چه چیزی آسیب دیده، چطور بازتولید می‌شود و چه اثری دارد."
        error={descriptionError}
      >
        {(control) => <Textarea rows={8} {...control} {...descriptionProps} />}
      </FormField>
    </>
  );
}
