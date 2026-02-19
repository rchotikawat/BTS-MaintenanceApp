"use client";
import { signIn } from "next-auth/react";
import styles from "./OAuthButton.module.css";

export default function OAuthButton() {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        aria-label="Sign in with GitHub"
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.28 3.438 9.75 8.205 11.33.6.11.82-.26.82-.58 0-.29-.01-1.05-.015-2.06-3.338.73-4.043-1.61-4.043-1.61-.546-1.39-1.333-1.76-1.333-1.76-1.09-.75.082-.74.082-.74 1.205.085 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.495.99.108-.77.42-1.3.763-1.6-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.125-.303-.535-1.523.115-3.176 0 0 1.005-.322 3.295 1.23.955-.266 1.98-.399 3-.405 1.02.006 2.045.14 3 .405 2.29-1.552 3.295-1.23 3.295-1.23.65 1.653.24 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.81 1.096.81 2.21 0 1.596-.015 2.882-.015 3.274 0 .32.21.695.825.577C20.565 22.245 24 17.78 24 12.5 24 5.87 18.627.5 12 .5z"/>
        </svg>
        <span className={styles.label}>Sign in with GitHub</span>
      </button>
    </div>
  );
}
