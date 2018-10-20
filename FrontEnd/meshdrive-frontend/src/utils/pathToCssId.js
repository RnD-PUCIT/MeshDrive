export default function(path) {
  if (path.charAt(0) === "/") {
    path = path.substr(1);
  }
  return `body-${path.replace("/", "-")}`;
}
