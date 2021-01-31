import React, { useEffect, Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom"
import { useAlert } from "react-alert";
import Loader from "./../layout/Loader";
import MetaData from "./../layout/MetaData";
import { updateUser, loadUser } from "./../../actions/userActions";
import { UPDATE_PROFILE_RESET } from "./../../constants/userConstants";

export const UserUpdate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_preview_avatar.png"
  );
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);
  const { isUpdated, loading, error } = useSelector(
    (state) => state.updateUserReducer
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    if (error) {
      alert.error(error);
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }

    if (isUpdated) {
      alert.success("User updated successfully");
      dispatch(loadUser());
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
      history.push("/profile");
    }
  }, [dispatch, user, error, isUpdated]);


  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("name", name);
    formData.set("email", email);
    formData.set("avatar", avatar);

    dispatch(updateUser(formData));
  }

  function handleChange(e) {
    if (e.target.name === "avatar") {
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
      //setUser({ ...user, [e.target.name]: e.target.value });
    }
  }

  return (
    <Fragment>
      <MetaData title="Update Profile" />
      <div className="container container-fluid">
        {loading ? (
          <Loader />
        ) : (
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" encType="multipart/form-data" onSubmit={handleSubmit}>
                <h1 className="mt-2 mb-5">Update Profile</h1>

                <div className="form-group">
                  <label htmlFor="email_field">Name</label>
                  <input type="name" id="name_field" className="form-control" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input type="email" id="email_field" className="form-control" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_upload">Avatar</label>
                  <div className="d-flex align-items-center">
                    <div>
                      <figure className="avatar mr-3 item-rtl">
                        <img src={avatarPreview} className="rounded-circle" alt="Avatar Preview" />
                      </figure>
                    </div>
                    <div className="custom-file">
                      <input type="file" name="avatar" className="custom-file-input" id="customFile" accept="images/*" onChange={handleChange} />
                      <label className="custom-file-label" htmlFor="customFile">Choose Avatar</label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false } >Update</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default UserUpdate