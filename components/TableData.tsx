
import { useCallback, useEffect, useState } from "react";
import {
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Table,

} from "@mui/material";
import { Post } from "../Interface";
import EnhancedTableHead from "./TabComponents/EnhancedTableHead";
import _ from "lodash";


type Props = {
    data: Post[],
    decade: string,
    faktors: string[]
    setSelectedList: (arr: any) => void
}

const TableData = ({ data, decade, faktors, setSelectedList }: Props) => {
    const DEFAULT_ORDER_BY = 'Asset Name';
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [columns, setColumns] = useState<string[]>([]);
    const columnsIntitial: string[] = ["Asset Name", "Business Category", "Risk Rating"];
    const [order, setOrder] = useState<"asc" | "desc" | undefined>("asc");
    const [orderBy, setOrderBy] = useState<any>(undefined);
    const [sortedTab, setSortedTab] = useState(data);
    useEffect(() => {
        setColumns([...columnsIntitial, ...faktors]);
    }, [faktors]);

    const slugify = (str: string) => {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "_")
            .replace(/^-+|-+$/g, "");

    }
    const handleChange = (newOrderBy: string) => {
        setOrderBy(newOrderBy);
        setOrder((prev: any) => prev === "asc" ? "desc" : "asc")
    }
    const handleChangePage = useCallback(
        (event: unknown, newPage: number) => {
            setPage(newPage);
        },
        [],
    );

    const handleChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const updatedRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(updatedRowsPerPage);
            setPage(0);
        },
        [],
    );
    useEffect(() => {
        setSortedTab(data)
    }, [data])


    useEffect(() => {
        const nullsFirst = (value: any) => value === undefined ? -Infinity : value;

        if (columnsIntitial.includes(orderBy)) {
            if (order === "asc") {
                const sortedData = _.sortBy(data, slugify(orderBy));
                setSortedTab(sortedData)
            } else {
                const sortedData = _.sortBy(data, slugify(orderBy)).reverse();
                setSortedTab(sortedData)
            }
        } else {
            if (order === "asc") {

                const sortedData = _.sortBy(data, [
                    (obj: any) =>
                        nullsFirst(obj['risk_factors'][orderBy]),
                ]);

                setSortedTab(sortedData)
            } else {
                const sortedData = _.sortBy(data, [
                    (obj: any) =>
                        nullsFirst(obj['risk_factors'][orderBy]),
                ]).reverse();

                setSortedTab(sortedData)
            }
        }
    }, [order, orderBy])
    return (
        <div className="content">
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }} >
                    {
                        faktors && sortedTab && (
                            <Table stickyHeader aria-label="sticky table" size="small" >
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    headCells={columns}
                                    handleChange={handleChange}
                                />
                                <TableBody>
                                    {sortedTab
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row: any) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={Math.random() * 100}
                                                >
                                                    {columns.map((column, index) => {

                                                        const value = row[slugify(column)];
                                                        const risk_factors = row["risk_factors"];
                                                        const riskFactorsValue = risk_factors[column];
                                                        return (
                                                            <TableCell key={index}
                                                                align={"center"}
                                                                onClick={() => {
                                                                    setSelectedList(row)
                                                                }}
                                                                sx={{
                                                                    fontSize: "12px",
                                                                    padding: "5px"

                                                                }}>
                                                                {value || riskFactorsValue
                                                                    ? value
                                                                        ? value
                                                                        : (Number(riskFactorsValue).toFixed(2))
                                                                    : "-"}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        )
                    }

                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

        </div>
    );
}

export default TableData;



