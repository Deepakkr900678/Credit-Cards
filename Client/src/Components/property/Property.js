import React from "react";
import { useEffect, useState, useRef } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/es/styles-compiled.css";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import axios from "axios";
import { Cookies } from "react-cookie";
import Header from "../header_sidebar/Header";
import "./Property.css";

const Property = () => {

  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focused, setFocused] = useState("");
  const [issuer, setIssuer] = useState("");
  const [formData, setFormData] = useState(null);
  const formRef = useRef(null);

  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      setIssuer(issuer);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "number":
        setNumber(value);
        break;
      case "name":
        setName(value);
        break;
      case "expiry":
        setExpiry(value);
        break;
      case "cvc":
        setCvc(value);
        break;
      default:
        break;
    }
  };

  const handleInputFocus = (e) => {
    setFocused(e.target.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      number,
      name,
      expiry,
      cvc,
      issuer,
      focused, 
      formData
    });
    formRef.current.reset();
  };

  const formatFormData = (data) => {
    return Object.keys(data).map((key) => {
      switch (key) {
        case "number":
          return `Card Number: **** **** **** ${data[key].slice(-4)}`;
        case "name":
          return `Name: ${data[key]}`;
        case "expiry":
          return `Valid Thru: ${data[key]}`;
        case "cvc":
          return `CVV: ***`;
        default:
          return "";
      }
    });
  };

  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);
  const cookies = new Cookies();
  const token = cookies.get("jwt");
  let navigate = useNavigate();

  const deb = debounce((text) => {
    setValue(text);
  }, 1000);

  useEffect(() => {
    const afterLogin = () => {

      axios({
        method: "get",
        url: "https://credit-card-backend.onrender.com/property",
        headers: {
          Accept: "application/json",
          authorization: token,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          setUsers(res.data.property);
        })
        .catch((err) => {
          console.log(err);
          if (
            err.response.data === "Unauthorized user" ||
            err.response.status === 409
          ) {
            navigate("/login");
          }
        });
    };

    afterLogin();
  }, [token, navigate, value]);

  return (
    <>
      <Header />
      <div className="App-cards">
        <div className="App-cards-list">
          <div className="card-stack">
            <Cards name="John Smith" number="5555 4444 3333 1111" expiry="10/20" cvc="737" />
            <Cards name="John Smith" number="4111 1111 1111 1111" expiry="10/20" cvc="737" />
            <Cards name="John Smith" number="3700 0000 0000 0002" expiry="10/20" cvc="737" />
            <Cards name="John Smith" number="3600 6666 3378 3344" expiry="10/20" cvc="737" />
            <Cards name="John Smith" number="6011 6011 6011 6611" expiry="10/20" cvc="737" />
            <Cards name="John Smith" number="5066 9911 1111 1118" expiry="10/20" cvc="737" />
            <Cards name="John Smith" number="6250 9460 0000 0016" expiry="10/20" cvc="737" />
            <Cards name="John Smith" number="6062 8288 8866 6688" expiry="10/20" cvc="737" />
            <Cards name="John Smith" number="7273 8724 7288 7048" expiry="10/20" cvc="737" preview={true} issuer="visa" />
          </div>
        </div>
      </div>

      <h1 className="header">Apply for Credit Card</h1>
      <h2 className="headers">Fill this Card Details</h2>
      <Cards number={number} name={name} expiry={expiry} cvc={cvc} focused={focused} callback={handleCallback} />
      <br />
      <form className="form" ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="tel"
            name="number"
            className="form-control"
            placeholder="Card Number"
            pattern="[\d| ]{16,16}"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        <br />
        <div className="form-group">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        <br />
        <div className="row">
          <div className="col-6">
            <input
              type="tel"
              name="expiry"
              className="form-control"
              placeholder="Valid Thru"
              pattern="\d\d/\d\d"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <br />
          <div className="col-6">
            <input
              type="tel"
              name="cvc"
              className="form-control"
              placeholder="CVC"
              pattern="\d{3,4}"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
        </div>
        <input type="hidden" name="issuer" value={issuer} />
        <br />
        <div className="form-actions">
          <button className="button" >PAY</button>
        </div>
      </form>
      {formData && (
        <div className="App-highlight">
          {formatFormData(formData).map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default Property;
