import React from "react";
import { Link } from "react-router-dom";

const Home = (): JSX.Element => {
  return (
    <div>
      <Link to="/bookmark">Bookmark</Link>
    </div>
  );
};

export default Home;
