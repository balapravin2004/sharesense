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
    height: 200, // Custom height
    quickInsertEnabled: false, // Disable Quick Insert
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
      "quote", // QuickInsert removed here
      "save",
      "specialCharacters",
      "table",
      "url",
      "video",
      "wordPaste",
    ],
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
