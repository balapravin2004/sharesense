"use client";
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const apiKey = process.env.NEXT_PUBLIC_TINY_MCE_API_KEY;

const freePlugins = [
  "anchor",
  "autolink",
  "autoresize",
  "autosave",
  "charmap",
  "code",
  "codesample",
  "directionality",
  "emoticons",
  "fullscreen",
  "help",
  "image",
  "importcss",
  "insertdatetime",
  "link",
  "lists",
  "advlist",
  "media",
  "nonbreaking",
  "pagebreak",
  "preview",
  "quickbars",
  "save",
  "searchreplace",
  "table",
  "visualblocks",
  "visualchars",
  "wordcount",
].join(" ");

const editorConfig = {
  height: 300,
  menubar: true,
  plugins: freePlugins,
  toolbar:
    "undo redo | bold italic underline strikethrough | " +
    "alignleft aligncenter alignright alignjustify | " +
    "bullist numlist | outdent indent | advlist | " +
    "link anchor image media | table | " +
    "codesample code | charmap emoticons | " +
    "insertdatetime preview pagebreak | " +
    "searchreplace fullscreen | wordcount save",

  quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote",

  autoresize_min_height: 300,
  autoresize_max_height: 800,

  content_style:
    "body { font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; font-size:14px }",
  autosave_ask_before_unload: true,
  autosave_interval: "30s",
  insertdatetime_formats: ["%Y-%m-%d %H:%M"],
};

const TinyEditor = () => {
  return (
    <>
      <Editor apiKey={apiKey} init={editorConfig} />;
    </>
  );
};

export default TinyEditor;
