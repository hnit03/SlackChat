import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({uploadState, percentUploaded}) => (
    uploadState && (
        <Progress 
            className='progress_bar'
            inverted
            percent={percentUploaded}
            progress
            size="medium"
            indicating
        />
    )
);

export default ProgressBar;
