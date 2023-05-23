import router from "next/router";
import styles from "@/styles/SideBar.module.css";

export default function SideBar({ name }: { name: string }) {
  return (
    <div className={styles.sideBar}>
      <h1>Connecté en tant que {name} </h1>
      <button
        onClick={() => {
          sessionStorage.removeItem("logged");
          router.push("/");
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}
