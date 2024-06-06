import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaRuler } from 'react-icons/fa';
import { FiHeart, FiShare2 } from 'react-icons/fi';

export default function ListingItem({ listing }) {
  const isNew = new Date() - new Date(listing.createdAt) < 7 * 24 * 60 * 60 * 1000;
  const isReduced = listing.offer;
  const isSold = listing.sold;

  let badgeText = '';
  let badgeColor = '';

  if (isSold) {
    badgeText = 'SOLD';
    badgeColor = 'bg-red-500';
  } else if (isReduced) {
    badgeText = 'REDUCED';
    badgeColor = 'bg-blue-500';
  } else if (isNew) {
    badgeText = 'NEW';
    badgeColor = 'bg-green-500';
  }

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <div className="relative">
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt={listing.name}
            className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
            />
          {badgeText && (
            <span className={`absolute top-2 left-2 ${badgeColor} text-white px-2 py-1 text-xs font-semibold rounded`}>
              {badgeText}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-slate-700">
              R{listing.offer
                ? (listing.discountPrice).toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / mo'}
            </p>
            <div className="flex space-x-2">
              
              <button className="text-gray-500 hover:text-blue-500">
                <FiShare2 />
              </button>
            </div>
          </div>
          <p className="truncate text-lg font-semibold text-slate-700 mt-2">
            {listing.name}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate">
              {listing.city}, {listing.subburb}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 text-gray-600">
            <div className="flex items-center gap-1">
              <FaBed className="h-4 w-4" />
              <p className="text-sm">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <FaBath className="h-4 w-4" />
              <p className="text-sm">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <FaRuler className="h-4 w-4" />
              <p className="text-sm">{listing.size} sqft</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </p>
        </div>
      </Link>
    </div>
  );
}