import Head from "next/head";
import Link from "next/link";
import ActiveLink from "./ActiveLink";
import { signIn, signOut, useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import styles from "../styles/Layout.module.css";
import { main } from "../styles/main.module.css";

export const siteTitle = "NextGame";

export default function Layout({ children, home }) {
  const [session, loading] = useSession();
  const [headerBoxShadow, setHeaderBoxShadow] = useState(false);
  const listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    if (winScroll > 56) {
      setHeaderBoxShadow(true);
    } else {
      setHeaderBoxShadow(false);
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
        className={styles.nav}
        style={
          headerBoxShadow
            ? { boxShadow: "0px 5px 5px 0px rgba(0,0,0,0.5)" }
            : {}
        }
      >
        <ul>
          <li>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>
                <span>Home</span>
              </a>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink activeClassName={styles.active} href="/index2">
              <a>
                <span>Home2</span>
              </a>
            </ActiveLink>
          </li>
          {session && (
            <li>
              <ActiveLink activeClassName={styles.active} href="/worldAndPlace">
                <a>
                  <span>World And Place</span>
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
