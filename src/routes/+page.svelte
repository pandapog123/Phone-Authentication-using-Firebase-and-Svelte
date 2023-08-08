<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  let loading = false;

  const {
    recaptchaValidStore,
    confirmationResultStore,
    userStore,
    phoneSignIn,
    verifyCode,
    signOutAsync,
  } = data.auth;

  let countryCode: string | null = "";
  let phoneNumberBody: string | null = "";

  $: countryCodeValid = countryCode !== null && countryCode.length !== 0;
  $: phoneNumberBodyValid =
    phoneNumberBody !== null && phoneNumberBody.length !== 0;

  $: phoneNumberFormValid =
    $recaptchaValidStore &&
    countryCodeValid &&
    phoneNumberBodyValid &&
    !loading;

  async function handlePhoneSubmit() {
    if (!phoneNumberFormValid) {
      return;
    }

    loading = true;

    const fullPhoneNumber = `+${countryCode! + phoneNumberBody!}`;

    await phoneSignIn(fullPhoneNumber);

    loading = false;
  }

  let OTPCode: string | null = "";

  $: OTPFormValid =
    OTPCode !== null &&
    OTPCode.length === 6 &&
    !loading &&
    $confirmationResultStore !== null;

  async function handleOTPSubmit() {
    if (!OTPFormValid) {
      return;
    }

    loading = true;

    try {
      await verifyCode(OTPCode!);
    } catch (error) {
      console.log(error);
    }

    loading = false;
  }
</script>

<main>
  {#if $userStore}
    <p>Your logged in!</p>

    <button on:click={signOutAsync}>Log Out</button>
  {:else if $confirmationResultStore}
    <form on:submit|preventDefault={handleOTPSubmit}>
      <input type="text" bind:value={OTPCode} />

      <button type="submit" disabled={!OTPFormValid}>Confirm Code</button>
    </form>
  {:else}
    <form on:submit|preventDefault={handlePhoneSubmit}>
      <div class="phone-number-form">
        <input type="text" bind:value={countryCode} placeholder="Country" />

        <input
          type="text"
          bind:value={phoneNumberBody}
          placeholder="111-222-3333"
        />
      </div>

      <div id="recaptcha-container" />

      <button
        id="sign-in-button"
        type="submit"
        disabled={!phoneNumberFormValid}
      >
        Sign In with Phone Number
      </button>
    </form>
  {/if}
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  main {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  input {
    font-size: 1rem;
  }

  .phone-number-form {
    display: grid;
    grid-template-columns: 6rem 9rem;
    gap: 1rem;
    grid-auto-flow: row;
  }
</style>
