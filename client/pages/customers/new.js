import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewCustomer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/vouchers/customers',
    method: 'post',
    body: {
      name,
      email
    },
    onSuccess: () => Router.push('/customers'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Create a Customer</h1>
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
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewCustomer;
