import React, { useEffect, useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";

import { userSignup, clearErrors } from "../../actions/userActions";

const Register = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_preview_avatar.png"
  );

  //tentar fazer essa tela sem ajuda de ngm, vai ser bom, so na hora do cloudinary que vai precisar.

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, loading, alert, user, error, history]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("avatar", avatar);

    dispatch(userSignup(formData));
  }

  function handleChange(e) {
    if (e.target.name == "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        //0 - created
        //1 - processing
        //2 - done
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result)
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  }

  return ( 
    <Fragment>
      <MetaData title="Register" />
      <div className="container container-fluid">
        {loading ? (<Loader />) : (
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" encType="multipart/form-data" onSubmit={handleSubmit} >
                <h1 className="mb-3">Register</h1>

                <div className="form-group">
                  <label htmlFor="email_field">Name</label>
                  <input type="name" id="name_field" className="form-control" value={name} name="name" onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input type="email" id="email_field" className="form-control" name="email" value={email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input type="password" id="password_field" className="form-control" name="password" value={password} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_upload">Avatar</label>
                  <div className="d-flex align-items-center">
                    <div>
                      <figure className="avatar mr-3 item-rtl">
                        <img src={avatarPreview} className="rounded-circle" alt="image" />
                      </figure>
                    </div>
                    <div className="custom-file">
                      <input type="file" name="avatar" className="custom-file-input" id="customFile" accept="images/*" onChange={handleChange} />
                      <label className="custom-file-label" htmlFor="customFile">Choose Avatar</label>
                    </div>
                  </div>
                </div>

                <button id="register_button" type="submit" className="btn btn-block py-3" disabled={loading ? true : false} >REGISTER</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Register;
