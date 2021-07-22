import Head from "next/head";
import Link from "next/link";
import ActiveLink from "./ActiveLink";
import { signIn, signOut, useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import styles from "../styles/Layout.module.css";
import { main } from "../styles/main.module.css";
import { MdHome as MdHomeIcon } from "react-icons/md";
export const siteTitle = "NextGame";

export default function Layout({ children, home }) {
  const [session, loading] = useSession();
  const [headerBoxShadow, setHeaderBoxShadow] = useState(false);
  const [titleHide, setTitleHide] = useState(true);
  const listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    if (winScroll > 56) {
      setHeaderBoxShadow(true);
    } else {
      setHeaderBoxShadow(false);
    }

    if (winScroll > 36) {
      setTitleHide(false);
    } else {
      setTitleHide(true);
    }
  };

  if (typeof window !== "undefined") {
    useEffect(() => {
      window.addEventListener("scroll", listenToScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", listenToScroll);
      };
    }, []);
  }
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
        <meta name="description" content="A game build with nextjs" />
      </Head>
      <header className={styles.header}>
        <div>
          <div>
            <Link href="/">
              <a>
                <span>{siteTitle}</span>
              </a>
            </Link>
          </div>

          {session && <span>{session.user.name || session.user.email}</span>}
        </div>
      </header>
      <nav
        className={[
          styles.nav,
          headerBoxShadow ? styles.headerBoxShadow : "",
        ].join(" ")}
      >
        <ul>
          <li>
            <ActiveLink activeClassName={styles.active} href="/">
              <a style={{ display: "flex" }}>
                <div
                  className={[
                    styles.title,
                    titleHide ? styles.titleHide : "",
                  ].join(" ")}
                >
                  NextGame
                </div>
                <span>
                  <MdHomeIcon />
                </span>
              </a>
            </ActiveLink>
          </li>
          {session && (
            <li>
              <ActiveLink activeClassName={styles.active} href="/world">
                <a>
                  <span>世界</span>
                </a>
              </ActiveLink>
            </li>
          )}
          <li></li>
          <li>
            {!session && (
              <a
                href={`/api/auth/signin`}
                onClick={(e) => {
                  e.preventDefault();
                  signIn("google", {
                    callbackUrl: process.env.NEXTAUTH_URL + "/",
                  });
                }}
              >
                <span>Sign in</span>
              </a>
            )}
            {session && (
              <>
                <a
                  href={`/api/auth/signout`}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut({ callbackUrl: process.env.NEXTAUTH_URL + "/" });
                  }}
                >
                  <span>Sign out</span>
                </a>
              </>
            )}
          </li>
        </ul>
      </nav>
      <main className={main}>
        <div>{children}</div>
      </main>
      <footer className={styles.footer}>
        <div>
          <span>made by&nbsp;</span>
          <Link href="https://github.com/rockie2695/">
            <a target="_blank">rockie2695</a>
          </Link>
        </div>
      </footer>
    </>
  );
}
