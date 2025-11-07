import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ToolbarButton: React.FC<{ onClick: () => void, children: React.ReactNode, title: string, className?: string }> = ({ onClick, children, title, className = '' }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 ${className}`}
      onMouseDown={e => e.preventDefault()} // Prevent editor from losing focus
    >
      {children}
    </button>
  );

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const handleExecCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div className="toolbar p-1 bg-slate-200 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 flex flex-wrap items-center gap-1">
        <ToolbarButton onClick={() => handleExecCommand('bold')} title="Bold">
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => handleExecCommand('underline')} title="Underline">
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => handleExecCommand('italic')} title="Italic">
          <span className="italic">I</span>
        </ToolbarButton>
        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
        <ToolbarButton onClick={() => handleExecCommand('justifyLeft')} title="Align Left">L</ToolbarButton>
        <ToolbarButton onClick={() => handleExecCommand('justifyCenter')} title="Align Center">C</ToolbarButton>
        <ToolbarButton onClick={() => handleExecCommand('justifyRight')} title="Align Right">R</ToolbarButton>
         <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
        <ToolbarButton onClick={() => handleExecCommand('insertUnorderedList')} title="Unordered List">UL</ToolbarButton>
        <ToolbarButton onClick={() => handleExecCommand('insertOrderedList')} title="Ordered List">OL</ToolbarButton>
      </div>
      <div
        contentEditable
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        className="w-full min-h-[200px] p-4 focus:outline-none prose dark:prose-invert max-w-none bg-white dark:bg-slate-900/50 rounded-b-lg"
        data-placeholder={placeholder}
      ></div>
    </div>
  );
};

export default RichTextEditor;
