import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({uploadState, percentUploaded}) => (
    uploadState === 'uploading' && (
        <Progress 
            className='progress_bar'
            inverted
            percent={percentUploaded}
            progress
            size="small"
            indicating
        />
    )
);

export default ProgressBar;
