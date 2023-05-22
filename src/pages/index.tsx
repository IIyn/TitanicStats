import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

export default function Home() {
  const [userList, setUserList] = useState<User[]>();

  useEffect(() => {
    (async () => {
      const results = (await fetch("/api/users").then((response) =>
        response.json()
      )) as User[];
      setUserList(results);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Titanic</title>
        <meta
          name="description"
          content="Application qui affiche les statistiques des passagers du Titanic"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Titanic</h1>
        {userList ? (
          <ul>
            {userList.map((user) => (
              <li key={user._id}>
                <p>
                  {user.name} | {user.email} | {user.password}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun utilisateur</p>
        )}
      </main>
    </>
  );
}
