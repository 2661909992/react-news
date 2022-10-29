import React, {useState,useEffect} from 'react';
import { convertToRaw, ContentState,EditorState } from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './NewsEditor.css'

export default function NewsEditor(props) {

    const [editorState,setEditorState] = useState('');

    useEffect(() =>{
        if (props.editorContent){
            const contentBlock = htmlToDraft(`${props.editorContent}`);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                setEditorState(editorState);
            }
        }
    },[props.editorContent])

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => {setEditorState(editorState)}}
                onBlur={()=>{props.getEditorContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))}}
            />
        </div>
    );
}