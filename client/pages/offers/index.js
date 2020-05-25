import Link from 'next/link';

const LandingPage = ({ currentUser, offers }) => {
  const offerList = offers.map((offer) => {
    return (
      <tr key={offer.id}>
        <td>{offer.name}</td>
        <td>{offer.discount}</td>
        <td>
          <Link href="/offers/[id]" as={`/offers/${offer.id}`}>
            <a>Edit</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Offers</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{offerList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/vouchers/offers');

  return { offers: data };
};

export default LandingPage;
