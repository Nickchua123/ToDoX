import api from "@/lib/axios";

const getCookie = (name) => {
  try {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  } catch {
    return undefined;
  }
};

export async function prepareCsrfHeaders() {
  await api.get("/auth/csrf-token", { _skipAuthRedirect: true });
  const token = getCookie("XSRF-TOKEN");
  return token ? { "X-XSRF-TOKEN": decodeURIComponent(token) } : {};
}
