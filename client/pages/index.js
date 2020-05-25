import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/use-request';
import moment from 'moment';

const LandingPage = ({ currentUser, vouchers }) => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const voucherList = vouchers.map((voucher) => {
    return (
      <tr key={voucher.code}>
        <td>{voucher.code}</td>
        <td>{voucher.customer.email}</td>
        <td>{voucher.usedAt?voucher.usedAt.split("T")[0]:
        moment().isAfter(voucher.expiresAt)?'Expired':
    <button onClick={(e) => {
      onClick (e, voucher.code, voucher.customer.email);
    }}>Use it now</button>}</td>
        <td>{voucher.expiresAt.split("T")[0]}</td>
        <td>{voucher.specialOffer.discount}</td>
        <td>{voucher.specialOffer.name}</td>
      </tr>
    );
  });
  const { doRequest, errors } = useRequest({
    url: '/api/vouchers/voucher_codes/useit',
    method: 'post',
    body: {
      code,
      email
    },
    onSuccess: () => Router.push('/')
  });

  const onClick = (event, voucherCode, customerEmail) => {
    event.preventDefault();
    setCode(voucherCode);
    setEmail(customerEmail);

    doRequest();
  };

  return (
    <div>
      <input value={code} type="hidden" />
      <input value={email} type="hidden" />
      <h1>Vouchers</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Customer</th>
            <th>Used on</th>
            <th>Expires on</th>
            <th>Discount</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{voucherList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/vouchers/voucher_codes');

  return { vouchers: data };
};

export default LandingPage;
