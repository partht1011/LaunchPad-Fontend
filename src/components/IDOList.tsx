import { useQuery } from '@apollo/client';
import IDO from './IDO';
import {
  GET_CLAIMABLE_POOLS,
  GET_ENDED_POOLS,
  GET_LIVE_POOLS,
  GET_POOLS,
  GET_UPCOMING_POOLS,
} from '../store/queries';
import { IDOListProps } from '../types/props';
import { makeStructure } from '../utils/commonUtils';

const IDOList = ({ activeTab }: IDOListProps) => {
  const { loading, error, data } = useQuery(makeQuery());

  function makeQuery() {
    if (activeTab === 1) {
      return GET_UPCOMING_POOLS;
    } else if (activeTab === 2) {
      return GET_LIVE_POOLS;
    } else if (activeTab === 3) {
      return GET_ENDED_POOLS;
    } else if (activeTab === 4) {
      return GET_CLAIMABLE_POOLS;
    }
    return GET_POOLS;
  }

  return (
    <div>
      {loading && <p className="text-white text-3xl">Loading...</p>}
      {error && <p className="text-pink text-3xl">Error : {error.message}</p>}
      <div className="grid grid-cols-4 grid-flow-row gap-4">
        {data &&
          data.idopoolCreateds &&
          data.idopoolCreateds.map((pool: any) => (
            <IDO key={pool.id} {...makeStructure(pool)} />
          ))}
      </div>
    </div>
  );
};

export default IDOList;
