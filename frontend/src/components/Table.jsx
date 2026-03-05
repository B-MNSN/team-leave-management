function Table({ columns, data }) {

    return (
        <table className="table table-hover leave-table">
            <thead>
                <tr>
                    <th>No.</th>
                    {columns.map((col, index) => (
                        <th key={index}>{col.header}</th>
                    ))}
                </tr>
            </thead>

            <tbody>

                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>{rowIndex + 1}</td>

                        {columns.map((col, colIndex) => (

                            <td key={colIndex}>
                                {col.render
                                    ? col.render(row)
                                    : row[col.accessor]
                                }
                            </td>

                        ))}

                    </tr>

                ))}

            </tbody>

        </table>
    );
}

export default Table;