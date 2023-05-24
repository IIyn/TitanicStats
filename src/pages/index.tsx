import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import router from "next/router";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import User from "@/types/User";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [connectedUser, setConnectedUser] = useState(null);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    const { name, email, password } = formData;
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
        console.log(getUser);
        if (getUser.ok) {
          const user = await getUser.json();
          setConnectedUser(user);
        }
      } else {
        setErrorMessage("Cet email est déjà utilisé");
      }
    }
  };

  useEffect(() => {
    if (connectedUser) {
      sessionStorage.setItem("logged", JSON.stringify(connectedUser));
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
              const name = event.target.value;
              setFormData((prevState) => ({
                ...prevState,
                name,
              }));
            }}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            onChange={(event) => {
              const email = event.target.value;
              setFormData((prevState) => ({
                ...prevState,
                email: email,
              }));
            }}
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            onChange={(event) => {
              const password = event.target.value;
              setFormData((prevState) => ({
                ...prevState,
                password: password,
              }));
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
