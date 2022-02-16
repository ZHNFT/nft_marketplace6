import { useEffect, useState } from "react";
import { MoralisProvider } from "react-moralis";
import '../styles/globals.css'
import Layout from './components/layout';

function MyApp({ Component, pageProps }) {

  const [honeyBalance, updateBalance] = useState("0")

  // useEffect(() => {

  //   GetNumberTokens().then((result) => {
  //     updateBalance(result);
  //   })

  // }, [])

  if (!process.env.REACT_APP_MORALIS_APPLICATION_ID || !process.env.REACT_APP_MORALIS_SERVER_URL) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <MoralisProvider appId={process.env.REACT_APP_MORALIS_APPLICATION_ID || ""} serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL || ""}>
      <Layout>
        {/* 
          Component here is the page, for example index.js
          So if we want a sidebar or main menu on every page of the website its best to put these components in layout.js
        */}
        <Component {...pageProps} />
      </Layout>
    </MoralisProvider>
  )
}

export default MyApp
