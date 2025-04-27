import React, { useState } from "react";
import "./popup.css";

const tabs = [
  {
    id: 1,
    name: "当前页面",
  },
  {
    id: 2,
    name: "其他页面",
  },
];

const Popup = () => {
  const [activePage, setActivePage] = useState(1);
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-none border-b border-gray-200 text-sm flex items-center select-none justify-center gap-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`cursor-pointer py-4 px-2 relative after:content-[''] after:h-[1px] after:transition-all after:duration-300 after:absolute after:bottom-[-1px] after:left-0 ${
              activePage === tab.id
                ? "after:bg-purple-400 after:w-full font-bold text-purple-400"
                : "after:bg-transparent after:w-[0px]"
            }`}
            onClick={() => setActivePage(tab.id)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className="flex-1 min-w-0 min-h-0 overflow-auto p-2">
        <div className="flex flex-col gap-2">
          <div className="flex w-full">
            <div className="w-2/3 max-h-32">
              <img
                className="w-full h-full object-contain"
                src={"https://www.dute.org/imgplaceholder/800x240"}
              />
            </div>
            <div className="flex-1 min-w-0 min-h-0">
              <div>1.22MB</div>
              <div>1920*1080</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
