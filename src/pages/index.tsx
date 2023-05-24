import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import router from "next/router";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import User from "@/types/User";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [connectedUser, setConnectedUser] = useState<User | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    if (name === "" || email === "" || password === "") {
      setErrorMessage("Veuillez remplir tous les champs");
    } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      setErrorMessage("Veuillez entrer une adresse email valide");
    } else if (password.length < 5) {
      setErrorMessage("Le mot de passe doit contenir au moins 5 caractères");
    } else {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const getUser = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (getUser.ok) {
          const user = (await getUser.json()) as User[];
          setConnectedUser(user[0]);
        }
      } else {
        setErrorMessage("Cet email est déjà utilisé");
      }
    }
  };

  useEffect(() => {
    if (connectedUser) {
      sessionStorage.setItem("logged", JSON.stringify(connectedUser?.name));
      router.push("/search");
    }
  }, [connectedUser]);

  useEffect(() => {
    // get the logged user from the sessionStorage
    const loggedUser = sessionStorage.getItem("logged");
    if (loggedUser) {
      router.push("/search");
    }
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
        <h1 className={styles.title}>{`S'inscrire`}</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="email">Nom</label>
          <input
            type="text"
            id="name"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
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
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <button type="submit">{`S'inscrire`}</button>
        </form>
        <p
          className={styles.loginButton}
          onClick={() => {
            router.push("/login");
          }}
        >
          Vous avez déjà un compte ?
        </p>
      </main>
    </>
  );
}
