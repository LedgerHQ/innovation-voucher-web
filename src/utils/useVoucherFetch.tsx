import { useEffect, useState } from "react";
import { Nft } from "@alch/alchemy-web3";

type UseVoucherFetchType = (address: string) => [
  {
    data: Array<Nft>;
    error: Error;
    loading: boolean;
  }
];

const useVoucherFetch: UseVoucherFetchType = (address) => {
  const [data, setData] = useState<Array<Nft>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>(null);

  const fetchVoucher = async () => {
    setLoading(true);

    try {
      const response = await fetch(`api/nfts/${address}`);
      const data = await response.json();
      setData(data.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  // fetch the vouchers on mount then on each account change
  useEffect(() => {
    if (address) fetchVoucher();
  }, [address]);

  return [{ data, error, loading }];
};

export default useVoucherFetch;
