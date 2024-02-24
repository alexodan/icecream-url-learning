export function getUrl() {
  const currentSearch = window.location.search;
  return new URLSearchParams(currentSearch);
}

export function updateUrl(url) {
  window.history.pushState(null, "", `?${url.toString()}`);
}
