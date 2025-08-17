// components/QuillEditor.jsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Client-only editor to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/**
 * Props:
 *  - value: string (HTML) OR stringified JSON { html, delta } OR Delta object OR { delta: ... }
 *  - onChange: function(stringifiedJson) => void
 *
 * onChange will be called with JSON.stringify({ html, delta }).
 */
export default function QuillEditor({ value = "", onChange }) {
  const quillRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Toolbar config
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }], // toolbar uses bullet *value* (OK)
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  // IMPORTANT: do NOT put "bullet" here — keep "list"
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list", // correct format name
    "align",
    "link",
    "image",
    "video",
  ];

  useEffect(() => setMounted(true), []);

  // Helper to get Quill instance from ref
  const getQuill = () =>
    quillRef.current && typeof quillRef.current.getEditor === "function"
      ? quillRef.current.getEditor()
      : null;

  // Force LTR on editor root to fix backward typing / bidi problems
  useEffect(() => {
    if (!mounted) return;
    const editor = getQuill();
    if (!editor) return;
    try {
      const root = editor.root;
      if (root) {
        root.setAttribute("dir", "ltr");
        root.style.unicodeBidi = "normal";
        root.style.textAlign = "left";
      }
      // also ensure container if present
      const container = root && root.closest && root.closest(".ql-editor");
      if (container) {
        container.style.direction = "ltr";
        container.style.unicodeBidi = "normal";
      }
    } catch (err) {
      // ignore if structure differs
      // console.warn("Could not force LTR:", err);
    }
  }, [mounted]);

  // Sync incoming `value` into the editor (supports JSON, HTML, or Delta)
  useEffect(() => {
    if (!mounted) return;
    const editor = getQuill();
    if (!editor) return;

    const setDelta = (delta) => {
      try {
        editor.setContents(delta);
      } catch (e) {
        console.warn("Failed to set delta contents:", e);
      }
    };

    if (value == null || value === "") {
      try {
        editor.setContents({ ops: [] });
      } catch {}
      return;
    }

    if (typeof value === "object") {
      if (value.delta) {
        setDelta(value.delta);
        return;
      } else if (value.ops || Array.isArray(value)) {
        setDelta(value);
        return;
      } else {
        return;
      }
    }

    if (typeof value === "string") {
      // Try parse JSON first
      try {
        const parsed = JSON.parse(value);
        if (parsed && parsed.delta) {
          setDelta(parsed.delta);
          return;
        }
        if (parsed && parsed.html) {
          try {
            const converted = editor.clipboard.convert(parsed.html);
            setDelta(converted);
            return;
          } catch (e) {
            editor.root.innerHTML = parsed.html || "";
            return;
          }
        }
      } catch (err) {
        // not JSON, continue
      }

      // Treat as raw HTML
      try {
        const converted = editor.clipboard.convert(value);
        setDelta(converted);
      } catch (err) {
        try {
          editor.root.innerHTML = value;
        } catch (e) {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, mounted]);

  // onChange returns JSON string {"html", "delta"}
  const handleChange = useCallback(
    (content, delta, source, editorParam) => {
      const editor =
        editorParam && typeof editorParam.getContents === "function"
          ? editorParam
          : getQuill();

      if (!editor) {
        onChange &&
          onChange(JSON.stringify({ html: content || "", delta: null }));
        return;
      }

      try {
        const fullDelta = editor.getContents();
        const html =
          (editor.root && typeof editor.root.innerHTML === "string"
            ? editor.root.innerHTML
            : content) || "";
        onChange && onChange(JSON.stringify({ html, delta: fullDelta }));
      } catch (err) {
        onChange &&
          onChange(JSON.stringify({ html: content || "", delta: null }));
      }
    },
    [onChange]
  );

  if (!mounted) return <div style={{ minHeight: 350 }}>Loading editor…</div>;

  return (
    <div style={{ minHeight: 350 }}>
      <ReactQuill
        ref={quillRef}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder="Start typing here..."
        style={{ height: "350px" }}
      />
    </div>
  );
}
