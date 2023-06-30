import useMutation from "lib/client/useMutation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface createAccountForm {
  id: string;
  password: string;
  name: string;
}

interface createAccountResponse {
  ok: boolean;
  message?: string;
}

export default function CreateAccount() {
  const twitterLogoSrc =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png?20220821125553";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createAccountForm>();

  const [createAccount, { data, loading }] = useMutation<createAccountResponse>(
    "/api/users/create-account"
  );

  const router = useRouter();

  const onValid = (form: createAccountForm) => {
    if (loading) return;
    createAccount(form);
    if (data?.ok === false) return alert(data.message);
    if (data?.ok === true) {
      alert("Account Created!\nPlease Log In!");
      router.replace("/log-in");
    }
  };

  const goBack = () => {
    router.replace("/log-in");
  };

  return (
    <>
      <div className="text-center pt-10 pb-8">
        <Image
          loader={() => twitterLogoSrc}
          src={twitterLogoSrc}
          width={75}
          height={75}
          objectFit="contain"
        />
      </div>
      <form className="space-y-4 px-24" onSubmit={handleSubmit(onValid)}>
        <input
          {...register("id", { required: "Please enter your ID" })}
          className="border-b-2 w-full block px-1"
          placeholder="Email or Phone Number"
        />
        <text className="text-red-500 text-sm">
          {errors.id?.message && errors.id.message}
        </text>
        <input
          {...register("password", { required: "Please enter your password" })}
          className="border-b-2 w-full block px-1"
          placeholder="Password"
          type="password"
        />
        <text className="text-red-500 text-sm">
          {errors.password?.message && errors.password.message}
        </text>
        <input
          {...register("name", { required: "Please enter your name" })}
          className="border-b-2 w-full block px-1"
          placeholder="Name"
        />
        <text className="text-red-500 text-sm">
          {errors.password?.message && errors.password.message}
        </text>
        <div className="pt-4 pb-8 space-y-4">
          <input
            className="block mx-auto bg-blue-400 text-white py-1 px-3 rounded-lg cursor-pointer"
            value="Create Account"
            type="submit"
          />
          <button
            className="block mx-auto bg-white text-blue-400 py-1 px-2 rounded-lg"
            onClick={goBack}
          >
            Go Back
          </button>
        </div>
      </form>
    </>
  );
}
