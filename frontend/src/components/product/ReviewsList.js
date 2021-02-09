import React from "react";

const ReviewsList = ({ reviews, user, handleDeleteReview }) => {
  return (
    <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      {reviews.map( review => (
        <div className="review-card my-3" key={review._id}>
          { user._id === review.user._id && (
            <i className="fa fa-trash btn btn-danger delete-button" onClick={ () => handleDeleteReview(review._id) }></i>
          )}
          <div className="rating-outer">
            <div className="rating-inner" style={{width: `${(review.rating/5) * 100}%`}}></div>
          </div>
          <p className="review_user">{review.user.name}</p>
          <p className="review_comment">{review.comment}</p>
          <hr />
        </div>
      ))}
     
    </div>
  );
};

export default ReviewsList;
