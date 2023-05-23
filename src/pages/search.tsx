import User from "@/types/User";
import { parse } from "path";
import { FormEvent, useEffect, useState } from "react";

export default function Search() {
  const [user, setUser] = useState<string>();

  const [filter] = useState<{
    sex: string;
    age: { min: number; max: number };
    pclass: number;
    survived: boolean;
  }>({
    sex: "male",
    age: { min: 45, max: 100 },
    pclass: 1,
    survived: true,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(filter);
  };

  useEffect(() => {
    // get the logged user from the sessionStorage
    const loggedUser = sessionStorage.getItem("logged");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  return (
    <main>
      <h1>Recherche</h1>
      <h2>Connecté en tant que {user}</h2>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="search">Recherche</label>
        <select
          name="sex"
          id="sex-select"
          onChange={(event) => {
            console.log(event.target.value);
            filter.sex = event.target.value;
          }}
        >
          <option value="male" disabled>
            --Choisissez une option--
          </option>
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
        <select
          name="age"
          id="age-select"
          onChange={(event) => {
            console.log(event.target.value);
            switch (event.target.value) {
              case "below18":
                filter.age.min = 0;
                filter.age.max = 18;
                break;
              case "above18-below45":
                filter.age.min = 18;
                filter.age.max = 45;
                break;
              case "above45":
                filter.age.min = 45;
                filter.age.max = 150;
                break;
            }
          }}
        >
          <option value="below18" disabled>
            --Choisissez une option--
          </option>
          <option value="below18">Moins de 18</option>
          <option value="above18-below45">Plus de 18, moins de 45</option>
          <option value="above45">Plus de 45</option>
        </select>
        <select
          name="class"
          id="class-select"
          onChange={(event) => {
            console.log(event.target.value);
            filter.pclass = parseInt(event.target.value);
          }}
        >
          <option value="1" disabled>
            --Choisissez une option--
          </option>
          <option value="1">1ère classe</option>
          <option value="2">2ème classe</option>
          <option value="3">3ème classe</option>
        </select>
        <select
          name="survived"
          id="survived-select"
          onChange={(event) => {
            console.log(event.target.value);
            switch (event.target.value) {
              case "yes":
                filter.survived = true;
                break;
              case "no":
                filter.survived = false;
                break;
            }
          }}
        >
          <option value="yes" disabled>
            --Choisissez une option--
          </option>
          <option value="yes">Survécu</option>
          <option value="no">Mort</option>
        </select>
        <button type="submit">Rechercher</button>
      </form>
    </main>
  );
}
