import React from "react";

const tableStyle = {
  textAlign: "center",
};

const NonZeroTable = ({ data }) => {
  // Filter nilai-nilai yang tidak sama dengan 0
  const filteredData = data && data.filter((value) => value !== 0);

  const cellStyle = {
    verticalAlign: "middle",
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>GrayLevel:</th>
          <th>N</th>
        </tr>
      </thead>
      <tbody>
        {filteredData &&
          filteredData.map((value, index) => (
            <tr key={index}>
              <td style={cellStyle}>{index} :</td>
              <td style={cellStyle}>{value}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default NonZeroTable;
