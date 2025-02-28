import { bangs } from "./bang" with { type: "macro" };
import "./global.css";

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Borhan's Unduck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="${import.meta.env.VITE_BASE_URL}?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
        <label class="bang-container">
          <p>Default Bang:</p>
          <input
            class="bang-input"
            type="text"
            value=""
            placeholder="Enter a bang"
          />
        </label>
      </div>
        <footer class="footer">
        <a href="https://github.com/borhansaflo/unduck" target="_blank">github</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;
  const bangInput = app.querySelector<HTMLInputElement>(".bang-input")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });

  bangInput.value = localStorage.getItem("default-bang") ?? "";

  bangInput.addEventListener("input", () => {
    // If the bang is empty, remove it from local storage
    if (!bangInput.value) {
      localStorage.removeItem("default-bang");
      return;
    }
    if (bangs[bangInput.value]) {
      localStorage.setItem("default-bang", bangInput.value);
      bangInput.setCustomValidity("");
    } else {
      bangInput.setCustomValidity("Unknown bang");
    }
  });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "ddg";

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs[bangCandidate ?? LS_DEFAULT_BANG];

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();