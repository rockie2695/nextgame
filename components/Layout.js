import Head from "next/head";
import Link from "next/link";
import ActiveLink from "./ActiveLink";
import { signIn, signOut, useSession } from "next-auth/client";

export const siteTitle = "NextGame";

export default function Layout({ children, home }) {
  const [session, loading] = useSession();
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
        <meta name="description" content="A game build with nextjs" />
      </Head>
      <style jsx>{`
        header {
          display: flex;
          justify-content: center;
        }
        header div {
          max-width: 62.5rem;
          width: 62.5rem;
          padding: 1rem;
          display: flex;
        }
        header div span {
          font-size: 1.25rem;
          font-weight: bold;
          line-height: 1.25rem;
        }
        header span:hover {
          text-decoration: underline;
        }
        header span:first-child {
          flex-grow: 1;
        }
        nav {
          display: flex;
          justify-content: center;
          background: #2196f3;
          color: white;
          position: sticky;
          top: 0rem;
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          max-width: 62.5rem;
          width: 62.5rem;
          display: flex;
          flex-wrap: nowrap;
          white-space: nowrap;
        }
        li:nth-last-child(2) {
          flex-grow: 1;
        }
        li a {
          display: block;
          padding: 1rem;
          font-size: 1.25rem;
          line-height: 1.25rem;
          height: 3.3rem;
          transition: all 0.4s ease-in-out;
        }
        li a:hover {
          background: #e0e0e0;
          color: #2196f3;
          transform: translateY(-0.25rem);
        }
        li a.active {
          background: white;
          color: #2196f3;
        }
        main {
          display: flex;
          justify-content: center;
        }
        main div {
          max-width: 1000px;
          width: 1000px;
          padding: 1rem;
          display: flex;
        }
      `}</style>
      <header>
        <div>
          <span>
            <Link href="/">{siteTitle}</Link>
          </span>
          {session && <span>{session.user.name || session.user.email}</span>}
        </div>
      </header>
      <nav>
        <ul>
          <li>
            <ActiveLink activeClassName="active" href="/">
              <a>
                <span>Home</span>
              </a>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink activeClassName="active" href="/index2">
              <a>
                <span>Home2</span>
              </a>
            </ActiveLink>
          </li>
          {session && (
            <li>
              <ActiveLink activeClassName="active" href="/place">
                <a>
                  <span>Place</span>
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
                  signIn("google", { callbackUrl: "http://localhost:3000/" });
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
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  <span>Sign out</span>
                </a>
              </>
            )}
          </li>
        </ul>
      </nav>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
}
