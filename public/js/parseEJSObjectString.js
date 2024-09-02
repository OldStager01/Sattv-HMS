// Function to decode HTML entities into valid string i.e. replace &#34; with "

export function parseEJSObjectString(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return JSON.parse(txt.value);
}
