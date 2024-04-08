/*
 * @Author wanghaobing
 * @Date 2024-04-08
 * @FilePath /js-sdk-learn-demo/src/index.tsx
 * @Description 
 * Copyright (c) 2024 by YUNMAI, All Rights Reserved.
 */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { bitable, FieldType, ICurrencyFieldMeta, IFieldMeta, IViewMeta } from '@lark-base-open/js-sdk';
import { Button } from 'antd';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <LoadApp />
    </React.StrictMode>
)

function LoadApp() {
    const [fieldList, setFieldList] = useState<IFieldMeta[]>([])
    const [curView, setCurView] = useState<IViewMeta>();
    const [selectFieldId, setSelectFieldId] = useState<string>();
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const fn = async () => {
            const table = await bitable.base.getActiveTable();
            const tableName = await table.getName();
            addLog(tableName);

            const viewList = await table.getViewMetaList();
            // addLog(viewList.map(v => v.name).join(','));
            const view = viewList[0];
            addLog(`view name: ${view.name}, id: ${view.id}`);
            setCurView(view);

            const fieldMetaList = await table.getFieldMetaList();
            setFieldList(fieldMetaList);
            addLog(fieldMetaList.map(meta => meta.name).join(','));
        };
        fn();
    }, []);

    const formatFieldMetaList = (metaList: ICurrencyFieldMeta[]) => {
        return metaList.map(meta => ({ label: meta.name, value: meta.id }));
    };

    const conver2jsFile = async () => {
        const table = await bitable.base.getActiveTable();
        const tableName = await table.getName();
        setLogs([]);
        addLog(tableName);
        const fieldMetaList = await table.getFieldMetaListByType<ICurrencyFieldMeta>(FieldType.Currency);
        // console.log('fieldMetaList', fieldMetaList);

        const ids = await table.getRecordIdList();
        addLog(ids.join(','));
        setCurView(curView);
    }

    const export2jsFile = async () => {
        addLog('------开始导出');
        
        addLog('------导出完成');
    }

    const addLog = (log: string) => {
        let message = new Date().toLocaleString() + ': ' + log;
        logs.push(message);
        setLogs(logs);
    }

    const getLogMessage = () => {
        // return JSON.stringify(logs);
        return logs.join(' ');
    }

    return <div>
        <div style={{ margin: 10 }}>
            <div>{`将多维表格的内容导出为 React-Native js 文件`}</div>
            <div>{`当前字符串表格：${curView?.name}, ${curView?.id}`}</div>
        </div>
        <div style={{ margin: 10 }}>
            <Button style={{ marginLeft: 10 }} onClick={conver2jsFile}>转化</Button>
            <Button style={{ marginLeft: 10 }} onClick={export2jsFile}>导出</Button>
        </div>
        <div style={{ margin: 10 }}>
            <div style={{ fontSize: 16 }}>{getLogMessage()}</div>
        </div>
    </div>
}