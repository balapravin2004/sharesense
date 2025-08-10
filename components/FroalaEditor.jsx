"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically load editor to avoid SSR issues
const FroalaEditorComponent = dynamic(
  () => import("react-froala-wysiwyg").then((mod) => mod.default),
  { ssr: false }
);

// Import Froala styles
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/plugins.pkgd.min.css";
import "font-awesome/css/font-awesome.css";

// Import Froala JS plugins
import "froala-editor/js/plugins.pkgd.min.js";

export default function FroalaEditorWrapper() {
  const [content, setContent] = useState("");

  const config = {
    placeholderText: "Start typing here...",
    charCounterCount: true,
    height: 200,
    quickInsertEnabled: false,
    toolbarButtons: [
      [
        "fullscreen",
        "undo",
        "redo",
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "subscript",
        "superscript",
        "fontFamily",
        "fontSize",
        "color",
        "paragraphFormat",
        "align",
        "formatOL",
        "formatUL",
        "outdent",
        "indent",
        "quote",
        "insertLink",
        "insertImage",
        "insertVideo",
        "insertFile",
        "insertTable",
        "emoticons",
        "specialCharacters",
        "embedly",
        "html",
        "print",
        "help",
        "codeView",
        "selectAll",
        "clearFormatting",
        "save", // Added Save button in toolbar
      ],
    ],
    pluginsEnabled: [
      "align",
      "charCounter",
      "codeBeautifier",
      "codeView",
      "colors",
      "draggable",
      "embedly",
      "emoticons",
      "entities",
      "file",
      "fontFamily",
      "fontSize",
      "fullscreen",
      "help",
      "image",
      "imageManager",
      "inlineClass",
      "inlineStyle",
      "lineBreaker",
      "lineHeight",
      "link",
      "lists",
      "paragraphFormat",
      "paragraphStyle",
      "print",
      "quote",
      "save",
      "specialCharacters",
      "table",
      "url",
      "video",
      "wordPaste",
    ],
    events: {
      "save.before": function (html) {
        console.log("Saving content:", html);
        alert("Content saved! Check console log.");
        // Example: send content to backend API
        // fetch("/api/save", { method: "POST", body: JSON.stringify({ content: html }) })
        return false; // Prevent Froala's default save behavior
      },
    },
  };

  return (
    <FroalaEditorComponent
      tag="textarea"
      model={content}
      onModelChange={setContent}
      config={config}
    />
  );
}
