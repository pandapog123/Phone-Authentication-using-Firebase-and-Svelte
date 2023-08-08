import { get, writable } from "svelte/store";
import { firebaseApp } from ".";
import {
  type ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  useDeviceLanguage,
  signInWithCredential,
  PhoneAuthProvider,
  signOut,
} from "firebase/auth";
import { browser } from "$app/environment";
import { setWindowProp } from "../services/window";

export const auth = getAuth(firebaseApp);

export async function phoneSignIn(phoneNumber: string) {
  const recaptchaVerifier = get(recaptchaStore);

  if (!recaptchaVerifier) {
    return;
  }

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    recaptchaVerifier
  );

  confirmationResultStore.set(confirmationResult);
}

export async function verifyCode(code: string) {
  const confirmationResult = get(confirmationResultStore);

  if (!confirmationResult) {
    return;
  }

  try {
    await confirmationResult.confirm(code);

    const userCredential = PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      code
    );

    signInWithCredential(auth, userCredential);
  } catch (error) {
    throw error;
  }
}

export async function signOutAsync() {
  signOut(auth);
}

export const userStore = writable(auth.currentUser, (set) => {
  const unsubscribe = onAuthStateChanged(auth, set);

  return () => unsubscribe();
});

export const confirmationResultStore = writable<ConfirmationResult | null>();

export const recaptchaStore = writable<RecaptchaVerifier | null>();

export const recaptchaValidStore = writable(false, (set) => {
  if (!browser) {
    return;
  }

  useDeviceLanguage(auth);

  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal",
    callback: () => {
      set(true);
    },
  });

  recaptchaStore.set(recaptchaVerifier);

  recaptchaVerifier.render().then((widgetId) => {
    setWindowProp("recaptchaWidgetId", widgetId);
  });
});
