import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";

export default function LeaderBoardTable({ users }: { users: any[] }) {
  const columns: LeaderBoardColumnsTypes[] = [
    { name: "rank", uid: "rank" },
    { name: "name", uid: "name" },
    { name: "number obtained from the quiz ", uid: "quiz_points" },
    // { name: "Total no", uid: "quiz_points" },
  ];
  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "rank":
        return <div>{user.rank}</div>;
      case "name":
        return (
          <div>
            <User
              avatarProps={{
                radius: "full",
                src: user.profile || "/user-1.jpg",
              }}
              name={cellValue}
            >
              {user.email}
            </User>
          </div>
        );
      case "obtained_quiz_marks":
        return (
          <div className="flex flex-col text-center items-center justify-center">
            {0}
          </div>
        );
      case "position":
        return <div className="flex flex-col">{0}</div>;
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => {
          switch (column.uid) {
            case "rank":
              return (
                <TableColumn
                  key={column.uid}
                  className="!text-center !w-[100px]"
                >
                  {column.name}
                </TableColumn>
              );
            case "name":
              return (
                <TableColumn key={column.uid} className=" !w-[200px]">
                  {column.name}
                </TableColumn>
              );
            default:
              return (
                <TableColumn
                  key={column.uid}
                  className="!text-center !w-[400px]"
                >
                  {column.name}
                </TableColumn>
              );
          }
        }}
      </TableHeader>
      <TableBody items={users?.slice(0, 25)}>
        {(item) => (
          <TableRow
            key={item.id}
            // className="text-center flex items-center justify-center"
          >
            {(columnKey) => {
              switch (columnKey) {
                case "rank":
                  return (
                    <TableCell className="w-[100px]">
                      {renderCell(item, columnKey)}
                    </TableCell>
                  );
                case "name":
                  return (
                    <TableCell className="relative flex items-center w-[200px]">
                      {renderCell(item, columnKey)}
                    </TableCell>
                  );
                default:
                  return <TableCell>{renderCell(item, columnKey)}</TableCell>;
              }
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
