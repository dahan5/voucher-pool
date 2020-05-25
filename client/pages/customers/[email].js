import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const CustomerShow = ({ customer }) => {
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const { doRequest, errors } = useRequest({
    url: `/api/vouchers/customers/${customer.email}`,
    method: 'put',
    body: {
      name
    },
    onSuccess: () => Router.push('/customers'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Update a Customer</h1>
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
            readOnly
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

CustomerShow.getInitialProps = async (context, client) => {
  const { email } = context.query;
  const { data } = await client.get(`/api/vouchers/customers/${email}`);

  return { customer: data };
};

export default CustomerShow;
