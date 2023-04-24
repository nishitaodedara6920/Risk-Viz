import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";


interface EnhancedTableProps {
    order: "asc" | "desc" | undefined;
    orderBy: string;
    headCells: string[]
    handleChange: (newOrderBy: any) => void
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { order, orderBy, headCells, handleChange } =
        props;

    return (
        <TableHead>
            <TableRow>
                {headCells?.map((headCell) => (
                    <TableCell
                        key={headCell}
                        align={"center"}
                        sx={{
                            fontSize: "12px",
                            padding: "5px"
                        }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell}
                            direction={order}
                            onClick={() => handleChange(headCell)}
                        >
                            {headCell}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
export default EnhancedTableHead