import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../context/AuthContext";
import "./homePage.scss";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Discover Your Perfect Home</h1>
          <p className="subtitle">
            Explore modern apartments, cozy houses, and premium commercial
            spaces. With trusted experience and thousands of properties, we’ll
            help you find your dream place with ease.
          </p>

          <SearchBar />

          <div className="stats">
            <div className="statCard">
              <h1>16+</h1>
              <p>Years of Expertise</p>
            </div>
            <div className="statCard">
              <h1>200+</h1>
              <p>Awards & Recognitions</p>
            </div>
            <div className="statCard">
              <h1>2,000+</h1>
              <p>Properties Available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="imgContainer">
        <img src="/bgImg.png" alt="Real estate hero" />
      </div>
    </div>
  );
}

export default HomePage;
