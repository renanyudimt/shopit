import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { countries } from "countries-list"
import { useLocation, useHistory } from "react-router-dom"
import queryString from 'query-string'
import { saveShippingInfo } from "./../../actions/cartActions"


const Shipping = () => {
  const { shippingInfo } = useSelector(state => state.cartReducer)
  const countriesList = Object.values(countries)
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [phone, setPhone] = useState(shippingInfo.phone || "");
  const [zipCode, setZipCode] = useState(shippingInfo.zipCode || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  
  useEffect(() => {
    //aqui, vou verificar se tem tenho o state authentication, um nova me inventei so pra saber se a pagina esta sendo redirecionada do carrinho, 
    //se sim, deve permanecer, senao, redirecionar.
    if (!location.state || !location.state.map(item => { if (item.authentication) return true })[0]) {
      history.push("/")
    }
  }, [history])

  function handleSubmit(e) {
    e.preventDafault()
    const formData = new FormData(e.target)
    formData.set("address", shippingInfo.address)
    formData.set("city", shippingInfo.city)
    formData.set("phone", shippingInfo.phone)
    formData.set("zipCode", shippingInfo.zipCode)
    formData.set("country", shippingInfo.country)
    dispatch(saveShippingInfo())
  }

  return (
    <Fragment>
      <MetaData title="Shipping" />
      <div className="container container-fluid">
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={handleSubmit}>
              <h1 className="mb-4">Shipping Info</h1>
              <div className="form-group">
                <label htmlFor="address_field">Address</label>
                <input type="text" name="address" id="address_field" className="form-control" value={address} onChange={ e => setAddress(e.target.value) } required />
              </div>

              <div className="form-group">
                <label htmlFor="city_field">City</label>
                <input type="text" name="city" id="city_field" className="form-control" value={city} onChange={ e => setCity(e.target.value) } required/>
              </div>

              <div className="form-group">
                <label htmlFor="phone_field">Phone No</label>
                <input type="phone" name="phone" id="phone_field" className="form-control" value={phone} onChange={ e => setPhone(e.target.value) } required />
              </div>

              <div className="form-group">
                <label htmlFor="postal_code_field">Postal Code</label>
                <input type="number" name="zipCode" id="postal_code_field" className="form-control" value={zipCode} onChange={ e => setZipCode(e.target.value) } required />
              </div>

              <div className="form-group">
                <label htmlFor="country_field">Country</label>
                <select id="country_field" name="country" className="form-control" value={country} onChange={ e => setCountry(e.target.value) } required >
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
