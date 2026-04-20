import React from 'react';
import JoditEditor from 'jodit-react';

const editorButtons = [
    "bold",
    "underline",
    "italic",
    "align",
    "ul",
    "ol",
    "outdent",
    "indent",
    "fontsize",
    "paragraph",
    "brush"
];

const editorConfig = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    defaultTextAlignment: 'left',
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    buttons: editorButtons,
    width: 'auto',
    height: 350,
    placeholder:'',
    colorPickerDefaultTab: 'text',
    style: {
        color: 'black',
        textAlign: 'left',
    },
    highlight: {
        exec: function (editor) {
            const selection = editor.selection.save();
            const selectedText = editor.selection.text();

            if (selectedText) {
                const newNode = editor.create.inside.text(selectedText);
                newNode.style.backgroundColor = 'yellow';
            }

            editor.selection.restore(selection);
        },
        tooltip: 'Highlight Text',
    },
};

const EditorComponent = ({ placeholder, desc, onEditorChange, className, style }) => {
    const handleEditorChange = (value) => {
        onEditorChange && onEditorChange(value);
    }

    return (
        <JoditEditor
            className={className}
            style={{ ...style, textAlign: 'left' }}
            placeholder={placeholder}
            value={desc}
            onBlur={handleEditorChange}
            config={editorConfig}
        />
    );
}

export default EditorComponent;
