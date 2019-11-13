import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import Link from '@material-ui/core/Link';

export default function AppSnackbar(props) {

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom',  horizontal: 'right' }}
            key={`${'bottom'},${'right'}`}
            open={props.snackbarOpen}
            // onClose={handleSnackbarClose}
            autoHideDuration={6000}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={
                <span id="message-id">
                    <Link href={"https://rinkeby.etherscan.io/tx/" + props.transactionHash}
                        target="_blank"
                        rel="noopener">
                        Claimed parcel added to the immutable Registry
                    </Link>
                </span>}
         />
    );

}
