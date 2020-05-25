import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewVoucher = ({ offers, customers }) => {
  let offerIdList = [];
  const offerList = offers.map((offer) => {
    offerIdList.push(offer.id);
    return (
      <option key={offer.id} value={offer.id}>{offer.name} ({offer.discount})</option>
    );
  });
  let customerIdList = [];
  const customerList = customers.map((customer) => {
    customerIdList.push(customer.id);
    return (
      <option key={customer.id} value={customer.id}>{customer.name} ({customer.email})</option>
    );
  });
  const [expiresAt, setExpiresAt] = useState('');
  const [offerId, setOfferId] = useState(offerIdList[0]);
  const [customerId, setCustomerId] = useState(customerIdList[0]);
  const { doRequest, errors } = useRequest({
    url: '/api/vouchers/voucher_codes',
    method: 'post',
    body: {
      expiresAt,
      offerId,
      customerId
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Create a Voucher</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Expires at</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Offer</label>
          <select
          value={offerId}
          onChange={e => setOfferId(e.currentTarget.value)}
          className="form-control">
            {offerList}
          </select>
        </div>
        <div className="form-group">
          <label>Customer</label>
          <select
          value={customerId}
          onChange={e => setCustomerId(e.currentTarget.value)}
          className="form-control">
            {customerList}
          </select>
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

NewVoucher.getInitialProps = async (context, client, currentUser) => {
  const myOffers = await client.get('/api/vouchers/offers');
  const myCustomers = await client.get('/api/vouchers/customers');

  return { offers: myOffers.data, customers: myCustomers.data };
};

export default NewVoucher;
