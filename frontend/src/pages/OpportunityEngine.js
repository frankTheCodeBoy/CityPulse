import React, { useState } from "react";

function OpportunityEngine() {
  const [industry, setIndustry] = useState("Food");
  const [result, setResult] = useState(null);

  const runEngine = () => {
    fetch("http://127.0.0.1:8000/opportunity-engine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_type: "Demo", industry }),
    })
      .then(res => res.json())
      .then(setResult);
  };

  return (
    <div>
      <h2>Opportunity Engine</h2>
      <select value={industry} onChange={e => setIndustry(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Tech">Tech</option>
        <option value="Retail">Retail</option>
      </select>
      <button onClick={runEngine}>Run</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default OpportunityEngine;
