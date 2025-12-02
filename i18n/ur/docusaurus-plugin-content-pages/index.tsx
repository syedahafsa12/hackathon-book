import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function UrduHome() {
  const history = useHistory();

  useEffect(() => {
    // Redirect to Urdu docs
    history.replace('/ur/docs/intro');
  }, [history]);

  return null;
}
