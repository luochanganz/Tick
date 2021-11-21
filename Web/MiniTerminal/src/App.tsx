import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { exec } from './MockServer';
import { TerminalInMonacoCom } from './TerminalMonao';

const App: React.FC = () => {

    // 执行命令，正式场景中应该会向后端发送指令
    async function onExec (cmd: string) {
        const res = await exec(cmd);

        return res;
    }

    function cmdPreProcess(cmd: string) {
        return cmd;
    }

    return (<div>
        <TerminalInMonacoCom cmdProcess={cmdPreProcess} onExec={onExec} option={{
                prompt: "$ ",
                w: 1000,
                h: 500}} />
    </div>);
};

export default App;
