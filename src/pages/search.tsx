import router from "next/router";
import { useEffect, useState, useRef, MouseEvent } from "react";
import styles from "@/styles/Search.module.css";
import Image from "next/image";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Line, getElementAtEvent } from "react-chartjs-2";
import Header from "@/components/Header";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const jwt = require("jsonwebtoken");

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// this type is specific to the data we send to the API
type FilterType = {
  sex: string;
  age: { min: number; max: number };
  pclass: number;
};

export default function Search() {
  const [user, setUser] = useState<string>();

  const [filter, setFilter] = useState<FilterType>({
    sex: "male",
    age: { min: 0, max: 18 },
    pclass: 1,
  });

  const [results, setResults] = useState<Passenger[]>();

  const [selectedPassengers, setSelectedPassengers] = useState<
    string[] | undefined
  >(undefined);
  const chartRef = useRef<
    ChartJSOrUndefined<"doughnut", (number | undefined)[], unknown> | undefined
  >();

  /**
   *
   * @param event the event that triggered the function
   */
  const doughnutClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const elements = getElementAtEvent(
      chartRef.current ? chartRef.current : (chartRef.current as any),
      event
    );
    if (elements.length > 0) {
      const element = elements[0]; //we get an array of one element
      const index = element.index;
      const label = chartDoughnutData.labels[index];
      const passengers = results?.filter(
        (passenger) => passenger.Survived === (label === "Survécu")
      );
      const passengerNames = passengers?.map(
        (passenger) => passenger.Name + " (" + passenger.Age + ")"
      );
      setSelectedPassengers(passengerNames);
    }
  };

  /**
   * This function is use to set up the age range for the line chart
   * @returns an array of numbers with the age range
   */
  const ageSetUp = (): Array<number> => {
    const ageRange = filter.age.max - filter.age.min;
    const ageStep = ageRange / 5;
    const ageArray = [];
    for (let i = 0; i < 5; i++) {
      // pushing the age range in the array with 5 steps floored
      ageArray.push(Math.floor(filter.age.min + ageStep * i));
    }
    return ageArray;
  };

  /**
   *
   * @param filterType the type of filter we work on
   * @returns a string with the prettified filter in french
   */
  const prettifyFilter = (filterType: string): string => {
    switch (filterType) {
      case "sex":
        return filter.sex === "male" ? "d'hommes" : "de femmes";
      case "age":
        if (filter.age.min === 45) {
          return " 45 ans et plus";
        } else if (filter.age.min === 0) {
          return " moins de 18 ans";
        } else {
          return (
            "plus de " +
            filter.age.min +
            " ans et moins de " +
            filter.age.max +
            " ans"
          );
        }
      case "pclass":
        return filter.pclass === 1
          ? "1ère classe"
          : filter.pclass + "ème classe";
      default:
        return "";
    }
  };

  /**
   *
   * @param chartType The type of chart to prettify (doughnut or line)
   * @returns a string with the prettified title in french
   */
  const prettifyChartsTitle = (chartType: string): string => {
    switch (chartType) {
      case "doughnut":
        return (
          "Répartition en donut " +
          prettifyFilter("sex") +
          " de " +
          prettifyFilter("age") +
          " en " +
          prettifyFilter("pclass")
        );
      case "line":
        return (
          "Répartition de l'âge en fonction des effectifs " +
          prettifyFilter("sex") +
          " en " +
          prettifyFilter("pclass") +
          " et qui ont " +
          prettifyFilter("age")
        );
      default:
        return "";
    }
  };

  useEffect(() => {
    // get the logged user from the sessionStorage
    const loggedUser = sessionStorage.getItem("logged");
    if (loggedUser) {
      // decrypt the jwt to get the name
      const decodedToken = jwt.decode(JSON.parse(loggedUser).token);
      setUser(decodedToken.name);
    } else {
      // if no logged user, redirect to the login page
      router.push("/");
    }
  }, []);

  useEffect(() => {
    // disconstruct the filter object
    const { sex, age, pclass } = filter;
    (async () => {
      await fetch("/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sex, age, pclass }),
      })
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, [filter]);

  const chartDoughnutData = {
    labels: ["Survécu", "Mort"],
    datasets: [
      {
        label: "Passagers",
        data: [
          results?.filter((passenger) => passenger.Survived === true).length,
          results?.filter((passenger) => passenger.Survived === false).length,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.80)",
          "rgba(54, 162, 235, 0.80)",
          "rgba(255, 206, 86, 0.3)",
          "rgba(75, 192, 192, 0.3)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 1)",
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
  };

  const chartLineData = {
    labels: ageSetUp().toString().split(","),
    datasets: [
      {
        label: "Survécu",
        data: ageSetUp().map(
          (age, index, ages) =>
            results?.filter(
              (passenger) =>
                passenger.Survived === true &&
                passenger.Age > age &&
                passenger.Age < ages[index + 1]
            ).length
        ),
        backgroundColor: ["rgba(255, 99, 132, 1)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
      {
        label: "Mort",
        data: ageSetUp().map(
          (age, index, ages) =>
            results?.filter(
              (passenger) =>
                passenger.Survived === false &&
                passenger.Age > age &&
                passenger.Age < ages[index + 1]
            ).length
        ),
        backgroundColor: ["rgba(54, 162, 235, 1)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className={styles.container}>
      {user ? <Header name={user} /> : null}
      <h1 className={styles.title}>Statistiques</h1>
      <form className={styles.form} action="">
        <label htmlFor="search">Filtres</label>
        <select
          name="sex"
          id="sex-select"
          onChange={(event) => {
            const newFilter = event.target.value;
            setFilter((prevState) => ({
              ...prevState,
              sex: newFilter,
            }));
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
            const newFilter = filter;
            switch (event.target.value) {
              case "below18":
                newFilter.age.min = 0;
                newFilter.age.max = 18;
                setFilter({ ...newFilter });
                break;
              case "above18-below45":
                newFilter.age.min = 18;
                newFilter.age.max = 45;
                setFilter({ ...newFilter });
                break;
              case "above45":
                newFilter.age.min = 45;
                newFilter.age.max = 150;
                setFilter({ ...newFilter });
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
            const newFilter = parseInt(event.target.value);
            setFilter((prevState) => ({
              ...prevState,
              pclass: newFilter,
            }));
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
        <div className={styles.charts}>
          <>
            <figure className={styles.figure}>
              <Doughnut
                data={chartDoughnutData}
                // options={chartOptions}
                ref={chartRef as any}
                onClick={doughnutClick}
              />
              <figcaption className={styles.figcaption}>
                {prettifyChartsTitle("doughnut")}
              </figcaption>
            </figure>
          </>
          {selectedPassengers && (
            <div className={styles.filterList_container}>
              <h2>Liste des passagers</h2>
              <ul className={styles.filterList}>
                {selectedPassengers?.map((passenger, index) => (
                  <li key={index}>{passenger}</li>
                ))}
              </ul>
            </div>
          )}
          <>
            <figure className={styles.figure}>
              <Line data={chartLineData} />
              <figcaption className={styles.figcaption}>
                {prettifyChartsTitle("line")}
              </figcaption>
            </figure>
          </>
        </div>
      )}
    </main>
  );
}
