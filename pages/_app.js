import 'tailwindcss/tailwind.css'
import '../styles/style2.css'
import Head from "next/head";
// import '../styles/normalize.css'
// import '../styles/webflow.css'
function MyApp({ Component, pageProps }) {
  
  return (
    <>
  <Component {...pageProps} />
  </>
  );
}

export default MyApp
