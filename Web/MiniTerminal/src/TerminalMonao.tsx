import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import {  ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import _ from 'lodash';

type IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

const StyleContainer = styled.div`
    .resize-box {
        display: inline-block;
    }
    .resize-handle {
        position: absolute;
        width: 5px;
        right: 0; top: 0; bottom: 0;
        border-right: 2px solid #070707;
        border-left: 1px solid #141414;
        cursor: ew-resize ;
        :hover {
            background-color: #007fd4;
            border-left: 1px solid #007fd4;
            cursor: ew-resize ;
            cursor: col-resize;
        }
    }
`;

const EditorContainer = styled.div<{width: number, height: number}>`
  width: ${props=>props.width}px;
  padding: 3px 3px 0 3px;
  display: inline-block;
  height: ${props=>props.height}px;
`;

export interface ITerminalOption {
    prompt: string,
    w: number,
    h: number,
}

export interface ITerminalInMonacoComProps {
    onExec: (cmd: string)=>Promise<string>,
    cmdProcess: (cmd: string)=>string,
    option: ITerminalOption,
}

const keyCtrlString = `
--[[

Ctrl + Enter : 执行指令
Ctrl + UpArrow : 上一条指令
Ctrl + DownArrow : 下一条指令

--]]

`;

export const TerminalInMonacoCom: React.FC<ITerminalInMonacoComProps> = (props: ITerminalInMonacoComProps) => {
    const barSize = 5;

    const [dom, setDom] = useState(undefined as unknown as HTMLElement);
    const [termDom, setTermDom] = useState(undefined as unknown as HTMLElement);
    const [editor, setEditor] = useState(undefined as unknown as IStandaloneCodeEditor);
    const [resizeDimension, setResizeDimension] = useState({width: 0, height: 0});
    const [eidtorDimension, setEditorDimension] = useState({width: 0, height: 0});
    const [terminalDimension, setterminalDimension] = useState({width: 0, height: 0});
    const [terminal, setTerminal] = useState(
        undefined as unknown as IStandaloneCodeEditor
    );

    const [historyCmd, setHistoryCmd] = useState([] as string[]);
    const stashCmdRef = useRef('');
    const terminalRef = useRef(terminal);
    const cmdHistoryRef = useRef(historyCmd);
    const activeCmdIndexRef = useRef(0);
    const optionsRef = useRef(props.option);

    const commonConfig = {
        language: 'lua',
        theme: 'vs-dark',
        minimap: {
            enabled: false,
        },
        formatOnType: true,
        scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,
    
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            arrowSize: 30
        }
    };

    useEffect(()=>{
        const preOption = optionsRef.current;
        optionsRef.current = props.option;
        const totalW = optionsRef.current.w;

        setEditorDimension(pre=>{
            let percent = pre.width / preOption.w;
            if (percent == 0) {
                percent = 0.45;
            }
            setResizeDimension({
                width: totalW * percent,
                height: optionsRef.current.h
            });
            return {
                width: totalW * percent,
                height: optionsRef.current.h
            };
        });
        setterminalDimension(pre=>{
            let percent = pre.width / preOption.w;
            if (percent == 0) {
                percent = 0.55;
            }
            return {
                width: totalW * percent - barSize, // 需要减去resizebar的宽度
                height: optionsRef.current.h
            };
        });
    }, [props.option]);

    useEffect(() => {
        if (!dom) {
            return;
        }
        const config = _.merge({}, commonConfig, {
            value: '',
        });
        const editor = monaco.editor.create(dom, config);
        setEditor(editor);
    }, [dom]);

    useEffect(() => {
        initKeyBinding();
    }, [editor]);

    useEffect(() => {
        if (!termDom) {
            return;
        }
        const config = _.merge({}, commonConfig, {
            value: '---welcome to console----\n' + keyCtrlString + optionsRef.current.prompt,
            readOnly: true,
            lineNumbers: 'off' as const, 
        });
        const monacoTerminal = monaco.editor.create(termDom, config);
        setTerminal(monacoTerminal);
        terminalRef.current = monacoTerminal;
    }, [termDom]);

    function initKeyBinding () {
        if (!editor) {
            return;
        }
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
            () => {
                const terminal = terminalRef.current;
                let line = terminal.getModel()?.getLineCount();
                if (!line) {
                    line = 0;
                }
                let cmd = editor.getValue();
                cmd = cmd.trim();
                cmd = props.cmdProcess(cmd);
                onExec(cmd);
                pushCmd();
                editor.setValue('');
                stashCmdRef.current = '';
            }
        );

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.UpArrow,
            () => {
                if (stashCmdRef.current == '') {
                    stashCmdRef.current = editor.getValue();
                }
                const cmdHistory = cmdHistoryRef.current;
                const activeCmdIndex = activeCmdIndexRef.current;
                if (cmdHistory.length < 1 || activeCmdIndex < 1) {
                    return;
                }
                editor.setValue(cmdHistory[activeCmdIndex - 1]);
                --activeCmdIndexRef.current;
            }
        );

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.DownArrow,
            () => {
                if (stashCmdRef.current == '') {
                    stashCmdRef.current = editor.getValue();
                }
                const cmdHistory = cmdHistoryRef.current;
                const activeCmdIndex = activeCmdIndexRef.current;
                let cmd = '';
                if (cmdHistory.length > 0 && activeCmdIndex < cmdHistory.length - 1) {
                    cmd = cmdHistory[activeCmdIndex + 1];
                    ++activeCmdIndexRef.current;
                } else {
                    cmd = stashCmdRef.current;
                }
                editor.setValue(cmd);
            }
        );
    }

    function pushCmd () {
        const cmd = editor.getValue();
        if (cmd == '' || cmd == undefined) {
            return cmd;
        }

        setHistoryCmd((preCmd) => {
            const res = [...preCmd, cmd];
            cmdHistoryRef.current = res;
            activeCmdIndexRef.current = res.length;
            console.log('cmd', cmd, activeCmdIndexRef.current);
            return res;
        });
        return cmd;
    }

    function scrollToBottom () {
        const terminal = terminalRef.current;
        const textModel = terminal.getModel();
        if (textModel) {
            terminal.revealLineInCenter(textModel.getLineCount());
            console.log('scroll', textModel.getLineCount());
        }
    }

    function writeToResult (value: string) {
        const terminal = terminalRef.current;
        let line = terminal.getModel()?.getLineCount();
        if (!line) {
            line = 0;
        }

        const range = new monaco.Range(line + 1, 1, line + 1, 1 + value.length);
        const id = { major: 1, minor: 1 };
        const op = {
            identifier: id,
            range: range,
            text: value,
            forceMoveMarkers: true,
        };

        
        terminal.getModel()?.pushEditOperations(null, [op], () => null);
    }

    async function onExec (cmd: string) {
        console.log(cmd, 'cmd');
        writeToResult(cmd + '\n');
        scrollToBottom();
        const res = await props.onExec(cmd);
        const propsConfig = optionsRef.current;
        writeToResult('-->>>>>执行结果：\n');
        writeToResult(res);        
        writeToResult('\n' + propsConfig.prompt);
    }

    function onResize (e: any, data: ResizeCallbackData) {
        const option = optionsRef.current;
        const totalW = option.w;
        const leftColW = data.size.width;
        editor.layout({
            width: data.size.width,
            height: data.size.height,
        });
        terminal.layout({
            width: totalW - data.size.width - 5,
            height: data.size.height,
        });

        setEditorDimension({
            width: leftColW,
            height: optionsRef.current.h
        });
        setterminalDimension({
            width: totalW - leftColW - barSize, // 需要减去resizebar的宽度
            height: optionsRef.current.h
        });
    }

    return (<StyleContainer>
        <ResizableBox className='resize-box' axis='x'
            handle={<div className='resize-handle' />} 
            width={resizeDimension.width} height={resizeDimension.height} 
            minConstraints={[props.option.w * 0.2, props.option.h]}
            maxConstraints={[props.option.w * 0.8, props.option.h]}
            onResize={onResize}>
            <EditorContainer width={eidtorDimension.width} height={eidtorDimension.height} ref={(ref) => setDom(ref as HTMLElement)}></EditorContainer>
        </ResizableBox>
        <EditorContainer width={terminalDimension.width} height={terminalDimension.height} ref={(ref) => setTermDom(ref as HTMLElement)} ></EditorContainer>
    </StyleContainer>);
};
