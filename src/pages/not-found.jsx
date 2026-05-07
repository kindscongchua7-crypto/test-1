import { useEffect } from 'react';

const NotFound = () => {
    useEffect(() => {
        globalThis.location.href = 'about:blank';
    }, []);

    return <></>;
};

export default NotFound;
