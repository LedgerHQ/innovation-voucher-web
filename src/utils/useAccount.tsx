import { useMemo } from "react";
import { useAccount as useAccountWAGMI } from "wagmi";

type HookReturnType = [...ReturnType<typeof useAccountWAGMI>, boolean];
const useAccount = (): HookReturnType => {
  const [{ data, error, loading }, disconnect] = useAccountWAGMI();
  const isConnected = useMemo(() => !!data?.address, [data]);

  return [{ data, error, loading }, disconnect, isConnected];
};

export default useAccount;
