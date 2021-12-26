import { addClickEvent, updatePath } from "../router";
import WordAutoComplete from "./WordAutoComplete";
import DropDown from "./DropDown";
import el from "../utils/dom";
import "../../css/GlobalNavigation.css";

export default function GlobalNavigation() {
  const logoAnchor = el("a", {}, el("img", { src: "/static/images/logo.svg" }));
  const createBtn = el("a", { className: "gnb__add-post icon-add_a_photo" });
  const loginAnchor = el("a", { className: "gnb__login" }, "로그인");
  const profileAnchor = window.user?.token
    ? el(
        "button",
        {
          className: "gnb__profile",
          events: {
            click: () => document.body.append(DropDown()),
          },
        },
        el("img", { src: window.user.profile }),
      )
    : loginAnchor;

  addClickEvent(logoAnchor, "/");
  addClickEvent(createBtn, "/add");
  addClickEvent(loginAnchor, "/login");

  return el(
    "nav",
    { className: "gnb" },
    el(
      "div",
      { className: "gnb__inner" },

      el("div", { className: "gnb__logo gnb__expand" }, logoAnchor),
      WordAutoComplete({
        formAttr: {
          className: "search search--gnb",
        },
        inputAttr: {
          type: "text",
          id: "search",
          name: "search",
          placeholder: "지역을 검색해보세요.",
          list: "address",
          className: "search__input search__input--gnb",
          autocomplete: "off",
        },
        onSubmit: () => {
          const input = document.querySelector(".search__input");
          if (!input || !(input instanceof HTMLInputElement)) return;
          const [wideAddr, localAddr] = input.value.split(" ");

          updatePath(`/location/${wideAddr}/${localAddr}`);
        },
      }),
      el(
        "div",
        { className: "gnb__expand" },
        window.user?.token && createBtn,
        el(
          "div",
          {
            className: `gnb__profile-image ${
              window.user?.token ? "signed-in" : "signed-out"
            }`,
          },
          profileAnchor,
        ),
      ),
    ),
  );
}
