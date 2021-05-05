import Head from "next/head";
import Link from "next/link";
import ActiveLink from "./ActiveLink";

export const siteTitle = "NextGame";

export default function Layout({ children, home }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
        <meta name="description" content="A game build with nextjs" />
      </Head>
      <style jsx>{`
        header,
        nav,
        main {
          background: #f5f5f5;
        }
        nav {
          display: flex;
          justify-content: center;
          background: #3f51b5;
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
          color: #3f51b5;
        }
        li a.active div {
          background: white;
          color: #3f51b5;
        }
        header {
          text-align: center;
          padding: 16px;
        }
        header span {
          font-size: 20px;
          font-weight: bold;
          line-height: 20px;
        }
        main {
          display: flex;
          justify-content: center;
        }
        main div {
          max-width: 1000px;
          width: 1000px;
        }
      `}</style>
      <header>
        <span>
          <Link href="/">{siteTitle}</Link>
        </span>
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
        </ul>
      </nav>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
}
