import { SWRConfig } from "swr";
import "../global.css";

export default function App({ Component, pageProps }: any) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: (url: string) =>
            fetch(url).then((response) => response.json()),
        }}
      >
        <div className="h-[100vh] bg-blue-300 flex flex-col justify-center items-center">
          <div className="w-[35rem] mx-auto bg-white rounded-3xl p-2">
            <Component {...pageProps} />
          </div>
        </div>
      </SWRConfig>
      <style jsx global>
        {`
          textarea:focus,
          input:focus {
            outline: none;
          }
        `}
      </style>
    </>
  );
}
