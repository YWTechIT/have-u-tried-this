import el from "../utils/dom";
import { addClickEvent } from "../router";
import "../../css/CityItem.css";

export default function CityItem({
  wide,
  local,
  thumbnail,
}: {
  wide: string;
  local: string;
  thumbnail: string;
}) {
  const anchor = el(
    "a",
    {},
    el(
      "figure",
      { className: "city-item__thumbnail" },
      el("img", { src: thumbnail }),
    ),
    el(
      "header",
      { className: "city-item__header" },
      el("div", {}, el("h2", {}, local), el("h3", {}, wide)),
    ),
  );

  // Article
  addClickEvent(anchor, `/location/${wide}/${local}`);

  return el("article", { className: "city-item" }, anchor);
}
