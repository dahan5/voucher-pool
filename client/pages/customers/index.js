import Link from 'next/link';

const LandingPage = ({ currentUser, customers }) => {
  const customerList = customers.map((customer) => {
    return (
      <tr key={customer.email}>
        <td>{customer.email}</td>
        <td>{customer.name}</td>
        <td>
          <Link href="/vouchers/[email_status]" as={`/vouchers/${customer.email}:u`}>
            <a>Used</a>
          </Link>
          <Link href="/vouchers/[email_status]" as={`/vouchers/${customer.email}:n`}>
            <a>Unused</a>
          </Link>
          <Link href="/vouchers/[email_status]" as={`/vouchers/${customer.email}:e`}>
            <a>Expired</a>
          </Link>
        </td>
        <td>
          <Link href="/customers/[email]" as={`/customers/${customer.email}`}>
            <a>Edit</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Customers</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>View Vouchers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{customerList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/vouchers/customers');

  return { customers: data };
};

export default LandingPage;
