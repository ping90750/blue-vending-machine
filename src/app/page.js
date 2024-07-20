import Head from "next/head";

import VendingMachine from "./components/vendingMachine";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Blue Vending Machine</title>
        <meta name="description" content="blue vending machine application" />
      </Head>
      <main>
        <VendingMachine />
      </main>
    </div>
  );
}
