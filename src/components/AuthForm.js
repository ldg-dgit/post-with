import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const inputStyles = {};

const AuthForm = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        const data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        const data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit} className='container'>
        <input
          name='email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={onChange}
          className='authInput'
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={onChange}
          className='authInput'
          required
        />
        <input
          type='submit'
          value={newAccount ? "Create Account" : "Log in"}
          className='authInput authSubmit'
        />
        {error && <span className='authError'>{error}</span>}
      </form>
      <span onClick={toggleAccount} className='authSwitch'>
        {newAccount ? "Sign in" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
