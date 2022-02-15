import '../styles/globals.css'
import Layout from './components/layout';

import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {

  const [honeyBalance, updateBalance] = useState("0")

  // useEffect(() => {

  //   GetNumberTokens().then((result) => {
  //     updateBalance(result);
  //   })

  // }, [])  

  return (
    <Layout>
      {/* 
        Component here is the page, for example index.js
        So if we want a sidebar or main menu on every page of the website its best to put these components in layout.js
      */}
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
