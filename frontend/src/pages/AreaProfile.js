import React, { useState, useEffect } from "react";

function AreaProfile({ areaId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/area-profile/${areaId}`)
      .then(res => res.json())
      .then(setData);
  }, [areaId]);

  return (
    <div>
      <h2>Area Profile</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AreaProfile;
