import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

// Import MainLayout for pages that need sidebar/topbar
import MainLayout from "../components/MainLayout";

function MyApp({ Component, pageProps }) {
  // Check if the page wants a layout
  const getLayout =
    Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <>
      <Toaster position="top-center" />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;
