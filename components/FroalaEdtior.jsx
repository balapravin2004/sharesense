"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Froala to avoid SSR issues in Next.js
const FroalaEditorComponent = dynamic(
  () => import("react-froala-wysiwyg").then((mod) => mod.default),
  { ssr: false }
);

export default function FroalaEditor({ value, onChange, editorHeight }) {
  // Load Froala styles and JS in the browser
  useEffect(() => {
    require("froala-editor/css/froala_style.min.css");
    require("froala-editor/css/froala_editor.pkgd.min.css");
    require("froala-editor/css/plugins.pkgd.min.css");
    require("font-awesome/css/font-awesome.css");
    require("froala-editor/js/plugins.pkgd.min.js");
  }, []);

  const config = {
    placeholderText: "Start typing here...",
    charCounterCount: true,
    height: editorHeight || 200,
    quickInsertEnabled: false,
    toolbarButtons: [
      [
        "fullscreen",
        "undo",
        "redo",
        "fontSize",
        "formatOL", // ordered list
        "align", // justify left, center, right
        "insertImage",
        "print",
        "selectAll",
        "help",
      ],
    ],
    pluginsEnabled: [
      "fullscreen",
      "charCounter",
      "fontSize",
      "align",
      "lists",
      "image",
      "print",
      "help",
    ],
    imageUploadURL: "/api/froala/upload",
    imageUploadMethod: "POST",
    events: {
      "save.before": function (html) {
        return false;
      },
      "image.inserted": function (img) {
        console.log("Image inserted:", img[0].src);
      },
      "image.error": function (error) {
        console.error("Image upload error:", error);
      },
    },
  };

  return (
    <FroalaEditorComponent
      tag="textarea"
      model={value}
      onModelChange={onChange}
      config={config}
    />
  );
}
