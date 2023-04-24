import data from "../utils/data.json";
import Map from "../components/Map";
import TableData from "../components/TableData";
import { createContext, useEffect, useState } from "react";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
export const Context = createContext();
export default function Home() {
  const [decadeOptions, setDecadeOptions] = useState([]);
  const [decade, setDecade] = useState("2030");
  const [faktors, setFaktors] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  useEffect(() => {
    const newParsedData = data.map((el) => {
      return { ...el, risk_factors: JSON.parse(el.risk_factors) };
    });
    setParsedData(newParsedData.filter((el) => el.year === decade));
    setSelectedList(newParsedData.filter((el) => el.year === decade)[0]);
  }, [data, decade]);

  useEffect(() => {
    const newDecadeOptions = [];
    const newFaktors = [];
    data.forEach((el) => {
      if (!newDecadeOptions.includes(el.year)) {
        newDecadeOptions.push(el.year);
      }

      const faktors = Object.keys(JSON.parse(el.risk_factors));
      faktors.forEach((faktor) => {
        if (!newFaktors.includes(faktor)) {
          newFaktors.push(faktor);
        }
      });
    });
    setDecadeOptions(newDecadeOptions.sort());
    setFaktors(newFaktors);
  }, [data]);
  return (
    <div className="container">
      <div className="decade-select">
        Decade:
        <select
          onChange={(e) => {
            setDecade(e.target.value);
          }}
        >
          {decadeOptions?.map((d) => {
            return (
              <option key={d} value={d}>
                {d}
              </option>
            );
          })}
        </select>
      </div>
      <div className="map box">
        <Map data={parsedData} />
      </div>
      <div className="tab box">
        <TableData
          data={parsedData}
          decade={decade}
          faktors={faktors}
          setSelectedList={setSelectedList}
        />
      </div>
      <div className="chart box">
        <BarChart data={selectedList} faktors={faktors} />
        <PieChart data={selectedList} faktors={faktors} />
      </div>
    </div>
  );
}
