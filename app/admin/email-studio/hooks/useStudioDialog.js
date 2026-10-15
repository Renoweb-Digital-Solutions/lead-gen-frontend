import { useEffect, useRef } from "react";

export default function useStudioDialog() {
  const dialog = useRef(null);

  useEffect(() => {
    const node = dialog.current;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = "hidden";

    // Restore page scrolling when the native dialog unmounts.
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return dialog;
}
