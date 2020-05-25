import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewOffer = () => {
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/vouchers/offers',
    method: 'post',
    body: {
      name,
      discount
    },
    onSuccess: () => Router.push('/offers'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(discount);

    if (isNaN(value)) {
      return;
    }

    setDiscount(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create an Offer</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Discount</label>
          <input
            value={discount}
            onBlur={onBlur}
            onChange={(e) => setDiscount(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewOffer;
