export default function(path) {
  if (path.charAt(0) === "/") {
    path = path.substr(1);
  }
  const id = `body-${path.replace("/", "-").replace(":", "-")}`;
  console.log(id)
  return id;
}
