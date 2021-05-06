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
        nav {
          display: flex;
          justify-content: center;
          background: #2196f3;
          color: white;
          position: sticky;
          top: 0px;
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          max-width: 1000px;
          width: 1000px;
          white-space: nowrap;
        }
        li {
          float: left;
        }
        li div {
          padding: 16px;
          font-size: 20px;
          line-height: 20px;
          transition: all 0.4s ease-in-out;
        }
        li div:hover {
          background: #e0e0e0;
          color: #2196f3;
          transform: translateY(-5px);
        }
        li a.active div {
          background: white;
          color: #2196f3
        }
        header {
          display: flex;
          justify-content: center;
        }
        header div {
          max-width: 1000px;
          width: 1000px;
          padding: 16px;
        }
        header div span {
          font-size: 20px;
          font-weight: bold;
          line-height: 20px;
        }
        header span:hover {
          text-decoration: underline;
        }
        main {
          display: flex;
          justify-content: center;
        }
        main div {
          max-width: 1000px;
          width: 1000px;
          padding: 16px;
        }
      `}</style>
      <header>
        <div>
          <span>
            <Link href="/">{siteTitle}</Link>
          </span>
          {session && (
            <span style={{ float: "right" }}>
              {session.user.name || session.user.email}
            </span>
          )}
        </div>
      </header>
      <nav>
        <ul>
          <li>
            <ActiveLink activeClassName="active" href="/">
              <a>
                <div>Home</div>
              </a>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink activeClassName="active" href="/index2">
              <a>
                <div>Home2</div>
              </a>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink activeClassName="active" href="/index3">
              <a>
                <div>Home3</div>
              </a>
            </ActiveLink>
          </li>
          <li style={{ float: "right" }}>
            {!session && (
              <a
                href={`/api/auth/signin`}
                onClick={(e) => {
                  e.preventDefault();
                  signIn("google", { callbackUrl: "/" });
                }}
              >
                <div>Sign in</div>
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
                  <div>Sign out</div>
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
