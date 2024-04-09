/*
 * @Author wanghaobing
 * @Date 2024-04-10
 * @FilePath /js-sdk-learn-demo/src/table.tsx
 * @Description 
 * Copyright (c) 2024 by YUNMAI, All Rights Reserved.
 */
import React from 'react';

class TableComponent extends React.Component {

    constructor(props: any) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const { data } = this.props;

        return (
            <table>
                <thead>
                    <tr>
                        <th>语言</th>
                        <th>FiledID</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))}
                </tbody>
                <colgroup>
                    <col style={{ width: '50%' }} />
                    <col style={{ width: '50%' }} />
                </colgroup>
            </table>
        );
    }
}

export default TableComponent;