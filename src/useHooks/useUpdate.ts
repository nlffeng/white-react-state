import { useCallback, useState } from 'react';

const useUpdate = () => {
  const [, setState] = useState(0);
  return useCallback(() => setState((prevState: number) => (prevState === 0 ? 1 : 0)), []);
};

export default useUpdate;
