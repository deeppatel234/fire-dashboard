import React, { useContext, useEffect, useMemo, useState } from "react";

import AppContext from "src/AppContext";

import "./index.scss";

const Home = (): JSX.Element => {
  const { workspace } = useContext(AppContext);

  const [timeString, setTimeString] = useState("");

  const is12Hr = useMemo(() => {
    return workspace.settings?.home?.clockType === "12hr";
  }, [workspace]);

  const formatTime = (i: number): string => {
    let formated = `${i}`;
    if (i < 10) {
      formated = `0${i}`;
    }
    return formated;
  };

  const startTime = () => {
    const today = new Date();
    let h = today.getHours();
    const m = formatTime(today.getMinutes());
    // const s = formatTime(today.getSeconds());

    if (is12Hr) {
      let session = "AM";

      if (h == 0) {
        h = 12;
      }

      if (h > 12) {
        h = h - 12;
        session = "PM";
      }
      setTimeString(`${h}:${m} ${session}`);
    } else {
      setTimeString(`${h}:${m}`);
    }
  };

  const greetingsString = () => {
    const today = new Date();
    const curHr = today.getHours();

    if (curHr < 12) {
      return "Good Morning";
    } else if (curHr < 18) {
      return "Good Afternoon";
    }
    return "Good Evening";
  };

  useEffect(() => {
    startTime();
    const timer = setInterval(() => startTime(), 1000);

    return () => {
      clearInterval(timer);
    };
  }, [is12Hr]);

  return (
    <div className="home-wrapper">
      <div className="info-text">
        <div className="time">{timeString}</div>
        {workspace.settings?.home?.showGreeting ? (
          <div className="greeting">{`${greetingsString()}${
            workspace.settings.home.userName
              ? `, ${workspace.settings.home.userName}`
              : ""
          }`}</div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
