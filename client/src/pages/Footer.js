import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Logo from '../assets/parcels-icon.png';

const Footer = () => {
    return (
        <footer className='footer'>
            <Grid container spacing={3} >
                <Grid item xs={12} md={4} style={{ textAlign: 'center', padding: '2rem' }}>
                    <img src={Logo} style={{ maxHeight: '100%', height: '90px' }}  alt={""}/>
                </Grid>
                <Grid item xs={12} md={4} style={{ textAlign: 'center', padding: '2rem' }}>             
                    <Link to='/'><Button color="secondary" variant="outlined">Map</Button></Link>
                    <br/>                    
                    <br/>                       
                    <Link to='/dashboard'><Button color="secondary" variant="contained">Dashboard</Button></Link>
                </Grid>
                <Grid item xs={12} md={12} style={{ textAlign: 'center', padding: '0.5rem' , paddingTop: '0.1rem'}}>
                    <p>© 2019, Built with ❤ by <a href='https://github.com/allilou'> Allilou</a></p>
                </Grid>
            </Grid>
        </footer>
    )
}

export default Footer