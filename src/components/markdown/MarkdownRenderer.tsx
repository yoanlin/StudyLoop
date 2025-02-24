import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Support GitHub-Flavored Markdown
import rehypeRaw from "rehype-raw"; // Allow rendering HTML inside Markdown

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
