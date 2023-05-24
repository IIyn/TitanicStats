import router from "next/router";
import styles from "@/styles/SideBar.module.css";

export default function Header({ name }: { name: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
      <h2>Bonjour {name}</h2>
      <button
        onClick={() => {
          sessionStorage.removeItem("logged");
          router.push("/");
        }}
      >
        <img src="/menu.svg" alt="menu"></img>
      </button>
      </div>
    </header>
  );
}
