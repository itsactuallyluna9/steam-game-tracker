import { useEffect, useState } from "react";

function useClientCheck() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true)
    }, []);
    return isClient
}

// <UseClient>
// <p>Client only content</p>
// </UseClient>

export default function UseClient({ children }: { children: JSX.Element }) {
    const isClient = useClientCheck();
    return isClient ? children : null;
}