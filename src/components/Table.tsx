"use client";
import React, { useState } from 'react';
import '@/components/style.css';
import Cell from './Cell';

interface TableProps {
  startDate: string;
  endDate: string;
  join: boolean;
}

const Table: React.FC<TableProps> = ({ startDate, endDate, join }) => {
  // Calculate the number of days between startDate and endDate
  startDate += ":00";
  endDate += ":00";
  const StartDate = new Date(startDate);
  const EndDate = new Date(endDate);

  // Calculate the difference in terms of the day of the month
  const startDay = StartDate.getDate();
  const endDay = EndDate.getDate();

  let diffDays = endDay - startDay + 1;
  // Handle the case where the dates cross months
  if (EndDate.getMonth() > StartDate.getMonth()) {
    const daysInStartMonth = new Date(StartDate.getFullYear(), StartDate.getMonth() + 1, 0).getDate();
    diffDays += daysInStartMonth;
  }
  if (EndDate.getHours() === 0) {
    diffDays--;
  }

  // Initialize cell color state
  const [cellColors, setCellColors] = useState<string[][]>(
    new Array(24).fill([]).map(() => new Array(diffDays).fill('white'))
  );

  // Function to handle cell click and toggle the cell color
  const handleCellClick = (i: number, j: number) => {
    if (!join) {
      return;
    }
    if (j === 0 && i < StartDate.getHours()) {
      return; // Do nothing if clicking the first column and the hour is less than StartDate.getHours()
    }
    let realHour = EndDate.getHours();
    if (realHour == 0)
      realHour += 24;
    if (j === diffDays - 1 && i > realHour - 1) {
      return; // Do nothing if clicking the last column and the hour is greater than EndDate.getHours()
    }

    const newColors = [...cellColors];
    newColors[i][j] = cellColors[i][j] === 'white' ? '#A5FFD2' : 'white';
    setCellColors(newColors);
  };

  // Generate the table rows and columns
  const rows = [];
  const dateLabels = [];
  for (let j = 0; j < diffDays; j++) {
    // Calculate the date for the current column
    const currentDate = new Date(startDate);
    currentDate.setDate(StartDate.getDate() + j);
    dateLabels.push(<td key={j}>{currentDate.toLocaleDateString()}</td>);
  }

  rows.push(
    <tr key="dates">
      <td></td> {/* Empty cell for the time column */}
      {dateLabels}
    </tr>
  );

  for (let i = 0; i < 24; i++) {
    const cells = [];
    for (let j = 0; j < diffDays; j++) {
      let cellColor = cellColors[i][j];
      if (j === 0 && i < StartDate.getHours()) {
        cellColor = 'gray'; // Gray out the cell in the first column if the hour is less than StartDate.getHours()
      }
      let realHour = EndDate.getHours();
      if (realHour == 0)
        realHour += 24;
      if (j === diffDays - 1 && i > realHour - 1) {
        cellColor = 'gray'; // Gray out the cell in the last column if the hour is greater than EndDate.getHours()
      }

      cells.push(
        <Cell
          key={j}
          i={i}
          j={j}
          backgroundColor={cellColor}
          onClick={() => handleCellClick(i, j)}
        />
      );
    }

    // Add a label to indicate each row represents an hour in a day
    rows.push(
      <tr key={i}>
        <td>{`${i}:00~${i + 1}:00`}</td>
        {cells}
      </tr>
    );
  }

  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default Table;
