import React from 'react';

interface CellProps {
  backgroundColor: string;
  onClick: () => void;
  i:number;
  j:number;
}

const Cell: React.FC<CellProps> = ({ backgroundColor, onClick }) => {
  //const [count, setCount] = useState(0);

  const handleCellClick = () => {
    //setCount(count + 1);
    onClick();
  };

  return (
    <td
      style={{ backgroundColor }}
      onClick={handleCellClick}
    >
      {/*{count}*/}
    </td>
  );
};

export default Cell;
