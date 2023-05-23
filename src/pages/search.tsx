import router from "next/router";
import { FormEvent, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Search() {
  const [user, setUser] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);

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

  const [results, setResults] = useState<Passenger[]>();

  const ageSetUp = (): Array<number> => {
    // split the age range into 5 parts
    const ageRange = filter.age.max - filter.age.min;
    const ageStep = ageRange / 5;
    const ageArray = [];
    for (let i = 0; i < 5; i++) {
      ageArray.push(filter.age.min + ageStep * i);
    }
    console.log(ageArray);
    return ageArray;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    });

    if (response.ok) {
      const passengers = await response.json();
      setResults(passengers);
    }
  };

  useEffect(() => {
    // get the logged user from the sessionStorage
    const loggedUser = sessionStorage.getItem("logged");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    } else {
      // if no logged user, redirect to the login page
      router.push("/");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
      });

      if (response.ok) {
        const passengers = await response.json();
        setResults(passengers);
      }
      setUpdate(false);
    })();
  }, [update]);

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
            filter.sex = event.target.value;
            setUpdate(true);
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
            setUpdate(true);
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
            filter.pclass = parseInt(event.target.value);
            setUpdate(true);
          }}
        >
          <option value="1" disabled>
            --Choisissez une option--
          </option>
          <option value="1">1ère classe</option>
          <option value="2">2ème classe</option>
          <option value="3">3ème classe</option>
        </select>
      </form>
      {results && (
        <>
          <Doughnut
            data={{
              labels: ["Survécu", "Mort"],
              datasets: [
                {
                  label: "Survécu",
                  data: [
                    results.filter((passenger) => passenger.Survived === true)
                      .length,
                    results.filter((passenger) => passenger.Survived === false)
                      .length,
                  ],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />

          <Line
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: "Chart.js Line Chart",
                },
              },
            }}
            data={{
              labels: ageSetUp().toString().split(","),
              datasets: [
                {
                  label: "Survécu",
                  data: ageSetUp().map(
                    (age, index, ages) =>
                      results.filter(
                        (passenger) =>
                          passenger.Survived === true &&
                          passenger.Age > age &&
                          passenger.Age < ages[index + 1]
                      ).length
                  ),
                  backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                  borderColor: ["rgba(255, 99, 132, 1)"],
                  borderWidth: 1,
                },
                {
                  label: "Mort",
                  data: ageSetUp().map(
                    (age, index, ages) =>
                      results.filter(
                        (passenger) =>
                          passenger.Survived === false &&
                          passenger.Age > age &&
                          passenger.Age < ages[index + 1]
                      ).length
                  ),
                  backgroundColor: ["rgba(54, 162, 235, 0.2)"],
                  borderColor: ["rgba(54, 162, 235, 1)"],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </>
      )}
    </main>
  );
}
