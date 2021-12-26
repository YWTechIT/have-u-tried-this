import el from "../utils/dom";
import Carousel from "../components/Carousel";
import LikesCount from "../components/LikesCount";
import Modal from "../components/Modal";
import CommentList from "../components/CommentList";
import { getPostData } from "../api";
import Loader from "../components/Loader";
import { addClickEvent } from "../router";
import { deletePost, editPostData } from "../api";
import { formatToReadableTime } from "../utils/time";
import { removeBackSpace, removeLineBreak } from "../utils/string";
import { getPaths } from "../utils/location";
import "../../css/PostDetails.css";

function renderPostDetails(data: PostDetailResponse) {
  const {
    _id,
    title,
    author,
    contents,
    photos,
    likes,
    location,
    createdAt,
    updatedAt,
  } = data.post;

  const locationAnchor = el(
    "a",
    {},
    `${location.wideAddr} ${location.localAddr}`,
  );
  const likesElt = LikesCount({
    type: "button",
    liked: data.isLiked,
    likes,
    postId: _id,
  });
  const titleElt = el("h2", { className: "details__title" }, title);
  const descElt = el("p", { className: "details__desc" }, contents);
  const editing = {
    status: false,
    title: "",
    desc: "",
  };
  const handleEditButtonClick = async (event: MouseEvent) => {
    const { target } = event;
    const nextStatus = !editing.status;

    if (!target || !(target instanceof HTMLElement)) return;

    titleElt.contentEditable = `${nextStatus}`;
    descElt.contentEditable = `${nextStatus}`;

    if (editing.status) {
      const inputtedTitle = removeBackSpace(
        removeLineBreak(titleElt.innerText.trim() || editing.title),
      );
      const inputtedDesc = removeLineBreak(
        descElt.innerText.trim() || editing.desc,
      );

      // End editing
      target.className = "icon-create";
      // Remove Attributes
      titleElt.removeAttribute("role");
      titleElt.classList.remove("details__title--editing");
      descElt.removeAttribute("role");
      descElt.classList.remove("details__desc--editing");

      const edited = await editPostData(_id, {
        title: inputtedTitle,
        contents: inputtedDesc,
      });

      if (edited && !("error" in edited)) {
        // Fill text with valid string
        titleElt.innerText = inputtedTitle;
        descElt.innerText = inputtedDesc;

        // Update list item
        const element = document
          .querySelector(`a[href$="${_id}"]`)
          ?.querySelector(".post-item__title");

        if (element && element instanceof HTMLElement) {
          element.innerText = inputtedTitle;
          window.resizeHandler();
        }
      }
    } else {
      // Start editing
      target.className = "icon-save";
      editing.title = titleElt.innerText;
      editing.desc = descElt.innerText;
      titleElt.setAttribute("role", "textbox");
      titleElt.classList.add("details__title--editing");
      descElt.setAttribute("role", "textbox");
      descElt.classList.add("details__desc--editing");
      titleElt.focus();
    }

    editing.status = nextStatus;
  };
  const editButtons =
    author._id === window.user?.id
      ? [
          el("button", {
            events: {
              click: handleEditButtonClick,
            },
            className: "icon-create",
          }),
          el("button", {
            events: {
              click: () => {
                const app = document.getElementById("app");
                app?.append(
                  Modal({
                    title: "삭제하면 되돌릴 수 없어요!",
                    content: "그래도 삭제하시겠습니까?",
                    callback: async () => {
                      const deleted = await deletePost(_id);

                      if (deleted && !("error" in deleted)) {
                        window.history.back();
                        // Remove list item
                        const element = document.querySelector(
                          `a[href$="${_id}"]`,
                        )?.parentElement;

                        if (element) {
                          element.remove();
                          window.resizeHandler();
                        }
                      }
                    },
                  }),
                );
              },
            },
            className: "icon-delete",
          }),
        ]
      : [];

  // Location
  addClickEvent(
    locationAnchor,
    `/location/${location.wideAddr}/${location.localAddr}`,
  );

  // Buttons
  likesElt.classList.add("details__rate");

  return el(
    "fragment",
    {},
    el(
      "nav",
      { className: "details-nav" },
      el(
        "button",
        {
          events: {
            click: [() => window.history.back(), { once: true }],
          },
        },
        el("i", {
          className: "icon-arrow_forward_ios",
        }),
      ),
    ),
    Carousel(photos),
    el(
      "div",
      { className: "small-container details" },
      el(
        "header",
        { className: "details__header" },
        el(
          "div",
          { className: "details__date" },
          el("i", { className: "icon-calendar_today" }),
          el(
            "time",
            { dateTime: `${updatedAt || createdAt}` },
            formatToReadableTime(`${updatedAt || createdAt}`),
          ),
        ),
        el(
          "div",
          { className: "details__location" },
          el("i", { className: "icon-location_on" }, locationAnchor),
        ),
        el("div", { className: "details__buttons" }, likesElt, ...editButtons),
        titleElt,
        el(
          "div",
          { className: "details__author" },
          el("img", { src: author.profile }),
          el("span", {}, `by ${author.lastName} ${author.firstName}`),
        ),
      ),
      descElt,
      CommentList(_id),
    ),
  );
}

export default function PostDetails(fixed: boolean) {
  const loader = Loader();
  const article = el("article", {});
  const container = el(
    "div",
    {
      className: fixed ? "fixed-container" : "",
      events: {
        click: fixed
          ? (event: MouseEvent) => {
              if (event.target === container) window.history.back();
            }
          : null,
      },
    },
    loader,
    article,
  );
  const postId = getPaths().pop();

  if (!postId) return container;

  getPostData(postId).then((data) => {
    if (!("error" in data)) {
      loader.remove();
      article.append(renderPostDetails(data));
    }
  });

  return container;
}
