"use client";
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const apiKey = process.env.NEXT_PUBLIC_TINY_MCE_API_KEY;

const editorConfig = {
  height: 230,
  menubar: false,
  plugins: "lists link fullscreen code",
  toolbar:
    "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | fullscreen | code",
  content_style:
    "body { font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; font-size:14px }",
};

const TinyEditor = () => {
  return (
    <>
      <Editor apiKey={apiKey} init={editorConfig} />
    </>
  );
};

export default TinyEditor;
