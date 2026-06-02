import React, { useState, useEffect } from "react";

function CompareAreas({ area1, area2 }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/compare-areas?area1=${area1}&area2=${area2}`)
      .then(res => res.json())
      .then(setData);
  }, [area1, area2]);

  return (
    <div>
      <h2>Compare Areas</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CompareAreas;
