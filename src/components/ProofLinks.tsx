"use client";

import { useRef, useState } from "react";

export function proofUrls(value = "") {
  return [...new Set(value.split(/\r?\n/).map(line => line.trim()).filter(Boolean))];
}

export function ProofLinks({ value }: { value?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<{ url: string; label: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const urls = proofUrls(value || "").filter(url => /^https?:\/\//i.test(url));
  if (!urls.length) return null;
  return (
    <div className="my-1 flex flex-wrap items-center gap-2">
      {urls.map((url, index) => {
        const label = `Minh chứng ${index + 1}`;
        if (!/\.(?:jpe?g|jfif|png|webp|gif|avif|heic|heif|bmp|tiff?|ico|svg)(?:[?#]|$)/i.test(url)) {
          return <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">Xem tệp {index + 1}</a>;
        }
        const thumbnail = url.replace(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?=v\d+\/)/, "$1c_fill,w_160,h_160,f_auto,q_auto/");
        return (
          <button key={url} type="button" aria-label={`Phóng to ảnh minh chứng ${index + 1}`} aria-haspopup="dialog"
            className="h-16 w-16 cursor-zoom-in overflow-hidden rounded-lg border border-slate-300 bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-700"
            onClick={() => {
              setSelected({ url, label });
              setFailed(false);
              dialog.current?.showModal();
            }}>
            <img src={thumbnail} alt={label} loading="lazy" className="h-full w-full object-cover" />
          </button>
        );
      })}
      <dialog ref={dialog} aria-label={selected?.label || "Ảnh minh chứng"}
        className="fixed inset-0 m-auto max-h-[95dvh] max-w-[95vw] rounded-xl bg-white p-3 shadow-xl backdrop:bg-black/75"
        onClose={() => setSelected(null)}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        {selected && <div>
          <div className="mb-2 flex items-center justify-between gap-6 text-sm font-bold">
            <span>{selected.label}</span>
            <button type="button" onClick={() => dialog.current?.close()} className="rounded px-3 py-2 text-teal-800 hover:bg-slate-100">Đóng</button>
          </div>
          {failed ? <p role="alert">Không thể hiển thị ảnh này.</p> :
            <img src={selected.url.replace(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?=v\d+\/)/, "$1f_auto/")} alt={selected.label} onError={() => setFailed(true)} className="mx-auto max-h-[78dvh] max-w-full object-contain" />}
        </div>}
      </dialog>
    </div>
  );
}
