import el from "../utils/dom";
import "../../css/Modal.css";

export default function Modal({
  title,
  content,
  callback,
}: {
  title: string;
  content: string;
  callback: () => void;
}) {
  const backdrop = el("div", {
    className: "backdrop",
    events: { click: () => backdrop.remove() },
  });

  backdrop.append(
    el(
      "div",
      { className: "modal" },
      el(
        "div",
        { className: "modal__content" },
        el(
          "div",
          { className: "modal__title" },
          el("div", {}, title),
          el("div", {}, content),
        ),
        el(
          "div",
          { className: "modal__button" },
          el(
            "button",
            { events: { click: () => backdrop.remove() } },
            "아니요, 안할래요",
          ),
          el(
            "button",
            {
              events: {
                click: callback,
              },
            },
            "네, 해주세요",
          ),
        ),
      ),
    ),
  );

  return backdrop;
}
