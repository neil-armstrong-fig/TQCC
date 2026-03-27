export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const EXPECTED_HASH_1 =
  "78378c0974dc1787591bb81e5e3b98b68e984688f1ab31649fc2801ca410854c";
const EXPECTED_HASH_2 =
  "17fa3365633d902f8b0653a95f13796ded05d2f141d42a08ed28cf130b4b77c3";

export const STORAGE_KEY = "tqcc-members-auth";

export function isValidHash(hash: string): boolean {
  return hash === EXPECTED_HASH_1 || hash === EXPECTED_HASH_2;
}

export async function initMembersAuth(onUnlock?: () => void): Promise<void> {
  const gate = document.getElementById("password-gate")!;
  const content = document.getElementById("members-content")!;
  const form = document.getElementById("password-form")!;
  const input = document.getElementById("password-input") as HTMLInputElement;
  const error = document.getElementById("error-message")!;
  const toggleBtn = document.getElementById("toggle-password")!;
  const eyeOpen = document.getElementById("eye-open")!;
  const eyeClosed = document.getElementById("eye-closed")!;

  toggleBtn.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      eyeOpen.classList.add("hidden");
      eyeClosed.classList.remove("hidden");
    } else {
      input.type = "password";
      eyeOpen.classList.remove("hidden");
      eyeClosed.classList.add("hidden");
    }
  });

  function unlock() {
    gate.classList.add("hidden");
    content.classList.remove("hidden");
    onUnlock?.();
  }

  const storedPassword = sessionStorage.getItem(STORAGE_KEY);
  if (storedPassword) {
    const storedHash = await hashPassword(storedPassword);
    if (isValidHash(storedHash)) {
      unlock();
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = input.value.trim().toLowerCase();
    const hash = await hashPassword(password);
    if (isValidHash(hash)) {
      sessionStorage.setItem(STORAGE_KEY, password);
      unlock();
    } else {
      error.classList.remove("hidden");
      input.value = "";
      input.focus();
    }
  });
}
