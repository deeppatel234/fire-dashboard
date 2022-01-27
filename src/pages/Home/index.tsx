import React, { useContext, useMemo } from "react";

import AppContext from "src/AppContext";

import Timer from "./Timer";
import BGImage from "./BGImage";
import ImageOptions from "./ImageOption";

import "./index.scss";

const Home = (): JSX.Element => {
  const { workspace } = useContext(AppContext);

  const greetingsString = useMemo(() => {
    const today = new Date();
    const curHr = today.getHours();
    let greetings = "Good Evening";

    if (curHr < 12) {
      greetings = "Good Morning";
    } else if (curHr < 18) {
      greetings = "Good Afternoon";
    }

    if (workspace.settings.home.userName) {
      greetings += `, ${workspace.settings.home.userName}`;
    }

    return greetings;
  }, [workspace]);

  return (
    <>
      <BGImage />
      <div className="home-wrapper">
        <div className="info-text">
          <Timer />
          {workspace?.settings?.home?.showGreeting ? (
            <div className="greeting">{greetingsString}</div>
          ) : null}
        </div>
        {["UNSPLASH", "CUSTOM"].includes(
          workspace?.settings?.home?.imageType,
        ) ? (
          <ImageOptions />
        ) : null}
      </div>
    </>
  );
};

export default Home;
