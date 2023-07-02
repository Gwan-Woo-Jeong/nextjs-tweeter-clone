import { cls } from "lib/client/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegisterReturn;
  placeholder?: string;
  disabled?: boolean;
}

export default function TextArea({
  onSubmit,
  register,
  disabled,
  placeholder,
}: TextAreaProps) {
  return (
    <form className="relative w-full inline-block" onSubmit={onSubmit}>
      <div className="block w-full h-44 rounded-2xl border-2 px-4 pt-4 pb-16">
        <textarea
          {...register}
          className=" w-full h-full resize-none placeholder:text-lg"
          placeholder={placeholder}
        ></textarea>
      </div>
      <input
        className={cls(
          "absolute bg-blue-400 px-5 py-2 rounded-2xl text-white font-bold right-3 bottom-3 cursor-pointer",
          disabled ? "bg-gray-300 cursor-not-allowed" : ""
        )}
        value="Tweet"
        type="submit"
        disabled={disabled}
      />
    </form>
  );
}
