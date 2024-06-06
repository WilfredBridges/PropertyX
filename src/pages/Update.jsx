import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <label className='font-semibold'>Listing Status:</label>
            <div className='flex flex-col gap-2'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  id='all'
                  name='type'
                  className='mr-2'
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'}
                />
                All
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  id='buy'
                  name='type'
                  className='mr-2'
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'}
                />
                Buy
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  id='rent'
                  name='type'
                  className='mr-2'
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'}
                />
                Rent
              </label>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <label className='font-semibold'>Property Type:</label>
            <div className='flex flex-col gap-2'>
            <label className='flex items-center'>
          <input
            type='checkbox'
            id='all'
            className='mr-2'
            onChange={handleChange}
            checked={sidebardata.type === 'all'}
          />
          All
        </label>
        <label className='flex items-center'>
          <input
            type='checkbox'
            id='houses'
            className='mr-2'
            onChange={handleChange}
            checked={sidebardata.type === 'houses'}
          />
          Houses
        </label>
        <label className='flex items-center'>
          <input
            type='checkbox'
            id='apartments'
            className='mr-2'
            onChange={handleChange}
            checked={sidebardata.type === 'apartments'}
          />
          Apartments
        </label>
        <label className='flex items-center'>
          <input
            type='checkbox'
            id='office'
            className='mr-2'
            onChange={handleChange}
            checked={sidebardata.type === 'office'}
          />
          Office
        </label>
        <label className='flex items-center'>
          <input
            type='checkbox'
            id='villa'
            className='mr-2'
            onChange={handleChange}
            checked={sidebardata.type === 'villa'}
          />
          Villa
        </label>
      </div>
    </div>
    <div className='flex flex-col gap-4'>
      <label className='font-semibold'>Price Range:</label>
      <div className='flex items-center gap-2'>
        <input
          type='number'
          id='minPrice'
          placeholder='$ Min'
          className='border rounded-lg p-3 w-full'
          value={sidebardata.minPrice}
          onChange={handleChange}
        />
        <span>-</span>
        <input
          type='number'
          id='maxPrice'
          placeholder='$ Max'
          className='border rounded-lg p-3 w-full'
          value={sidebardata.maxPrice}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className='flex flex-col gap-4'>
      <label className='font-semibold'>Bedrooms:</label>
      <div className='flex gap-2'>
        <button
          type='button'
          className={`border rounded-lg p-3 ${sidebardata.bedrooms === 'any' ? 'bg-gray-200' : ''}`}
          onClick={() => setSidebardata({ ...sidebardata, bedrooms: 'any' })}
        >
          Any
        </button>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type='button'
            className={`border rounded-lg p-3 ${sidebardata.bedrooms === num ? 'bg-gray-200' : ''}`}
            onClick={() => setSidebardata({ ...sidebardata, bedrooms: num })}
          >
            {num}+
          </button>
        ))}
      </div>
    </div>
    <div className='flex flex-col gap-4'>
      <label className='font-semibold'>Bathrooms:</label>
      <div className='flex gap-2'>
        <button
          type='button'
          className={`border rounded-lg p-3 ${sidebardata.bathrooms === 'any' ? 'bg-gray-200' : ''}`}
          onClick={() => setSidebardata({ ...sidebardata, bathrooms: 'any' })}
        >
          Any
        </button>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type='button'
            className={`border rounded-lg p-3 ${sidebardata.bathrooms === num ? 'bg-gray-200' : ''}`}
            onClick={() => setSidebardata({ ...sidebardata, bathrooms: num })}
          >
            {num}+
          </button>
        ))}
      </div>
    </div>
    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
      Search
    </button>
  </form>
</div>
<div className='flex-1'>
  <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
    Listing results:
  </h1>
  <div className='p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
    {!loading && listings.length === 0 && (
      <p className='text-xl text-slate-700'>No listing found!</p>
    )}
    {loading && (
      <p className='text-xl text-slate-700 text-center w-full'>
        Loading...
      </p>
    )}
    {!loading &&
      listings &&
      listings.map((listing) => (
        <ListingItem key={listing._id} listing={listing} />
      ))}
    {showMore && (
      <button
        onClick={onShowMoreClick}
        className='text-green-700 hover:underline p-7 text-center w-full'
      >
        Show more
      </button>
    )}
  </div>
</div>
</div>
);
}