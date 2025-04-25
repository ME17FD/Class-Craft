import React, { useState } from "react";
import styles from "../styles/LoginForm.module.css";

interface UserData {
  id?: number; // Long en TypeScript est représenté par number
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [signUpData, setSignUpData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState<
    Omit<UserData, "firstName" | "lastName">
  >({
    email: "",
    password: "",
  });

  const handleSignUpClick = () => setIsRightPanelActive(true);
  const handleSignInClick = () => setIsRightPanelActive(false);

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoutez ici la logique d'inscription
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoutez ici la logique de connexion
  };

  return (
    <div
      className={`${styles.container} ${
        isRightPanelActive ? styles.rightPanelActive : ""
      }`}>
      <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
        <form onSubmit={handleSignUpSubmit}>
          <h1>Créer un compte</h1>
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={signUpData.firstName}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={signUpData.lastName}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signUpData.email}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={signUpData.password}
            onChange={handleSignUpChange}
            required
          />
          <button type="submit">S'inscrire</button>
        </form>
      </div>

      <div className={`${styles.formContainer} ${styles.signInContainer}`}>
        <form onSubmit={handleSignInSubmit}>
          <h1>Se connecter</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signInData.email}
            onChange={handleSignInChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={signInData.password}
            onChange={handleSignInChange}
            required
          />
          <button type="submit">Connexion</button>
        </form>
      </div>

      <div className={styles.overlayContainer}>
        <div className={styles.overlay}>
          <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
            <h1>Content de vous revoir !</h1>
            <button className={styles.ghost} onClick={handleSignInClick}>
              Se connecter
            </button>
          </div>
          <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
            <h1>Nouveau ici ?</h1>
            <button className={styles.ghost} onClick={handleSignUpClick}>
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
