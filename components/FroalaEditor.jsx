"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically load editor to avoid SSR issues
const FroalaEditorComponent = dynamic(
  () => import("react-froala-wysiwyg").then((mod) => mod.default),
  { ssr: false }
);

export default function FroalaEditorWrapper() {
  const [content, setContent] = useState("");

  // Import Froala styles and JS only in the browser
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
        "save",
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
        return false; // Prevent default save
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
