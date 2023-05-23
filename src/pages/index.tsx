import { useState, useEffect, FormEvent, use } from "react";
import Head from "next/head";
import router from "next/router";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import User from "@/types/User";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [userList, setUserList] = useState<User[]>();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [connectedUser, setConnectedUser] = useState<User | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const user = (await response.json()) as User[];
      setConnectedUser(user[0]);
    }
  };

  useEffect(() => {
    if (connectedUser) {
      sessionStorage.setItem("logged", JSON.stringify(connectedUser?.name));
      router.push("/search");
    }
  }, [connectedUser]);

  useEffect(() => {
    (async () => {
      const results = (await fetch("/api/userList").then((response) =>
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
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button type="submit">Se connecter</button>
        </form>
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
