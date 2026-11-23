// The events table stores rich content and its cover in the description column.
export function packEventDescription(cover: string, html: string, fallback: string) {
  if (!cover && !html) return fallback;
  const wrapper = document.createElement("div");
  wrapper.dataset.eventContent = "";
  wrapper.innerHTML = html;
  if (cover) {
    const image = document.createElement("img");
    image.dataset.eventCover = "";
    image.src = cover;
    wrapper.prepend(image);
  }
  return wrapper.outerHTML;
}

export function eventWithImages<T extends { description?: string; cover_image?: string; description_html?: string }>(event: T) {
  if (!event.description?.startsWith("<div data-event-content=")) return event;
  const doc = new DOMParser().parseFromString(event.description, "text/html");
  const wrapper = doc.body.firstElementChild!;
  const cover = wrapper.querySelector("img[data-event-cover]");
  const cover_image = cover?.getAttribute("src") || "";
  cover?.remove();
  return { ...event, cover_image, description_html: wrapper.innerHTML, description: wrapper.textContent };
}
