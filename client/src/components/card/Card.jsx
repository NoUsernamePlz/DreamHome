import { Link, redirect } from "react-router-dom";
import "./card.scss";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function Card({ post: item }) {
  const [saved, setSaved] = useState(item?.isSaved);
   const { currentUser } = useContext(AuthContext);

 const handleSave = async () => {
    setSaved((prev) => !prev);
    if (!currentUser) {
      redirect("/login");
    }
    try {
      await apiRequest.post("/users/save", { postId: item?.id });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item?.id}`} className="imageContainer">
        <img src={item?.images?.[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item?.id}`}>{item?.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item?.address}</span>
        </p>
        <p className="price">$ {item?.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item?.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item?.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon"
             onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >

              <img src="/save.png" alt="" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;