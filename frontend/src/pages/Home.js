import React from "react";
import Timetable from '../components/TimeTable';
import FileUpload from '../components/FileUpload';
import HoroscopeButton from "../components/HoroscopeButton";

const Home = () => {
  return (
    <div className="container pt-5">
      <header className="columns is-vcentered mb-4">
        <div className="column">
          <h1 className="title">Mon Emploi du Temps</h1>
        </div>
        <div className="column is-narrow">
          <FileUpload />
        </div>
      </header>

      <div className="columns">
        <div className="column is-two-thirds">
          <div className="box">
            <Timetable />
          </div>
        </div>

        <div className="column is-one-third">
          <div className="box">
            <HoroscopeButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
