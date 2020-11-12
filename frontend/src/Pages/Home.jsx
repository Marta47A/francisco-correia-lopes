import React from "react";
import Carousel from "./Pages/components/Carousel";
import Biography from "./Pages/components/Biography";
import DailyLife from "./Pages/components/DailyLife";
import LastPosts from "./Pages/components/LastPosts";
import Contact from "./Pages/components/Contact";

function Home(props) {
  return (
    <div>
      <Carousel />
      <Biography />
      <DailyLife />
      <LastPosts lastPosts={lastPosts} />
      <Contact />
    </div>
  );
}

export default Home;
