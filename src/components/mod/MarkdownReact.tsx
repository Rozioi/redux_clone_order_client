import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownReactProps {
  content: string;
}

 const MarkdownReact: React.FC<MarkdownReactProps> = ({ 
  content
}) => {
  return (
    <ReactMarkdown>
      {content}
    </ReactMarkdown>
  );
};
 
export default MarkdownReact;