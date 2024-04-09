/*
 * @Author wanghaobing
 * @Date 2024-04-08
 * @FilePath /js-sdk-learn-demo/src/index.tsx
 * @Description https://lark-base-team.github.io/js-sdk-docs/zh/start/core
 * Copyright (c) 2024 by YUNMAI, All Rights Reserved.
 */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { bitable, FieldType, ICurrencyFieldMeta, IFieldMeta, ITable, IViewMeta } from '@lark-base-open/js-sdk';
import { Button } from 'antd';
import TableComponent from './table';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <LoadApp />
    </React.StrictMode>
)

function LoadApp() {

    const [fieldList, setFieldList] = useState<IFieldMeta[]>([])
    const [curView, setCurView] = useState<IViewMeta>();
    const [recordIds, setRecordIds] = useState<string[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [logString, setLogString] = useState<string>('');
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fn = async () => {
            const table = await bitable.base.getActiveTable();
            const tableName = await table.getName();
            // addLog(tableName);

            const viewList = await table.getViewMetaList();
            // addLog(viewList.map(v => v.name).join(','));
            const view = viewList[0];
            setCurView(view);
            // addLog(`view name: ${view.name}, id: ${view.id}`);

            const fieldMetaList = await table.getFieldMetaList();
            setFieldList(fieldMetaList);

            let list = [];
            fieldMetaList.map(meta => {
                let data = {
                    name: meta.name,
                    value: meta.id,
                }
                list.push(data);
            })
            setTableData(list);
            // addLog(JSON.stringify(list));

            const ids = await table.getRecordIdList();
            setRecordIds(ids);
            addLog(`record count: ${ids.length}`);
        };
        fn();
    }, []);

    const formatFieldMetaList = (metaList: ICurrencyFieldMeta[]) => {
        return metaList.map(meta => ({ label: meta.name, value: meta.id }));
    };

    const conver2jsFile = async () => {
        cleanLog();
        // addLog(`record count: ${recordIds.length}`);

        const table = await bitable.base.getActiveTable();
        tableData.map(async (filed) => {
            if (filed.name == 'SourceID') {
                return;
            }
            addLog(JSON.stringify(filed));
            const response = await table.getRecords({ pageSize: 300 });
            addLog(`response total : ${response.total}`);
            response.records.map(async (r, i) => {
                const v = await getCellValue(table, filed.value, r.recordId);
                addLog(`[${i}], ${JSON.stringify(v[0].text)}`);
            })
        })
    }

    /**
     * 获取单元格值
     * @param fieldId
     * @param recordId
     */
    const getCellValue = async (table: ITable, fieldId: string, recordId: string) => {
        return await table.getCellValue(fieldId, recordId);
    }

    const export2jsFile = () => {
        cleanLog();
        addLog('------开始导出');
        
        addLog('------导出完成');
    }

    const addLog = (log: string) => {
        let message = new Date().toLocaleString() + ': ' + log;
        logs.push(message);
        setLogString(logs.join('\n'));
    }

    const cleanLog = () => {
        setLogs([]);
        setLogString('');
    }

    return (
        <div>
            <div style={{ margin: 10 }}>
                <div>{`将多维表格的内容导出为 React-Native js 文件`}</div>
                <div>{`当前字符串表格：${curView?.name}, ${curView?.id}`}</div>
            </div>
            <TableComponent data={tableData}></TableComponent>
            <div style={{ margin: 10 }}>
                <Button style={{ marginLeft: 10 }} onClick={conver2jsFile}>转化</Button>
                <Button style={{ marginLeft: 10 }} onClick={export2jsFile}>导出</Button>
            </div>
            <div style={{ margin: 10 }}>
                <div style={{ fontSize: 16 }}>{logString}</div>
            </div>
        </div>
    )
}