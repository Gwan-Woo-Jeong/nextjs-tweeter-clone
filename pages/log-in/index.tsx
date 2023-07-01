import useMutation from "lib/client/useMutation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface loginForm {
  uuid: string;
  password: string;
}

interface loginResponse {
  ok: boolean;
  message?: string;
}

export default function LogIn() {
  const twitterLogoSrc =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png?20220821125553";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginForm>();

  const [login, { data, loading }] =
    useMutation<loginResponse>("/api/users/log-in");

  const router = useRouter();

  const onValid = (form: loginForm) => {
    if (loading) return;
    login(form);
  };

  const goToCreateAccount = () => {
    router.push("/create-account");
  };

  useEffect(() => {
    if (data && data?.ok === false) return alert(data.message);
    if (data && data?.ok === true) router.replace("/");
  }, [data, router]);

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
      <form className="px-24" onSubmit={handleSubmit(onValid)}>
        <input
          {...register("uuid", { required: "Please enter your ID" })}
          className="border-b-2 w-full block px-1"
          placeholder="Email or Phone Number"
        />
        <text className="text-red-500 text-sm px-1">
          {errors.uuid?.message && errors.uuid.message}
        </text>
        <input
          {...register("password", { required: "Please enter your password" })}
          className="border-b-2 w-full block px-1"
          placeholder="Password"
          type="password"
        />
        <text className="text-red-500 text-sm px-1">
          {errors.password?.message && errors.password.message}
        </text>
        <div className="pt-4 pb-8">
          <input
            className="block mx-auto bg-blue-400 text-white py-1 px-3 rounded-lg cursor-pointer"
            value="Log In"
            type="submit"
          />
          <div className="flex justify-center items-center text-xs gap-2 text-gray-400 font-extralight mt-5 mb-3">
            <div className="border-[0.5px] flex-1 border-gray-200" />
            or if you don't have an account
            <div className="border-[0.5px] flex-1 border-gray-200" />
          </div>
          <button
            className="block mx-auto bg-white text-blue-400 py-1 px-2 rounded-lg"
            onClick={goToCreateAccount}
          >
            Create Account
          </button>
        </div>
      </form>
    </>
  );
}
