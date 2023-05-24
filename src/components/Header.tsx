import router from "next/router";
import Image from "next/image";
import styles from "@/styles/Header.module.css";

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
          <Image src="/menu.svg" alt="menu" width={35} height={30}></Image>
        </button>
      </div>
    </header>
  );
}
