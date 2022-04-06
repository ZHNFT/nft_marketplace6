import Head from 'next/head'

export default function Navbar(props) {
  return (
    <Head>
      <title>Hexagon NFT Marketplace</title>
      <meta name="description" content="The Hexagon NFT Marketplace is part of the hive.investments ecosystem running on polygon." />
      <meta property="og:title" content="Hexagon NFT Marketplace" />
      <meta property="og:description" content="The Hexagon NFT Marketplace is part of the hive.investments ecosystem running on polygon." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hexag0n.io/" />
      <meta property="og:image" content="" />
      <meta name="twitter:image" content="" />
      <meta name="twitter:creator" content="@hiveinvestments" />
      <meta name="twitter:site" content="@hiveinvestments" />
      <meta name="twitter:card" content="summary" /> 
      <meta name="twitter:title" content="Hexagon NFT Marketplace" />
      <meta name="twitter:description" content="The Hexagon NFT Marketplace is part of the hive.investments ecosystem running on polygon." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}