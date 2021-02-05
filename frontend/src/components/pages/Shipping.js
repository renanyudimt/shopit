import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { countries } from "countries-list"
import { useLocation, useHistory } from "react-router-dom"
import { saveShippingInfo } from "./../../actions/cartActions"
import CheckoutSteps from "../cart/CheckoutSteps"

const Shipping = () => {
  const { shippingInfo } = useSelector(state => state.cartReducer)
  const countriesList = Object.values(countries)
  const history = useHistory();
  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [phone, setPhone] = useState(shippingInfo.phone);
  const [zipCode, setZipCode] = useState(shippingInfo.zipCode);
  const [country, setCountry] = useState(shippingInfo.country);
  

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target)
    formData.set("address", address)
    formData.set("city", city)
    formData.set("phone", phone)
    formData.set("zipCode", zipCode)
    formData.set("country", country)
    dispatch(saveShippingInfo(formData))
    history.push('/confirm', [{
      authorization: true
    }])
  }

  return (
    <Fragment>
      <MetaData title="Shipping" />
      <CheckoutSteps shipping />
      <div className="container container-fluid">
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form className="shadow-lg" id="shipping_form" onSubmit={handleSubmit}>
              <h1 className="mb-4">Shipping Info</h1>
              <div className="form-group">
                <label htmlFor="address_field">Address</label>
                <input type="text" name="address" id="address" className="form-control" value={address} onChange={ e => setAddress(e.target.value) } required />
              </div>

              <div className="form-group">
                <label htmlFor="city_field">City</label>
                <input type="text" name="city" id="city" className="form-control" value={city} onChange={ e => setCity(e.target.value) } required/>
              </div>

              <div className="form-group">
                <label htmlFor="phone_field">Phone No</label>
                <input type="phone" name="phone" id="phone" className="form-control" value={phone} onChange={ e => setPhone(e.target.value) } required />
              </div>

              <div className="form-group">
                <label htmlFor="postal_code_field">Postal Code</label>
                <input type="number" name="zipCode" id="zipCode" className="form-control" value={zipCode} onChange={ e => setZipCode(e.target.value) } required />
              </div>

              <div className="form-group">
                <label htmlFor="country_field">Country</label>
                <select id="country" name="country" className="form-control" value={country} onChange={ e => setCountry(e.target.value) } required >
                  { countriesList.map(item => (
                    <option key={item.name} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>

              <button id="shipping_btn" type="submit" className="btn btn-block py-3">CONTINUE</button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
