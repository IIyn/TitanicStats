import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "@/styles/Home.module.css";
import User from "@/types/User";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  } as FormData);
  const [connectedUser, setConnectedUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    const { email, password } = formData;
    if (email === "" || password === "") {
      setErrorMessage("Veuillez remplir tous les champs");
    } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      setErrorMessage("Veuillez entrer une adresse email valide");
    } else {
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setErrorMessage("Email ou mot de passe incorrect");
          }
        })
        .then((user) => {
          setConnectedUser(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (connectedUser) {
      sessionStorage.setItem("logged", JSON.stringify(connectedUser));
      router.push("/search");
    }
  }, [connectedUser]);

  useEffect(() => {
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
        <h1 className={styles.title}>Se connecter</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
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
          <button type="submit">Se connecter</button>
        </form>
        <p
          className={styles.loginButton}
          onClick={() => {
            router.push("/");
          }}
        >
          {`Vous n'avez pas de compte ? Inscrivez vous`}
        </p>
      </main>
    </>
  );
}
